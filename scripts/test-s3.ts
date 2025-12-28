import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_S3_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function testS3Connection() {
  console.log("🧪 Testing S3/MinIO connection...");

  try {
    // Test 1: List objects in bucket
    console.log("📋 Testing bucket access...");
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.AWS_S3_BUCKET,
      MaxKeys: 5,
    });

    const listResponse = await s3Client.send(listCommand);
    console.log("✅ Bucket access successful");
    console.log(`📊 Found ${listResponse.KeyCount || 0} objects in bucket`);

    // Test 2: Upload a test file
    console.log("📤 Testing file upload...");
    const testContent = "Hello from Sbiba Heritage test script!";
    const testKey = `test-${Date.now()}.txt`;

    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: testKey,
      Body: testContent,
      ContentType: "text/plain",
    });

    await s3Client.send(uploadCommand);
    console.log("✅ File upload successful");

    // Test 3: Download the test file
    console.log("📥 Testing file download...");
    const downloadCommand = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: testKey,
    });

    const downloadResponse = await s3Client.send(downloadCommand);
    const downloadedContent = await downloadResponse.Body?.transformToString();

    if (downloadedContent === testContent) {
      console.log("✅ File download successful");
    } else {
      console.log("❌ File download failed - content mismatch");
    }

    // Test 4: Generate a public URL
    const publicUrl = `${process.env.AWS_S3_ENDPOINT}/${process.env.AWS_S3_BUCKET}/${testKey}`;
    console.log(`🔗 Public URL: ${publicUrl}`);

    console.log("🎉 All S3/MinIO tests passed!");

  } catch (error) {
    console.error("❌ S3/MinIO test failed:", error);
    process.exit(1);
  }
}

// Run the test
testS3Connection();