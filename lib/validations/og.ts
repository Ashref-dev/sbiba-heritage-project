import { z } from "zod";

export const ogImageSchema = z.object({
  heading: z.string(),
  type: z.string(),
  mode: z.enum(["light", "dark"]).default("dark"),
});

export type OgImageParams = z.infer<typeof ogImageSchema>; 