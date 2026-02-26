import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchGuideBySlug, fetchGuideMarkers } from '../api/guides.js';
import { fetchComments, createComment } from '../api/comments.js';
import type { GuideWithAuthor } from '../types/index.js';
import type { CommentWithAuthor } from '../types/index.js';
import type { MapMarker } from '../types/index.js';
import { useAuth } from '../hooks/useAuth.js';
import CommentList from '../components/CommentList.js';
import GuideMap from '../components/GuideMap.js';
import './GuideDetailPage.css';

const GuideDetailPage: FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [guide, setGuide] = useState<GuideWithAuthor | null>(null);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    fetchGuideBySlug(slug)
      .then((g) => {
        setGuide(g);
        return Promise.all([
          fetchGuideMarkers(g.id).catch(() => []),
          fetchComments(g.id).catch(() => []),
        ]);
      })
      .then(([m, c]) => {
        const markerList = Array.isArray(m) ? m : [];
        setMarkers(
          markerList.map((x) => ({
            ...x,
            markerType: x.markerType as MapMarker['markerType'],
          }))
        );
        setComments(Array.isArray(c) ? c : []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load guide'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSubmitComment = async () => {
    if (!guide || !user || !commentText.trim()) return;
    setSubmitting(true);
    try {
      const newComment = await createComment({
        guideId: guide.id,
        content: commentText.trim(),
      });
      setComments((prev) => [newComment, ...prev]);
      setCommentText('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !slug) {
    return <p className="guide-detail-loading">Loading…</p>;
  }
  if (error || !guide) {
    return (
      <div className="guide-detail-error">
        <p>{error ?? 'Guide not found'}</p>
        <Link to="/guides">Back to guides</Link>
      </div>
    );
  }

  return (
    <div className="guide-detail">
      <header className="guide-detail-header">
        <h1>{guide.title}</h1>
        <p className="guide-detail-meta">
          {guide.mapName} · by {guide.author?.username ?? 'Unknown'}
        </p>
      </header>
      <div className="guide-detail-content">
        <pre className="guide-detail-body">{guide.content}</pre>
      </div>
      {markers.length > 0 && (
        <section className="guide-detail-markers">
          <h2>Map</h2>
          <GuideMap markers={markers} />
          <h3 className="guide-detail-markers-list-title">Markers</h3>
          <ul>
            {markers.map((m) => (
              <li key={m.id}>
                {m.title} ({m.lat}, {m.lng}) — {m.markerType}
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="guide-detail-comments">
        <h2>Comments</h2>
        {user ? (
          <div className="guide-detail-comment-form">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment…"
              rows={3}
            />
            <button
              type="button"
              onClick={handleSubmitComment}
              disabled={submitting || !commentText.trim()}
            >
              {submitting ? 'Posting…' : 'Post'}
            </button>
          </div>
        ) : (
          <p className="guide-detail-login-prompt">
            <Link to="/login">Log in</Link> to comment.
          </p>
        )}
        <CommentList
          comments={comments}
          currentUserId={user?.id ?? null}
        />
      </section>
    </div>
  );
};

export default GuideDetailPage;
