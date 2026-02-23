import { z } from "zod";

export const createGuideSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  mapId: z.string().min(1).max(200),
  mapName: z.string().min(1).max(200),
  published: z.boolean().default(false),
});
export type CreateGuideSchema = z.infer<typeof createGuideSchema>;

export const updateGuideSchema = createGuideSchema.partial();
export type UpdateGuideSchema = z.infer<typeof updateGuideSchema>;

export const guideSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  mapId: z.string(),
  mapName: z.string(),
  authorId: z.string().uuid(),
  published: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type GuideSchema = z.infer<typeof guideSchema>;

export const guideListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  mapId: z.string().optional(),
  published: z.enum(["true", "false"]).optional(),
});
export type GuideListQuerySchema = z.infer<typeof guideListQuerySchema>;
