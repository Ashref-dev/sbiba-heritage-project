async function testHuggingFaceConnection() {
  console.log("🧪 Testing Hugging Face API connection...");

  const HF_TOKEN = process.env.HF_TOKEN;
  const MODEL = "stabilityai/stable-diffusion-xl-base-1.0";

  if (!HF_TOKEN) {
    console.error("❌ HF_TOKEN environment variable not found");
    process.exit(1);
  }

  try {
    // Test 1: Simple text-to-image generation
    console.log("🎨 Testing image generation...");
    const response = await fetch(`https://router.huggingface.co/hf-inference/models/${MODEL}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: "A beautiful sunset over the Mediterranean sea",
        parameters: {
          num_inference_steps: 20,
          guidance_scale: 7.5,
        },
        options: {
          wait_for_model: true,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const contentType = response.headers.get("content-type");
    console.log(`📄 Response content type: ${contentType}`);

    if (contentType?.includes("application/json")) {
      // This might be an error response or queue status
      const jsonResponse = await response.json();
      console.log("📋 JSON Response:", jsonResponse);

      if (jsonResponse.error) {
        throw new Error(`API Error: ${jsonResponse.error}`);
      }
    } else if (contentType?.includes("image/")) {
      // Success! We got an image
      const buffer = await response.arrayBuffer();
      console.log(`✅ Image generated successfully! Size: ${buffer.byteLength} bytes`);

      // Test 2: Check if it's a valid image by checking the first few bytes
      const bytes = new Uint8Array(buffer.slice(0, 8));
      const isPNG = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47;
      const isJPEG = bytes[0] === 0xFF && bytes[1] === 0xD8;

      if (isPNG || isJPEG) {
        console.log(`✅ Valid ${isPNG ? 'PNG' : 'JPEG'} image received`);
      } else {
        console.log("⚠️  Received data but couldn't verify image format");
      }
    } else {
      console.log("⚠️  Unexpected response type:", contentType);
    }

    console.log("🎉 Hugging Face API test completed successfully!");

    // --- Additional image-to-image test using an inline PNG ---
    console.log("\n🔁 Now testing image-to-image (img2img) using a small generated PNG...");
    const sharp = require('sharp');
    const tinyPng = await sharp({ create: { width: 64, height: 64, channels: 3, background: { r: 240, g: 240, b: 240 } } }).png().toBuffer();
    const tinyDataUrl = `data:image/png;base64,${Buffer.from(tinyPng).toString('base64')}`;

    const imgResponse = await fetch(`https://router.huggingface.co/hf-inference/models/${MODEL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          prompt: 'A small, stylized Mediterranean town scenery',
          image: tinyDataUrl,
        },
        parameters: { num_inference_steps: 20, guidance_scale: 7.5, img2img_strength: 0.8 },
      }),
    });

    const imgCt = imgResponse.headers.get('content-type') || '';
    if (!imgResponse.ok) {
      const err = await imgResponse.text();
      throw new Error(`Image-to-image HF error: ${imgResponse.status} ${imgResponse.statusText} - ${err}`);
    }

    if (imgCt.includes('image/')) {
      const b = await imgResponse.arrayBuffer();
      console.log(`✅ Img2img success - received image (${b.byteLength} bytes)`);
    } else {
      const t = await imgResponse.text();
      console.log('⚠️ Img2img unexpected response:', t.slice(0, 400));
    }

  } catch (error) {
    console.error("❌ Hugging Face API test failed:", error);
    process.exit(1);
  }
}

// Run the test
testHuggingFaceConnection();