import type { FC } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth.js';
import { setToken, setuser } from '../store/authStore.js';
import type { LoginSchema } from 'shared/schemas';
import { loginSchema } from 'shared/schemas';
import './AuthPage.css';

const LoginPage: FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError('Invalid email or password format');
      return;
    }
    setLoading(true);
    try {
      const res = await login(parsed.data as LoginSchema);
      setToken(res.token);
      setuser({
        id: res.user.id,
        email: res.user.email,
        username: res.user.username,
        avatarUrl: res.user.avatarUrl,
        role: res.user.role as 'user' | 'admin' | 'moderator',
        createdAt: res.user.createdAt,
        updatedAt: res.user.updatedAt,
      });
      navigate('/guides');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <h1>Log in</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <p className="auth-error">{error}</p>}
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="current-password"
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <p className="auth-footer">
        Don&apos;t have an account? <Link to="/register">Sign up</Link>
      </p>
    </div>
  );
};

export default LoginPage;
