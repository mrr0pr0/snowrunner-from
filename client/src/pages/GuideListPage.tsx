import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchGuides } from '../api/guides.js';
import type { GuideWithAuthor } from '../types/index.js';
import GuideCard from '../components/GuideCard.js';
import './GuideListPage.css';

const GuideListPage: FC = () => {
  const [items, setItems] = useState<GuideWithAuthor[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const limit = 10;

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchGuides({ page, limit, published: 'true' })
      .then((res) => {
        setItems(res.items);
        setTotal(res.total);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load guides'))
      .finally(() => setLoading(false));
  }, [page]);

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="guide-list-page">
      <div className="guide-list-header">
        <h1>Guides</h1>
        <Link to="/guides/new" className="guide-list-new">
          New Guide
        </Link>
      </div>
      {error && <p className="guide-list-error">{error}</p>}
      {loading ? (
        <p className="guide-list-loading">Loading…</p>
      ) : items.length === 0 ? (
        <p className="guide-list-empty">No guides yet. Create the first one!</p>
      ) : (
        <>
          <ul className="guide-list">
            {items.map((g) => (
              <li key={g.id}>
                <GuideCard guide={g} />
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
            <div className="guide-list-pagination">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GuideListPage;
