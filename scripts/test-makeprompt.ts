(async () => {
  try {
    const mod = await import('../lib/reimagine');
    const makePrompt = mod.makePrompt;

    console.log('Testing makePrompt...');
    const male = makePrompt('male');
    console.log('male ->', male.slice(0, 200));
    if (!male.includes('Ensure the subject is male')) throw new Error('male prompt missing gender phrase');
    if (!/photorealistic/i.test(male)) throw new Error('prompt should enforce photorealistic output');
    if (!/preserving the person's facial features|preserve the person's facial features|preserving the facial features/i.test(male)) throw new Error('prompt should require face preservation');
    if (!/smiling/i.test(male)) throw new Error('prompt should require the subject to be smiling');
    if (!/selfie pose/i.test(male)) throw new Error('prompt should require selfie pose');
    if (!/beautiful.*background|very beautiful background/i.test(male)) throw new Error('prompt should require beautiful background');

    const female = makePrompt('female');
    if (!female.includes('Ensure the subject is female')) throw new Error('female prompt missing gender phrase');

    const nonb = makePrompt('nonbinary');
    if (!nonb.includes('Ensure the subject is non-binary')) throw new Error('nonbinary prompt missing gender phrase');

    const pref = makePrompt('prefer_not_to_say');
    if (pref.includes('Ensure the subject')) throw new Error('prefer_not_to_say should not include ensure phrase');

    console.log('makePrompt tests passed ✅');
    process.exit(0);
  } catch (err) {
    console.error('makePrompt test failed:', err);
    process.exit(1);
  }
})();