(async () => {
  try {
    const { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } = await import('@aws-sdk/client-s3');
    const s3Client = new S3Client({
      region: process.env.AWS_REGION ?? '',
      endpoint: process.env.AWS_S3_ENDPOINT ?? '',
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
      },
    } as any);

    const key = `tests/original-${Date.now()}.txt`;
    const bucket = process.env.AWS_S3_BUCKET;
    if (!bucket) throw new Error('AWS_S3_BUCKET not set');

    console.log('Uploading test object to S3:', key);
    await s3Client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: 'test-data' }));

    // Confirm exists
    await s3Client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    console.log('Head succeeded; object exists.');

    // Delete
    await s3Client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    console.log('Delete command sent. Waiting briefly...');
    await new Promise((r) => setTimeout(r, 1000));

    try {
      await s3Client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
      throw new Error('Object still exists after delete');
    } catch (err: any) {
      if (err?.$metadata?.httpStatusCode === 404 || err?.name === 'NotFound') {
        console.log('Object deleted successfully ✅');
        process.exit(0);
      }
      console.error('Unexpected error after delete:', err);
      process.exit(1);
    }
  } catch (err) {
    console.error('test-reimagine-delete failed:', err);
    process.exit(1);
  }
})();