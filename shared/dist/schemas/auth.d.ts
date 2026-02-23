import { z } from "zod";
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type LoginSchema = z.infer<typeof loginSchema>;
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    username: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    username: string;
}, {
    email: string;
    password: string;
    username: string;
}>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export declare const authResponseSchema: z.ZodObject<{
    token: z.ZodString;
    user: z.ZodObject<{
        id: z.ZodString;
        email: z.ZodString;
        username: z.ZodString;
        avatarUrl: z.ZodNullable<z.ZodString>;
        role: z.ZodEnum<["user", "admin", "moderator"]>;
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
}, "strip", z.ZodTypeAny, {
    token: string;
    user: {
        email: string;
        username: string;
        id: string;
        avatarUrl: string | null;
        role: "user" | "admin" | "moderator";
        createdAt: string;
        updatedAt: string;
    };
}, {
    token: string;
    user: {
        email: string;
        username: string;
        id: string;
        avatarUrl: string | null;
        role: "user" | "admin" | "moderator";
        createdAt: string;
        updatedAt: string;
    };
}>;
export type AuthResponseSchema = z.infer<typeof authResponseSchema>;
//# sourceMappingURL=auth.d.ts.map