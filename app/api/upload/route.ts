import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import sharp from "sharp";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

interface UploadResult {
  url: string;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      throw new Error("No file uploaded");
    }

    // Get the original buffer from the file
    const originalBuffer = Buffer.from(await file.arrayBuffer());

    // Use Sharp to convert and optimize the image to JPG format
    const optimizedBuffer = await sharp(originalBuffer)
      .jpeg({
        quality: 85, // Adjust quality as needed (0-100)
        mozjpeg: true, // Use mozjpeg for better compression
      })
      .toBuffer();

    // Generate a consistent filename with .jpg extension
    const fileName = `${Date.now()}.jpg`;
    const key = `uploads/${fileName}`;

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      Body: optimizedBuffer,
      ContentType: "image/jpeg",
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return new Response(JSON.stringify({ url }), { status: 200 });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({ error: "Failed to upload image" }), {
      status: 500,
    });
  }
}
