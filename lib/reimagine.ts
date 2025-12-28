export function makePrompt(genderValue: string) {
  const genderPhrase =
    genderValue && genderValue !== "prefer_not_to_say"
      ? `Ensure the subject is ${genderValue.replace("nonbinary", "non-binary").replace(/_/g, " ")}. `
      : "";

  return (
    genderPhrase +
    "Transform this selfie into a highly photorealistic image set in Sbiba, Tunisia (0-500 AC), while preserving the person's facial features, expression, pose, and skin tone as closely as possible. The subject must be smiling and holding a natural selfie pose. Prioritize likeness and high-fidelity face preservation — keep eyes, nose, mouth and bone structure intact. Match natural lighting, camera angle, and depth-of-field from the original photo where possible. Dress the subject in historically inspired traditional attire (Berber / Mediterranean influences) using realistic fabric textures, colors, and jewelry appropriate to the era. Frame the scene with a very beautiful, period-appropriate background including farmers, pottery, market activity, stone structures, and lush Mediterranean landscapes. Do not add or replace the original person. Keep the result strictly photorealistic — avoid painterly, illustrative, cartoon, or CGI styles. If the model cannot reproduce an exact likeness, preserve the face features (especially eyes and facial proportions) rather than applying heavy stylization."
  );
}
