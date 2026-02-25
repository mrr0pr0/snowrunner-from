import type { Response } from "express";
import { db } from "../db/index.js";
import { comments, guides, users } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";
import type { AuthRequest } from "../middleware/auth.js";
import {
  createCommentSchema,
  updateCommentSchema,
  type CreateCommentSchema,
  type UpdateCommentSchema,
} from "shared/schemas";

function toPublicUser(u: {
  id: string;
  username: string;
  avatarUrl: string | null;
  role: string;
}) {
  return {
    id: u.id,
    username: u.username,
    avatarUrl: u.avatarUrl,
    role: u.role,
  };
}

export async function list(req: AuthRequest, res: Response): Promise<void> {
  const guideId = req.params.guideId as string;
  const [guide] = await db.select().from(guides).where(eq(guides.id, guideId));
  if (!guide) {
    res.status(404).json({ error: "Guide not found" });
    return;
  }
  if (!guide.published && req.tokenPayload?.userId !== guide.authorId) {
    res.status(404).json({ error: "Guide not found" });
    return;
  }
  const listResult = await db
    .select({
      comment: comments,
      author: {
        id: users.id,
        username: users.username,
        avatarUrl: users.avatarUrl,
        role: users.role,
      },
    })
    .from(comments)
    .innerJoin(users, eq(comments.authorId, users.id))
    .where(eq(comments.guideId, guideId))
    .orderBy(desc(comments.createdAt));

  res.json(
    listResult.map((r) => ({
      ...r.comment,
      createdAt: r.comment.createdAt.toISOString(),
      updatedAt: r.comment.updatedAt.toISOString(),
      author: toPublicUser(r.author),
    })),
  );
}

export async function create(req: AuthRequest, res: Response): Promise<void> {
  if (!req.tokenPayload) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const body = req.body as CreateCommentSchema;
  const parsed = createCommentSchema.safeParse(body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }
  const [guide] = await db
    .select()
    .from(guides)
    .where(eq(guides.id, parsed.data.guideId));
  if (!guide) {
    res.status(404).json({ error: "Guide not found" });
    return;
  }
  if (!guide.published) {
    res.status(400).json({ error: "Cannot comment on unpublished guide" });
    return;
  }
  const [comment] = await db
    .insert(comments)
    .values({
      guideId: parsed.data.guideId,
      authorId: req.tokenPayload.userId,
      content: parsed.data.content,
    })
    .returning();

  if (!comment) {
    res.status(500).json({ error: "Failed to create comment" });
    return;
  }
  const [author] = await db
    .select()
    .from(users)
    .where(eq(users.id, comment.authorId));
  res.status(201).json({
    ...comment,
    createdAt: comment.createdAt.toISOString(),
    updatedAt: comment.updatedAt.toISOString(),
    author: author ? toPublicUser(author) : undefined,
  });
}

export async function update(req: AuthRequest, res: Response): Promise<void> {
  if (!req.tokenPayload) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const id = req.params.id as string;
  const body = req.body as UpdateCommentSchema;
  const parsed = updateCommentSchema.safeParse(body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }
  const [existing] = await db
    .select()
    .from(comments)
    .where(eq(comments.id, id));
  if (!existing || existing.authorId !== req.tokenPayload.userId) {
    res.status(404).json({ error: "Comment not found" });
    return;
  }
  const [updated] = await db
    .update(comments)
    .set({ content: parsed.data.content, updatedAt: new Date() })
    .where(eq(comments.id, id))
    .returning();

  if (!updated) {
    res.status(500).json({ error: "Failed to update comment" });
    return;
  }
  res.json({
    ...updated,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  });
}

export async function remove(req: AuthRequest, res: Response): Promise<void> {
  if (!req.tokenPayload) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const id = req.params.id as string;
  const [existing] = await db
    .select()
    .from(comments)
    .where(eq(comments.id, id));
  if (!existing || existing.authorId !== req.tokenPayload.userId) {
    res.status(404).json({ error: "Comment not found" });
    return;
  }
  await db.delete(comments).where(eq(comments.id, id));
  res.status(204).send();
}
