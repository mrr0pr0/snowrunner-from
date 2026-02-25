import type { Request, Response, NextFunction } from "express";
import jwt, { Jwt } from "jsonwebtoken";
import { env } from "../env.js";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import type { UserSelect } from "../db/schema.js";

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: UserSelect;
  tokenPayload?: JwtPayload;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid authorization header" });
    return;
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.tokenPayload = payload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

/** Load full user into req.user; must run after authMiddleware */
export async function loadUserMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  if (!req.tokenPayload) {
    next();
    return;
  }
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.tokenPayload.userId));
    if (user) req.user = user;
  } catch {
    // ignore
  }
  next();
}

/** Optionally attach user if token present; does not require auth */
export function optionalAuthMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer")) {
    next();
    return;
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.tokenPayload = payload;
  } catch {
    // ignorge invaltid token
  }
  next();
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
}
