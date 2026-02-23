import { z } from 'zod';
export declare const markerTypeSchema: z.ZodEnum<["waypoint", "hazard", "resource", "garage", "other"]>;
export type MarkerTypeSchema = z.infer<typeof markerTypeSchema>;
export declare const createMarkerSchema: z.ZodObject<{
    guideId: z.ZodString;
    lat: z.ZodNumber;
    lng: z.ZodNumber;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    markerType: z.ZodDefault<z.ZodEnum<["waypoint", "hazard", "resource", "garage", "other"]>>;
    orderIndex: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    guideId: string;
    title: string;
    lat: number;
    lng: number;
    markerType: "waypoint" | "hazard" | "resource" | "garage" | "other";
    description?: string | null | undefined;
    orderIndex?: number | undefined;
}, {
    guideId: string;
    title: string;
    lat: number;
    lng: number;
    description?: string | null | undefined;
    markerType?: "waypoint" | "hazard" | "resource" | "garage" | "other" | undefined;
    orderIndex?: number | undefined;
}>;
export type CreateMarkerSchema = z.infer<typeof createMarkerSchema>;
export declare const updateMarkerSchema: z.ZodObject<{
    lat: z.ZodOptional<z.ZodNumber>;
    lng: z.ZodOptional<z.ZodNumber>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    markerType: z.ZodOptional<z.ZodEnum<["waypoint", "hazard", "resource", "garage", "other"]>>;
    orderIndex: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    lat?: number | undefined;
    lng?: number | undefined;
    description?: string | null | undefined;
    markerType?: "waypoint" | "hazard" | "resource" | "garage" | "other" | undefined;
    orderIndex?: number | undefined;
}, {
    title?: string | undefined;
    lat?: number | undefined;
    lng?: number | undefined;
    description?: string | null | undefined;
    markerType?: "waypoint" | "hazard" | "resource" | "garage" | "other" | undefined;
    orderIndex?: number | undefined;
}>;
export type UpdateMarkerSchema = z.infer<typeof updateMarkerSchema>;
export declare const markerSchema: z.ZodObject<{
    id: z.ZodString;
    guideId: z.ZodString;
    lat: z.ZodNumber;
    lng: z.ZodNumber;
    title: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    markerType: z.ZodEnum<["waypoint", "hazard", "resource", "garage", "other"]>;
    orderIndex: z.ZodNumber;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: string;
    updatedAt: string;
    guideId: string;
    title: string;
    lat: number;
    lng: number;
    description: string | null;
    markerType: "waypoint" | "hazard" | "resource" | "garage" | "other";
    orderIndex: number;
}, {
    id: string;
    createdAt: string;
    updatedAt: string;
    guideId: string;
    title: string;
    lat: number;
    lng: number;
    description: string | null;
    markerType: "waypoint" | "hazard" | "resource" | "garage" | "other";
    orderIndex: number;
}>;
export type MarkerSchema = z.infer<typeof markerSchema>;
//# sourceMappingURL=marker.d.ts.map