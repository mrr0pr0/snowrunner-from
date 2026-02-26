import { api } from "./client.js";
import type { GuideWithAuthor } from "../types/index.js";
import type {
  CreateGuideSchema,
  UpdateGuideSchema,
  GuideListQuerySchema,
} from "shared/schemas";

export interface GuideListResponse {
  items: GuideWithAuthor[];
  total: number;
  page: number;
  limit: number;
}

export function fetchGuides(
  query: Partial<GuideListQuerySchema> = {},
): Promise<GuideListResponse> {
  const params = new URLSearchParams();
  if (query.page != null) params.set("page", String(query.page));
  if (query.limit != null) params.set("limit", String(query.limit));
  if (query.mapId != null) params.set("mapId", query.mapId);
  if (query.published != null) params.set("published", query.published);
  const q = params.toString();
  return api.get<GuideListResponse>(`/api/guides${q ? `?${q}` : ""}`);
}

export function fetchGuideById(id: string): Promise<GuideWithAuthor> {
  return api.get<GuideWithAuthor>(`/api/guides/${id}`);
}

export function fetchGuideBySlug(slug: string): Promise<GuideWithAuthor> {
  return api.get<GuideWithAuthor>(
    `/api/guides/slug/${encodeURIComponent(slug)}`,
  );
}

export function createGuide(body: CreateGuideSchema): Promise<GuideWithAuthor> {
  return api.post<GuideWithAuthor>("/api/guides", body);
}

export function updateGuide(
  id: string,
  body: UpdateGuideSchema,
): Promise<GuideWithAuthor> {
  return api.patch<GuideWithAuthor>(`/api/guides/${id}`, body);
}

export function deleteGuide(id: string): Promise<void> {
  return api.delete<void>(`/api/guides/${id}`);
}

export function fetchGuideMarkers(
  guideId: string,
): Promise<MapMarkerResponse[]> {
  return api.get<MapMarkerResponse[]>(`/api/guides/${guideId}/markers`);
}

export interface MapMarkerResponse {
  id: string;
  guideId: string;
  lat: number;
  lng: number;
  title: string;
  description: string | null;
  markerType: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}
