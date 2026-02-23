import { z } from 'zod';
export declare const userRoleSchema: z.ZodEnum<["user", "admin", "moderator"]>;
export type UserRoleSchema = z.infer<typeof userRoleSchema>;
export declare const publicUserSchema: z.ZodObject<{
    id: z.ZodString;
    username: z.ZodString;
    avatarUrl: z.ZodNullable<z.ZodString>;
    role: z.ZodEnum<["user", "admin", "moderator"]>;
}, "strip", z.ZodTypeAny, {
    username: string;
    id: string;
    avatarUrl: string | null;
    role: "user" | "admin" | "moderator";
}, {
    username: string;
    id: string;
    avatarUrl: string | null;
    role: "user" | "admin" | "moderator";
}>;
export type PublicUserSchema = z.infer<typeof publicUserSchema>;
export declare const userSchema: z.ZodObject<{
    id: z.ZodString;
    username: z.ZodString;
    avatarUrl: z.ZodNullable<z.ZodString>;
    role: z.ZodEnum<["user", "admin", "moderator"]>;
} & {
    email: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    username: string;
    id: string;
    avatarUrl: string | null;
    role: "user" | "admin" | "moderator";
    createdAt: string;
    updatedAt: string;
}, {
    email: string;
    username: string;
    id: string;
    avatarUrl: string | null;
    role: "user" | "admin" | "moderator";
    createdAt: string;
    updatedAt: string;
}>;
export type UserSchema = z.infer<typeof userSchema>;
export declare const updateProfileSchema: z.ZodObject<{
    username: z.ZodOptional<z.ZodString>;
    avatarUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    username?: string | undefined;
    avatarUrl?: string | null | undefined;
}, {
    username?: string | undefined;
    avatarUrl?: string | null | undefined;
}>;
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
//# sourceMappingURL=user.d.ts.map