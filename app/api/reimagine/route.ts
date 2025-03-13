import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fal } from "@fal-ai/client";
import sharp from "sharp";
import Together from "together-ai";

fal.config({
  credentials: process.env.FAL_KEY!,
});

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY!,
});

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const dynamic = "force-dynamic";

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

    // Fetch the original image
    const imageResponse = await fetch(url);
    if (!imageResponse.ok) {
      throw new Error("Failed to fetch original image");
    }

    // Convert the image to buffer
    const imageBuffer = await imageResponse.arrayBuffer();

    // Use Sharp to convert the image to PNG format for Fal AI compatibility
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

    // Create a clean URL for the PNG image
    const pngUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${tempKey}`;

    // Add timeout promise
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), 500000),
    );

    const resultPromise = fal.subscribe("fal-ai/flux-pro/v1.1-ultra/redux", {
      input: {
        prompt:
          "Transform this selfie into a vibrant scene set in Sbiba, Tunisia, around 0-500 AC, while preserving the facial features and gender of the person in the uploaded photo. The image should feature a lush landscape with ancient mountains and fertile valleys, reminiscent of the Kasserine region. Dress the subject in traditional attire from that era, influenced by Berber and ancient Mediterranean cultures, using colorful woven fabrics and ornamental jewelry that reflect the individual's style. Surround the subject with elements of daily life such as people engaged in farming, pottery making, or trading in a bustling marketplace. Incorporate historical features like stone structures or megalithic monuments, mirroring the architectural styles of the time. Keep the human elements from the uploaded photo as intact as possible.",
        num_images: 1,
        enable_safety_checker: true,
        safety_tolerance: "2",
        output_format: "png",
        aspect_ratio: "16:9",
        image_url: pngUrl,
        image_prompt_strength: 0.8,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
          console.log("in queue 🚀");
        }
      },
    });

    // Race between timeout and actual request
    const result = await Promise.race([resultPromise, timeoutPromise]);
    // @ts-expect-error fal returns a different type than together
    if (!result || !result.data?.images?.[0]?.url) {
      throw new Error("No image generated");
    }
    // @ts-expect-error fal returns a different type than together
    const imageUrl = result.data.images[0].url;
    const key = randomUUID();

    // Fetch with timeout
    const generatedImageResponse = await fetch(imageUrl);
    if (!generatedImageResponse.ok) {
      throw new Error("Failed to fetch generated image");
    }

    const generatedBuffer = await generatedImageResponse.arrayBuffer();

    // Optimize the generated image to JPG format
    const optimizedBuffer = await sharp(Buffer.from(generatedBuffer))
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

    const uploadUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

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
    console.error("Upload error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
