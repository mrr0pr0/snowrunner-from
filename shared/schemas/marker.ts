import { z } from 'zod';

export const markerTypeSchema = z.enum(['waypoint', 'hazard', 'resource', 'garage', 'other']);
export type MarkerTypeSchema = z.infer<typeof markerTypeSchema>;

export const createMarkerSchema = z.object({
  guideId: z.string().uuid(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).nullable().optional(),
  markerType: markerTypeSchema.default('waypoint'),
  orderIndex: z.number().int().min(0).optional(),
});
export type CreateMarkerSchema = z.infer<typeof createMarkerSchema>;

export const updateMarkerSchema = z.object({
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).nullable().optional(),
  markerType: markerTypeSchema.optional(),
  orderIndex: z.number().int().min(0).optional(),
});
export type UpdateMarkerSchema = z.infer<typeof updateMarkerSchema>;

export const markerSchema = z.object({
  id: z.string().uuid(),
  guideId: z.string().uuid(),
  lat: z.number(),
  lng: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  markerType: markerTypeSchema,
  orderIndex: z.number().int(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type MarkerSchema = z.infer<typeof markerSchema>;
