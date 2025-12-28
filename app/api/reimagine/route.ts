import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import sharp from "sharp";

import { makePrompt } from "@/lib/reimagine";

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
    const { url, gender = "prefer_not_to_say", square = true } = body;

    // Extract S3 key from URL formats:
    // - http://localhost:9000/sbiba-bucket/uploads/1234567890.jpg -> uploads/1234567890.jpg
    // - https://s3.amazonaws.com/bucket/uploads/1234567890.jpg -> uploads/1234567890.jpg
    // - uploads/1234567890.jpg (relative path) -> uploads/1234567890.jpg

    let key: string;
    // Save source key so we can delete the original upload after a successful generation if configured
    let sourceKey: string | null = null;

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

    // Store original source key for optional deletion later
    sourceKey = key;

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
    // If client requested square output, send a centered square crop to the model
    const resizeTransformer = sharp(pngBuffer).png({ quality: 90 });
    const resizedPngBuffer = square
      ? await resizeTransformer
          .resize({
            width: 1024,
            height: 1024,
            fit: "cover",
            position: "center",
          })
          .toBuffer()
      : await resizeTransformer
          .resize({ width: 1024, withoutEnlargement: true })
          .toBuffer();

    const pngDataUrl = `data:image/png;base64,${resizedPngBuffer.toString("base64")}`;
    console.log(
      "Hugging Face payload image size (bytes):",
      resizedPngBuffer.length,
      "(square:",
      square,
      ")",
    );

    // Try models: SDXL-base-1.0 (text-to-image)
    const modelCandidates = [
      {
        id: "stabilityai/stable-diffusion-xl-base-1.0",
        name: "SDXL-base-1.0",
      },
    ];

    // Applied rules: append-gender-to-prompt, enforce-square-output (if requested), delete-source-image-after-success
    console.log(
      "Rules applied: append-gender-to-prompt, enforce-square-output, delete-source-image-after-success",
    );

    const callModel = async (modelId: string) => {
      const payload = {
        inputs: makePrompt(gender),
        parameters: {
          num_inference_steps: 20,
          guidance_scale: 7.5,
        },
      };

      console.log(`Trying ${modelId} with text prompt`);

      const response = await fetch(
        `https://router.huggingface.co/hf-inference/models/${modelId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const contentType = response.headers.get("content-type") || "";
      const text = contentType.includes("application/json")
        ? await response.text()
        : "";
      let arrBuf: ArrayBuffer | null = null;
      if (
        contentType.includes("image/") ||
        contentType.includes("application/octet-stream")
      )
        arrBuf = await response.arrayBuffer();

      if (!response.ok) {
        const errBody = arrBuf
          ? Buffer.from(new Uint8Array(arrBuf)).toString("utf8")
          : text;
        console.warn(
          `Model ${modelId} failed:`,
          response.status,
          response.statusText,
          errBody.slice?.(0, 200) ?? errBody,
        );

        if (response.status === 429 || response.status >= 500) {
          throw new Error(`rate_or_server:${response.status}`);
        }

        throw new Error("model_failed");
      }

      // Success: image bytes?
      if (arrBuf) {
        const buffer = Buffer.from(new Uint8Array(arrBuf));
        console.log(
          `Model ${modelId} returned image bytes, size: ${buffer.length}`,
        );
        return { contentType, buffer };
      }

      // Try parse JSON for base64
      if (contentType.includes("application/json")) {
        const json = JSON.parse(text);
        if (Array.isArray(json) && typeof json[0] === "string") {
          return {
            contentType: "image/png",
            buffer: Buffer.from(json[0], "base64"),
          };
        }
        const b64 =
          json?.images?.[0]?.b64_json ||
          json?.generated_images?.[0]?.b64_json ||
          json?.image ||
          json?.data?.[0];
        if (typeof b64 === "string") {
          return {
            contentType: "image/png",
            buffer: Buffer.from(b64, "base64"),
          };
        }
      }

      // Unexpected response
      console.warn(`Model ${modelId} returned unexpected response`);
      throw new Error("unsupported_response");
    };

    // Attempt models in order, handling rate limits by trying the next
    let finalResult: { contentType: string; buffer: Buffer } | null = null;

    for (const model of modelCandidates) {
      try {
        console.log(`Attempting model ${model.name} (${model.id})`);
        finalResult = await callModel(model.id);
        if (finalResult) {
          console.log(`Model ${model.name} succeeded`);
          break;
        }
      } catch (err: any) {
        const msg = String(err?.message || err);
        console.warn(`Model ${model.name} failed: ${msg}`);
        // rate_or_server indicates 429/5xx; try next model
        if (msg.startsWith("rate_or_server:")) continue;
        // unsupported_image_or_no_result or others: try next model
        continue;
      }
    }

    if (!finalResult) {
      throw new Error("No model generated an image");
    }

    // Normalize to former return shape
    const buffer = finalResult.buffer;
    const contentType = finalResult.contentType;
    const dataUrl = `data:${contentType};base64,${buffer.toString("base64")}`;

    const resultPromise = Promise.resolve({
      data: { images: [{ url: dataUrl }] },
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

    // If square output was requested, center-crop and resize to 1024x1024 before validating
    let bufferToValidate: Buffer = generatedBuffer;
    if (square) {
      try {
        bufferToValidate = await sharp(generatedBuffer)
          .resize({
            width: 1024,
            height: 1024,
            fit: "cover",
            position: "center",
          })
          .toBuffer();
      } catch (err) {
        console.error("Failed to apply square crop to generated image:", err);
      }
    }

    // Validate generated buffer before piping to sharp
    try {
      await sharp(bufferToValidate).metadata();
    } catch (err) {
      // Log diagnostics for easier debugging
      const header = bufferToValidate.slice(0, 16).toString("hex");
      console.error("Generated buffer metadata failed:", err);
      console.error(
        "Buffer length:",
        bufferToValidate.length,
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
    const optimizedBuffer = await sharp(bufferToValidate)
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

    // Clean up temporary PNG file (delete) and optionally delete the user's original upload for privacy
    try {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET!,
          Key: tempKey,
        }),
      );
    } catch (cleanupError) {
      console.error("Failed to clean up temporary file:", cleanupError);
    }

    // Optionally delete the original uploaded image to honor user privacy
    try {
      const shouldDeleteOriginal =
        process.env.REIMAGINE_DELETE_ORIGINAL !== "false";
      if (shouldDeleteOriginal && sourceKey) {
        const maskedSource =
          sourceKey.length > 16 ? `...${sourceKey.slice(-12)}` : sourceKey;
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET!,
            Key: sourceKey,
          }),
        );
        console.log(
          `Deleted original uploaded object: ${maskedSource} (rule: delete-source-image-after-success)`,
        );
      }
    } catch (delErr) {
      console.error("Failed to delete original uploaded image:", delErr);
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
