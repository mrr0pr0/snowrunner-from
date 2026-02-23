import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(2).max(64),
  password: z.string().min(8).max(128),
});
export type RegisterSchema = z.infer<typeof registerSchema>;

export const authResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    username: z.string(),
    avatarUrl: z.string().nullable(),
    role: z.enum(['user', 'admin', 'moderator']),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});
export type AuthResponseSchema = z.infer<typeof authResponseSchema>;
