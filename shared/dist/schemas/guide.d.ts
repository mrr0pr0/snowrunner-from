import { z } from "zod";
export declare const createGuideSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    mapId: z.ZodString;
    mapName: z.ZodString;
    published: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    content: string;
    title: string;
    mapId: string;
    mapName: string;
    published: boolean;
}, {
    content: string;
    title: string;
    mapId: string;
    mapName: string;
    published?: boolean | undefined;
}>;
export type CreateGuideSchema = z.infer<typeof createGuideSchema>;
export declare const updateGuideSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    mapId: z.ZodOptional<z.ZodString>;
    mapName: z.ZodOptional<z.ZodString>;
    published: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    content?: string | undefined;
    title?: string | undefined;
    mapId?: string | undefined;
    mapName?: string | undefined;
    published?: boolean | undefined;
}, {
    content?: string | undefined;
    title?: string | undefined;
    mapId?: string | undefined;
    mapName?: string | undefined;
    published?: boolean | undefined;
}>;
export type UpdateGuideSchema = z.infer<typeof updateGuideSchema>;
export declare const guideSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    slug: z.ZodString;
    content: z.ZodString;
    mapId: z.ZodString;
    mapName: z.ZodString;
    authorId: z.ZodString;
    published: z.ZodBoolean;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: string;
    updatedAt: string;
    content: string;
    authorId: string;
    title: string;
    mapId: string;
    mapName: string;
    published: boolean;
    slug: string;
}, {
    id: string;
    createdAt: string;
    updatedAt: string;
    content: string;
    authorId: string;
    title: string;
    mapId: string;
    mapName: string;
    published: boolean;
    slug: string;
}>;
export type GuideSchema = z.infer<typeof guideSchema>;
export declare const guideListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    mapId: z.ZodOptional<z.ZodString>;
    published: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    mapId?: string | undefined;
    published?: "true" | "false" | undefined;
}, {
    mapId?: string | undefined;
    published?: "true" | "false" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
}>;
export type GuideListQuerySchema = z.infer<typeof guideListQuerySchema>;
//# sourceMappingURL=guide.d.ts.map