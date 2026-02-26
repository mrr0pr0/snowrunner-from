import type { FC } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth.js';
import { setToken, setuser } from '../store/authStore.js';
import type { RegisterSchema } from 'shared/schemas';
import { registerSchema } from 'shared/schemas';
import './AuthPage.css';

const RegisterPage: FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = registerSchema.safeParse({ email, username, password });
    if (!parsed.success) {
      setError('Invalid input. Username 2–64 chars, password at least 8.');
      return;
    }
    setLoading(true);
    try {
      const res = await register(parsed.data as RegisterSchema);
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
      setError(e instanceof Error ? e.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <h1>Sign up</h1>
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
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={2}
            maxLength={64}
            autoComplete="username"
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
            maxLength={128}
            autoComplete="new-password"
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Sign up'}
        </button>
      </form>
      <p className="auth-footer">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
