import type { User } from '../types/index.js';
import { me } from '../api/auth.js';


const TOKEN_KEY = 'token';

let currentUser: User | null = null;
let listeners: Array<() => void> = [];

function notify(): void {
  listeners.forEach((l) => l());
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
  currentUser = null;
  notify()
}

export function setuser(user: User | null): void {
  currentUser = user;
  notify();
}

export function getUser(): User | null {
  return currentUser;
}

export function subscribe(listener: () => void): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export async function loadUser(): Promise<User | null> {
  const token = getToken();
  if (!token) {
    setuser(null);
    return null;
  }
  try {
    const user = await me();
    const u: User = {
      id: user.id,
      email: user.email,
      username: user.username,
      avatarUrl: user.avatarUrl,
      role: user.role as User['role'],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    setuser(u);
    return u;
  } catch {
    setToken(null);
    setuser(null);
    return null;
  }
}
