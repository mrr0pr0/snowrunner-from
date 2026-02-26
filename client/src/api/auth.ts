import { api } from "./client.js";
import type { AuthResponseSchema } from "shared/schemas";
import type { LoginSchema, RegisterSchema } from "shared/schemas";

export interface MeResponse {
  id: string;
  email: string;
  username: string;
  avatarUrl: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export function login(body: LoginSchema): Promise<AuthResponseSchema> {
  return api.post<AuthResponseSchema>("/api/auth/login", body);
}

export function register(body: RegisterSchema): Promise<AuthResponseSchema> {
  return api.post<AuthResponseSchema>("/api/auth/register", body);
}

export function me(): Promise<MeResponse> {
  return api.get<MeResponse>("/api/auth/me");
}
