import type { User } from '../types/index.js';
import { me } from '../api/auth.js';

const TOKEN_KEY = 'token';

let currentUser: User | null = null;
let listeners: Array<() => void> = [];

function notify(): void {
  listeners.forEach((l) => l());
}

export function  