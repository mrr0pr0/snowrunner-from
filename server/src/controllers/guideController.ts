import type { Response } from "express";
import { db } from "../db/index.js";
import { guides, users, markers } from "../db/schema.js";
import { eq, and, desc, sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import type { AuthRequest } from "../middleware/auth.js";
import {
  createGuideSchema,
  updateGuideSchema,
  guideListQuerySchema,
  type CreateGuideSchema,
  type UpdateGuideSchema,
} from "shared/schemas";
import type { GuideSelect } from "../db/schema.js";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

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
  const query = req.query as unknown;
  const parsed = guideListQuerySchema.safeParse(query);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }
  const { page, limit, mapId, published } = parsed.data;
  const offset = (page - 1) * limit;

  const conditions: SQL[] = [];
  if (mapId) conditions.push(eq(guides.mapId, mapId));
  if (published === "true") conditions.push(eq(guides.published, true));
  else if (published === "false") conditions.push(eq(guides.published, false));
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const listResult = await db
    .select({
      guide: guides,
      author: {
        id: users.id,
        username: users.username,
        avatarUrl: users.avatarUrl,
        role: users.role,
      },
    })
    .from(guides)
    .innerJoin(users, eq(guides.authorId, users.id))
    .where(whereClause)
    .orderBy(desc(guides.updatedAt))
    .limit(limit)
    .offset(offset);

  const items = listResult.map((r) => ({
    ...r.guide,
    createdAt: r.guide.createdAt.toISOString(),
    updatedAt: r.guide.updatedAt.toISOString(),
    author: toPublicUser(r.author),
  }));

  const [countResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(guides)
    .where(whereClause);

  res.json({
    items,
    total: countResult?.count ?? 0,
    page,
    limit,
  });
}

export async function getById(req: AuthRequest, res: Response): Promise<void> {
  const id = req.params.id as string;
  const result = await db
    .select({
      guide: guides,
      author: {
        id: users.id,
        username: users.username,
        avatarUrl: users.avatarUrl,
        role: users.role,
      },
    })
    .from(guides)
    .innerJoin(users, eq(guides.authorId, users.id))
    .where(eq(guides.id, id));

  if (result.length === 0) {
    res.status(404).json({ error: "Guide not found" });
    return;
  }

  const r = result[0];
  const published = r.guide.published;
  const isAuthor = req.tokenPayload?.userId === r.guide.authorId;
  if (!published && !isAuthor) {
    res.status(404).json({ error: "Guide not found" });
    return;
  }

  res.json({
    ...r.guide,
    createdAt: r.guide.createdAt.toISOString(),
    updatedAt: r.guide.updatedAt.toISOString(),
    author: toPublicUser(r.author),
  });
}

export async function getBySlug(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  const slug = req.params.slug as string;
  const result = await db
    .select({
      guide: guides,
      author: {
        id: users.id,
        username: users.username,
        avatarUrl: users.avatarUrl,
        role: users.role,
      },
    })
    .from(guides)
    .innerJoin(users, eq(guides.authorId, users.id))
    .where(eq(guides.slug, slug));

  if (result.length === 0) {
    res.status(404).json({ error: "Guide not found" });
    return;
  }

  const r = result[0];
  const published = r.guide.published;
  const isAuthor = req.tokenPayload?.userId === r.guide.authorId;
  if (!published && !isAuthor) {
    res.status(404).json({ error: "Guide not found" });
    return;
  }

  res.json({
    ...r.guide,
    createdAt: r.guide.createdAt.toISOString(),
    updatedAt: r.guide.updatedAt.toISOString(),
    author: toPublicUser(r.author),
  });
}

export async function create(req: AuthRequest, res: Response): Promise<void> {
  if (!req.tokenPayload) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const body = req.body as CreateGuideSchema;
  const parsed = createGuideSchema.safeParse(body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }
  const { title, content, mapId, mapName, published } = parsed.data;
  let slug = slugify(title);
  let suffix = 0;
  while (true) {
    const existing = await db
      .select()
      .from(guides)
      .where(eq(guides.slug, suffix ? `${slug}-${suffix}` : slug));
    if (existing.length === 0) break;
    suffix++;
  }
  const finalSlug = suffix ? `${slug}-${suffix}` : slug;
  const [guide] = await db
    .insert(guides)
    .values({
      title,
      content,
      mapId,
      mapName,
      slug: finalSlug,
      authorId: req.tokenPayload.userId,
      published: published ?? false,
    })
    .returning();

  if (!guide) {
    res.status(500).json({ error: "Failed to create guide" });
    return;
  }

  res.status(201).json({
    ...guide,
    createdAt: guide.createdAt.toISOString(),
    updatedAt: guide.updatedAt.toISOString(),
  });
}

export async function update(req: AuthRequest, res: Response): Promise<void> {
  if (!req.tokenPayload) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const id = req.params.id as string;
  const body = req.body as UpdateGuideSchema;
  const parsed = updateGuideSchema.safeParse(body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }

  const [existing] = await db.select().from(guides).where(eq(guides.id, id));
  if (!existing) {
    res.status(404).json({ error: "Guide not found" });
    return;
  }
  if (existing.authorId !== req.tokenPayload.userId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const updateData: Partial<GuideSelect> = {};
  if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
  if (parsed.data.content !== undefined)
    updateData.content = parsed.data.content;
  if (parsed.data.mapId !== undefined) updateData.mapId = parsed.data.mapId;
  if (parsed.data.mapName !== undefined)
    updateData.mapName = parsed.data.mapName;
  if (parsed.data.published !== undefined)
    updateData.published = parsed.data.published;
  updateData.updatedAt = new Date();

  if (parsed.data.title !== undefined) {
    updateData.slug = slugify(parsed.data.title);
  }

  const [updated] = await db
    .update(guides)
    .set(updateData)
    .where(eq(guides.id, id))
    .returning();

  if (!updated) {
    res.status(500).json({ error: "Failed to update guide" });
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
  const [existing] = await db.select().from(guides).where(eq(guides.id, id));
  if (!existing) {
    res.status(404).json({ error: "Guide not found" });
    return;
  }
  if (existing.authorId !== req.tokenPayload.userId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  await db.delete(guides).where(eq(guides.id, id));
  res.status(204).send();
}

export async function getGuideMarkers(
  req: AuthRequest,
  res: Response,
): Promise<void> {
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
  const list = await db
    .select()
    .from(markers)
    .where(eq(markers.guideId, guideId))
    .orderBy(markers.orderIndex, markers.createdAt);

  res.json(
    list.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
    })),
  );
}
