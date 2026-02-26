import { z } from "zod";

const clientEnvSchema = z.object({
  VITE_API_URL: z.string().url().optional(),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;

function loadEnv(): ClientEnv {
  const parsed = clientEnvSchema.safeParse({
    VITE_API_URL: import.meta.env.VITE_API_URL,
  });
  if (!parsed.success) {
    return {};
  }
  return parsed.data;
}

export const clientEnv = loadEnv();

export const API_BASE = clientEnv.VITE_API_URL ?? "";
