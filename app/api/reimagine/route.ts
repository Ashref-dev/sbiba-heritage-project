import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import sharp from "sharp";

export const dynamic = "force-dynamic";

const HF_TOKEN = process.env.HF_TOKEN;
const MODEL = "stabilityai/stable-diffusion-xl-base-1.0";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_S3_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const body = await request.json();
    const { url } = body;

    // Extract S3 key from URL formats:
    // - http://localhost:9000/sbiba-bucket/uploads/1234567890.jpg -> uploads/1234567890.jpg
    // - https://s3.amazonaws.com/bucket/uploads/1234567890.jpg -> uploads/1234567890.jpg
    // - uploads/1234567890.jpg (relative path) -> uploads/1234567890.jpg

    let key: string;

    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/").filter((p) => p);
      const bucketName = process.env.AWS_S3_BUCKET!;
      const bucketIndex = pathParts.findIndex((part) => part === bucketName);

      if (bucketIndex >= 0) {
        key = pathParts.slice(bucketIndex + 1).join("/");
      } else {
        key = pathParts.join("/");
      }
    } catch {
      // If URL parsing fails, assume it's already a key or handle relative paths
      key = url.replace(/^\//, ""); // Remove leading slash if present
    }

    if (!key) {
      throw new Error("Failed to extract S3 key from URL");
    }

    const maskedKey = key.length > 16 ? `...${key.slice(-12)}` : key;
    console.log("S3 Key extracted (masked):", maskedKey); // Debug log (masked to avoid leaking full keys)

    // Download the original image directly from S3
    const getCommand = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
    });

    const s3Response = await s3Client.send(getCommand);
    const imageBuffer = await s3Response.Body!.transformToByteArray();

    // Use Sharp to convert the image to PNG format for Hugging Face compatibility
    const pngBuffer = await sharp(Buffer.from(imageBuffer))
      .png({ quality: 90 })
      .toBuffer();

    // Upload the PNG version to S3
    const tempKey = `temp/${randomUUID()}.png`;

    const tempUploadParams = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: tempKey,
      Body: pngBuffer,
      ContentType: "image/png",
    };

    await s3Client.send(new PutObjectCommand(tempUploadParams));

    // Create a URL for the PNG image (use the same format as upload route)
    const pngUrl = `${process.env.AWS_S3_ENDPOINT}/${process.env.AWS_S3_BUCKET}/${tempKey}`;

    // Add timeout promise
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), 500000),
    );

    // Resize PNG to limit payload size for HF and send inline as a data URL
    const resizedPngBuffer = await sharp(pngBuffer)
      .resize({ width: 1024, withoutEnlargement: true })
      .png({ quality: 90 })
      .toBuffer();

    const pngDataUrl = `data:image/png;base64,${resizedPngBuffer.toString("base64")}`;
    console.log(
      "Hugging Face payload image size (bytes):",
      resizedPngBuffer.length,
    );

    const payload = {
      inputs: {
        prompt:
          "Transform this selfie into a vibrant scene set in Sbiba, Tunisia, around 0-500 AC, while preserving the facial features and gender of the person in the uploaded photo. The image should feature a lush landscape with ancient mountains and fertile valleys, reminiscent of the Kasserine region. Dress the subject in traditional attire from that era, influenced by Berber and ancient Mediterranean cultures, using colorful woven fabrics and ornamental jewelry that reflect the individual's style. Surround the subject with elements of daily life such as people engaged in farming, pottery making, or trading in a bustling marketplace. Incorporate historical features like stone structures or megalithic monuments, mirroring the architectural styles of the time. Keep the human elements from the uploaded photo as intact as possible.",
        image: pngDataUrl,
        strength: 0.8,
      },
      parameters: {
        num_inference_steps: 20,
        guidance_scale: 7.5,
      },
    };

    const resultPromise = fetch(
      `https://router.huggingface.co/hf-inference/models/${MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    ).then(async (response) => {
      const contentType = response.headers.get("content-type") || "";

      // Read body as arrayBuffer for image/binary responses, otherwise as text
      let text = "";
      let arrBuf: ArrayBuffer | null = null;
      if (
        contentType.includes("image/") ||
        contentType.includes("application/octet-stream")
      ) {
        arrBuf = await response.arrayBuffer();
      } else {
        text = await response.text();
      }

      if (!response.ok) {
        // Try to surface the error body for better debugging
        let errMsg = "";
        try {
          if (arrBuf) {
            // try to decode as utf-8 text if possible
            errMsg = Buffer.from(arrBuf).toString("utf8");
          } else {
            const parsed = JSON.parse(text);
            errMsg = parsed.error || parsed.detail || JSON.stringify(parsed);
          }
        } catch (e) {
          errMsg = arrBuf ? `<binary data ${arrBuf.byteLength} bytes>` : text;
        }
        console.error(
          "Hugging Face not ok:",
          response.status,
          response.statusText,
          "body:",
          errMsg,
        );
        throw new Error(
          `Hugging Face API error: ${response.status} ${response.statusText} - ${errMsg}`,
        );
      }

      // If response is an image bytes
      if (
        contentType.includes("image/") ||
        contentType.includes("application/octet-stream")
      ) {
        const buffer = Buffer.from(arrBuf!);
        console.log("Hugging Face returned image bytes, size:", buffer.length);
        return {
          data: {
            images: [
              {
                url: `data:${contentType};base64,${buffer.toString("base64")}`,
              },
            ],
          },
        };
      }

      // If JSON, try to extract image data
      if (contentType.includes("application/json")) {
        const json = JSON.parse(text);
        // Check several common places where HF returns image data
        // 1) array of base64 strings
        if (Array.isArray(json)) {
          if (typeof json[0] === "string") {
            return {
              data: { images: [{ url: `data:image/png;base64,${json[0]}` }] },
            };
          }
        }
        // 2) object with images or generated_images
        const b64 =
          json?.images?.[0]?.b64_json ||
          json?.generated_images?.[0]?.b64_json ||
          json?.image ||
          json?.data?.[0];
        if (typeof b64 === "string") {
          return {
            data: { images: [{ url: `data:image/png;base64,${b64}` }] },
          };
        }

        throw new Error(
          `Unexpected JSON from HF: ${JSON.stringify(json).slice(0, 512)}`,
        );
      }

      throw new Error(
        `Unexpected content-type from Hugging Face: ${contentType}`,
      );
    });

    // Race between timeout and actual request
    const result = (await Promise.race([resultPromise, timeoutPromise])) as {
      data: { images: [{ url: string }] };
    };
    if (!result || !result.data?.images?.[0]?.url) {
      throw new Error("No image generated");
    }
    const imageUrl = result.data.images[0].url;
    key = randomUUID();

    // Convert base64 data URL to buffer
    const base64Data = imageUrl.split(",")[1];
    const generatedBuffer = Buffer.from(base64Data, "base64");

    // Validate generated buffer before piping to sharp
    try {
      await sharp(generatedBuffer).metadata();
    } catch (err) {
      // Log diagnostics for easier debugging
      const header = generatedBuffer.slice(0, 16).toString("hex");
      console.error("Generated buffer metadata failed:", err);
      console.error(
        "Buffer length:",
        generatedBuffer.length,
        "header(hex):",
        header,
      );
      // Save failing buffer to temp key for inspection **only** when debugging is enabled
      if (process.env.REIMAGINE_DEBUG === "true") {
        try {
          const debugKey = `debug/failing-${randomUUID()}.bin`;
          await s3Client.send(
            new PutObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET!,
              Key: debugKey,
              Body: generatedBuffer,
              ContentType: "application/octet-stream",
            }),
          );
          console.error(
            `Saved failing buffer to s3://${process.env.AWS_S3_BUCKET}/${debugKey}`,
          );
        } catch (saveErr) {
          console.error("Failed to save failing buffer to S3:", saveErr);
        }
      } else {
        console.error(
          "Skipping debug artifact upload (REIMAGINE_DEBUG not set). Set REIMAGINE_DEBUG=true to enable.",
        );
      }

      throw new Error(
        `Generated image buffer is invalid or unsupported by sharp`,
      );
    }

    // Optimize the generated image to JPG format
    const optimizedBuffer = await sharp(generatedBuffer)
      .jpeg({
        quality: 85,
        mozjpeg: true,
      })
      .toBuffer();

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      Body: optimizedBuffer,
      ContentType: "image/jpeg",
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    // Create a URL in the same format as upload route
    // Generate a presigned GET URL for MinIO/S3 compatibility (no public bucket required)
    const expiresInSeconds =
      Number(process.env.SIGNED_URL_EXPIRES_SECONDS) || 60 * 60; // default 1 hour
    const signedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({ Bucket: process.env.AWS_S3_BUCKET!, Key: key }),
      { expiresIn: expiresInSeconds },
    );
    const maskedKeyForLogs = key.length > 12 ? `...${key.slice(-12)}` : key;
    console.log(
      `Generated signed URL (expires in ${expiresInSeconds}s) for ${maskedKeyForLogs}`,
    );
    const uploadUrl = signedUrl;

    // Clean up temporary PNG file
    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET!,
          Key: tempKey,
          Body: Buffer.from(""),
          ContentLength: 0,
        }),
      );
    } catch (cleanupError) {
      console.error("Failed to clean up temporary file:", cleanupError);
    }

    revalidatePath("/");

    return new Response(JSON.stringify({ url: uploadUrl }), {
      status: 200,
    });
  } catch (error: unknown) {
    // Log full error details server-side
    console.error("Upload error:", error);

    // Return sanitized message to client unless explicit debug is enabled
    const clientMessage =
      process.env.REIMAGINE_DEBUG === "true" && error instanceof Error
        ? error.message
        : "Internal server error during image generation";

    return new Response(JSON.stringify({ error: clientMessage }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
