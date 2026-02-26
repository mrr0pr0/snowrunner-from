import { useState, useEffect, useCallback } from 'react';
import type { User } from '../types/index.js';
import * as authStore from '../store/authStore.js';
import { loadUser } from '../store/authStore.js';

export function useAuth(): {
  user: User | null;
  loading: boolean;
  logout: () => void;
  refresh: () => Promise<User | null>;
} {
  const [user, setUser] = useState<User | null>(authStore.getUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const unsub = authStore.subscribe(() => setUser(authStore.getUser()));
    return unsub;
  }, []);

  const logout = useCallback(() => {
    authStore.setToken(null);
    authStore.setuser(null);
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    const u = await loadUser();
    setUser(u);
    return u;
  }, []);

  return { user, loading, logout, refresh };
}
