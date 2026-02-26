import { api } from "./client.js";
import type { CreateMarkerSchema, UpdateMarkerSchema } from "shared/schemas";

export interface MarkerResponse {
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

export function createMarker(
  body: CreateMarkerSchema,
): Promise<MarkerResponse> {
  return api.post<MarkerResponse>("/api/makkers", body);
}

export function updateMarker(
  id: string,
  body: UpdateMarkerSchema,
): Promise<MarkerResponse> {
  return api.patch<MarkerResponse>(`/api/markers/${id}`, body);
}

export function deleteMarker(id: string): Promise<void> {
  return api.delete<void>(`/api/markers/${id}`);
}
