import { z } from "zod";
export declare const createCommentSchema: z.ZodObject<{
    guideId: z.ZodString;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    guideId: string;
    content: string;
}, {
    guideId: string;
    content: string;
}>;
export type CreateCommentSchema = z.infer<typeof createCommentSchema>;
export declare const updateCommentSchema: z.ZodObject<{
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    content: string;
}, {
    content: string;
}>;
export type UpdateCommentSchema = z.infer<typeof updateCommentSchema>;
export declare const commentSchema: z.ZodObject<{
    id: z.ZodString;
    guideId: z.ZodString;
    authorId: z.ZodString;
    content: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: string;
    updatedAt: string;
    guideId: string;
    content: string;
    authorId: string;
}, {
    id: string;
    createdAt: string;
    updatedAt: string;
    guideId: string;
    content: string;
    authorId: string;
}>;
export type CommentSchema = z.infer<typeof commentSchema>;
//# sourceMappingURL=comment.d.ts.map