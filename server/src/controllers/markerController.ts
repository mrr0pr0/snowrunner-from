import type { Response } from 'express';
import { db } from '../db/index.js';
import { markers, guides } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import type { AuthRequest } from '../middleware/auth.js';
import {
  createMarkerSchema,
  updateMarkerSchema,
  type CreateMarkerSchema,
  type UpdateMarkerSchema,
} from 'shared/schemas';

export async function create(req: AuthRequest, res: Response): Promise<void> {
  if (!req.tokenPayload) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  const body = req.body as CreateMarkerSchema;
  const parsed = createMarkerSchema.safeParse(body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
    return;
  }
  const [guide] = await db.select().from(guides).where(eq(guides.id, parsed.data.guideId));
  if (!guide || guide.authorId !== req.tokenPayload.userId) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  const [marker] = await db
    .insert(markers)
    .values({
      guideId: parsed.data.guideId,
      lat: parsed.data.lat,
      lng: parsed.data.lng,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      markerType: parsed.data.markerType ?? 'waypoint',
      orderIndex: parsed.data.orderIndex ?? 0,
    })
    .returning();

  if (!marker) {
    res.status(500).json({ error: 'Failed to create marker' });
    return;
  }
  res.status(201).json({
    ...marker,
    createdAt: marker.createdAt.toISOString(),
    updatedAt: marker.updatedAt.toISOString(),
  });
}

export async function update(req: AuthRequest, res: Response): Promise<void> {
  if (!req.tokenPayload) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  const id = req.params.id as string;
  const body = req.body as UpdateMarkerSchema;
  const parsed = updateMarkerSchema.safeParse(body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
    return;
  }

  const [existing] = await db.select().from(markers).where(eq(markers.id, id));
  if (!existing) {
    res.status(404).json({ error: 'Marker not found' });
    return;
  }
  const [guide] = await db.select().from(guides).where(eq(guides.id, existing.guideId));
  if (!guide || guide.authorId !== req.tokenPayload.userId) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  const [updated] = await db
    .update(markers)
    .set({
      ...(parsed.data.lat !== undefined && { lat: parsed.data.lat }),
      ...(parsed.data.lng !== undefined && { lng: parsed.data.lng }),
      ...(parsed.data.title !== undefined && { title: parsed.data.title }),
      ...(parsed.data.description !== undefined && { description: parsed.data.description }),
      ...(parsed.data.markerType !== undefined && { markerType: parsed.data.markerType }),
      ...(parsed.data.orderIndex !== undefined && { orderIndex: parsed.data.orderIndex }),
      updatedAt: new Date(),
    })
    .where(eq(markers.id, id))
    .returning();

  if (!updated) {
    res.status(500).json({ error: 'Failed to update marker' });
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
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  const id = req.params.id as string;
  const [existing] = await db.select().from(markers).where(eq(markers.id, id));
  if (!existing) {
    res.status(404).json({ error: 'Marker not found' });
    return;
  }
  const [guide] = await db.select().from(guides).where(eq(guides.id, existing.guideId));
  if (!guide || guide.authorId !== req.tokenPayload.userId) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  await db.delete(markers).where(eq(markers.id, id));
  res.status(204).send();
}
