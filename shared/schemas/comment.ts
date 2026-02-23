import { z } from 'zod';

const maxContentNumber = 5000 // ask before edit to lager number 

export const createCommentSchema =z.object({
    guideId: z.string().uuid(),
    content: z.string().min(1).max(maxContentNumber) 
});
export type CreateCommentSchema = z.infer<typeof createCommentSchema>;

export const updateCommentSchema = z.object({
    content: z.string().min(1).max(maxContentNumber),
});
export type UpdateCommentSchema = z.infer<typeof updateCommentSchema>;

export const commentSchema = z.object({
    id: z.string().uuid(),
    guideId: z.string().uuid(),
    authorId: z.string().uuid(),
    content: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});
export type CommentSchema = z.infer<typeof commentSchema>;