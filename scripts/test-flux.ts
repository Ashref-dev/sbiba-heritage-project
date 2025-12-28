async function testFluxImg2Img() {
  const HF_TOKEN = process.env.HF_TOKEN;
  const MODEL = 'black-forest-labs/FLUX.1-schnell';
  if (!HF_TOKEN) {
    console.error('❌ HF_TOKEN environment variable not found');
    process.exit(1);
  }

  try {
    const sharp = require('sharp');
    console.log('🎯 Generating tiny PNG (128x128) for img2img test...');
    const tinyPng = await sharp({ create: { width: 128, height: 128, channels: 3, background: { r: 220, g: 200, b: 185 } } }).png().toBuffer();
    const tinyDataUrl = `data:image/png;base64,${Buffer.from(tinyPng).toString('base64')}`;

    const payloads = [
      // some models expect 'init_image'
      {
        inputs: {
          prompt: 'A warm, historic market in North Africa with soft painterly style',
          init_image: tinyDataUrl,
        },
        parameters: { num_inference_steps: 20, guidance_scale: 7.0, img2img_strength: 0.7 },
      },
      // some expect array of images
      {
        inputs: {
          prompt: 'A warm, historic market in North Africa with soft painterly style',
          init_images: [tinyDataUrl],
        },
        parameters: { num_inference_steps: 20, guidance_scale: 7.0, img2img_strength: 0.7 },
      },
    ];

    let res: Response | null = null;
    let usedPayloadIndex = -1;

    for (let i = 0; i < payloads.length; i++) {
      const payload = payloads[i];
      console.log(`🚀 Trying payload variant ${i}...`);
      const start = Date.now();
      const r = await fetch(`https://router.huggingface.co/hf-inference/models/${MODEL}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${HF_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const duration = Date.now() - start;
      console.log(`⏱️ Variant ${i} responded in ${duration}ms - status ${r.status}`);
      if (r.ok) {
        res = r;
        usedPayloadIndex = i;
        break;
      } else {
        const text = await r.text();
        console.warn(`Variant ${i} failed:`, r.status, r.statusText, text.slice(0, 800));
      }
    }

    if (!res) {
      console.warn('All payload variants failed; attempting text-to-image test to verify model capabilities...');

      const textOnlyRes = await fetch(`https://router.huggingface.co/hf-inference/models/${MODEL}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${HF_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: 'A warm, historic market in North Africa, painterly style' }),
      });

      console.log('Text-only response status', textOnlyRes.status);
      const ct2 = textOnlyRes.headers.get('content-type') || '';
      console.log('Text-only content-type:', ct2);

      if (!textOnlyRes.ok) {
        const t = await textOnlyRes.text();
        throw new Error(`Text-only HF error: ${textOnlyRes.status} ${textOnlyRes.statusText} - ${t}`);
      }

      if (ct2.includes('image/')) {
        const arr = await textOnlyRes.arrayBuffer();
        const buf = Buffer.from(arr);
        console.log('✅ Text->image returned image bytes, size:', buf.length);
        const fs = require('fs');
        fs.mkdirSync('./tmp', { recursive: true });
        const outPath = `./tmp/flux-text-${Date.now()}.png`;
        fs.writeFileSync(outPath, buf);
        console.log('Saved text->image output to', outPath);
      } else {
        const txt = await textOnlyRes.text();
        console.log('Text-only returned non-image response:', txt.slice(0, 1000));
      }

      return;
    }

    console.log(`⏱️ Response received - status ${res.status}`);

    const ct = res.headers.get('content-type') || '';
    console.log('Content-Type:', ct);

    if (!res.ok) {
      const text = await res.text();
      console.error('❌ HF returned error:', res.status, res.statusText, text.slice(0, 1000));
      process.exit(1);
    }

    if (ct.includes('image/') || ct.includes('application/octet-stream')) {
      const arr = await res.arrayBuffer();
      const buf = Buffer.from(arr);
      console.log('✅ Received image bytes, size:', buf.length);
      const outPath = `./tmp/flux-test-${Date.now()}.png`;
      const fs = require('fs');
      fs.mkdirSync('./tmp', { recursive: true });
      fs.writeFileSync(outPath, buf);
      console.log('Saved output to', outPath);
    } else {
      const text = await res.text();
      console.log('Received non-image response:', text.slice(0, 2000));
    }

    console.log('🎉 FLUX img2img test completed');
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
}

// run
testFluxImg2Img();