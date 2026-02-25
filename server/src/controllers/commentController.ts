import type { Response } from 'express';
import { db } from '../db/index.js';
import { comments, guides, users } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import type { AuthRequest } from '../middleware/auth.js';
import {
  createCommentSchema,
  updateCommentSchema,
  type CreateCommentSchema,
  type UpdateCommentSchema,
} from 'shared/schemas';

function toPublicUser(u: { id: string; username: string; avatarUrl: string | null; role: string }) {
  return { id: u.id, username: u.username, avatarUrl: u.avatarUrl, role: u.role };
}

export async function list(req: AuthRequest, res: Response): Promise<void> {
    const guideId = req.params.guideId as string;
    const [guide] = await db.select().from(guides).where(eq(guides.id, guideId));
    
}