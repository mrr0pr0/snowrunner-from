import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchGuides } from '../api/guides.js';
import type { GuideWithAuthor } from '../types/index.js';
import { useAuth } from '../hooks/useAuth.js';
import './AdminPage.css';

const AdminPage: FC = () => {
  const { user } = useAuth();
  const [guides, setGuides] = useState<GuideWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'mine'>('all');

  const isAdmin = user?.role === 'admin' || user?.role === 'moderator';

  useEffect(() => {
    setLoading(true);
    fetchGuides({ page: 1, limit: 50 })
      .then((res) => setGuides(res.items))
      .catch(() => setGuides([]))
      .finally(() => setLoading(false));
  }, []);

  if (!user) {
    return (
      <div className="admin-page">
        <p>Please <Link to="/login">log in</Link> to access admin.</p>
      </div>
    );
  }

  const myGuides = guides.filter((g) => g.authorId === user.id);
  const list = filter === 'mine' ? myGuides : guides;

  return (
    <div className="admin-page">
      <h1>Admin</h1>
      {!isAdmin && (
        <p className="admin-info">
          Here you can see your own guides. Admin features require moderator role.
        </p>
      )}
      <div className="admin-filters">
        <button
          type="button"
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All guides
        </button>
        <button
          type="button"
          className={filter === 'mine' ? 'active' : ''}
          onClick={() => setFilter('mine')}
        >
          My guides
        </button>
      </div>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <ul className="admin-guide-list">
          {list.map((g) => (
            <li key={g.id}>
              <Link to={`/guides/${g.slug}`}>{g.title}</Link>
              <span className="admin-guide-meta">
                {g.mapName} · {g.author?.username ?? 'Unknown'}
                {!g.published && ' · Draft'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminPage;
