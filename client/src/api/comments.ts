import { api } from "./client.js";
import type { CommentWithAuthor } from "../types/index.js";
import type { CreateCommentSchema, UpdateCommentSchema } from "shared/schemas";

export function fetchComments(guideId: string): Promise<CommentWithAuthor[]> {
  return api.get<CommentWithAuthor[]>(`/api/comments/guide/${guideId}`);
}

export function createComment(
  body: CreateCommentSchema,
): Promise<CommentWithAuthor> {
  return api.post<CommentWithAuthor>("/api/comments", body);
}

export function updateComment(
  id: string,
  body: UpdateCommentSchema,
): Promise<CommentWithAuthor> {
  return api.patch<CommentWithAuthor>(`/api/comments/${id}`, body);
}

export function deleteComment(id: string): Promise<void> {
  return api.delete<void>(`/api/comments/${id}`);
}
