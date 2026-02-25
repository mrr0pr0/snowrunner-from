import type { Response } from 'express';
import { hash, compare } from 'bcrypt';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { loginSchema, registerSchema, type LoginSchema, type RegisterSchema } from 'shared/schemas';
import type { AuthRequest } from '../middleware/auth.js';
import { signToken } from '../middleware/auth.js';
import { authResponseSchema } from 'shared/schemas';

const SALT_ROUNDS = 10;

function toAuthResponse(user: { id: string; email: string; username: string; avatarUrl: string | null; role: string; createdAt: Date; updatedAt: Date }, token: string) {
  return authResponseSchema.parse({
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      avatarUrl: user.avatarUrl,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    },
  });
}

export async function register(
  req: AuthRequest,
  res: Response
): Promise<void> {
  const body = req.body as RegisterSchema;
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
    return;
  }
  const { email, username, password } = parsed.data;
  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length > 0) {
    res.status(409).json({ error: 'Email already registered' });
    return;
  }
  const existingUsername = await db.select().from(users).where(eq(users.username, username));
  if (existingUsername.length > 0) {
    res.status(409).json({ error: 'Username already taken' });
    return;
  }
  const passwordHash = await hash(password, SALT_ROUNDS);
  const [user] = await db
    .insert(users)
    .values({ email, username, passwordHash })
    .returning();
  if (!user) {
    res.status(500).json({ error: 'Failed to create user' });
    return;
  }
  const token = signToken({ userId: user.id, email: user.email });
  res.status(201).json(toAuthResponse(user, token));
}

export async function login(req: AuthRequest, res: Response): Promise<void> {
  const body = req.body as LoginSchema;
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
    return;
  }
  const { email, password } = parsed.data;
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user || !(await compare(password, user.passwordHash))) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }
  const token = signToken({ userId: user.id, email: user.email });
  res.json(toAuthResponse(user, token));
}

export async function me(req: AuthRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  const u = req.user;
  res.json({
    id: u.id,
    email: u.email,
    username: u.username,
    avatarUrl: u.avatarUrl,
    role: u.role,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
  });
}
