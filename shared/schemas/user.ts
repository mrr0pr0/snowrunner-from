import { z } from 'zod';

export const userRoleSchema = z.enum(['user', 'admin', 'moderator']);
export type UserRoleSchema = z.infer<typeof userRoleSchema>;

export const publicUserSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(1).max(64),
  avatarUrl: z.string().url().nullable(),
  role: userRoleSchema,
});
export type PublicUserSchema = z.infer<typeof publicUserSchema>;

export const userSchema = publicUserSchema.extend({
  email: z.string().email(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type UserSchema = z.infer<typeof userSchema>;

export const updateProfileSchema = z.object({
  username: z.string().min(2).max(64).optional(),
  avatarUrl: z.string().url().nullable().optional(),
});
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
