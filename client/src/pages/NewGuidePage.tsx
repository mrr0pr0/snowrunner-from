import type { FC } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGuide } from '../api/guides.js';
import type { CreateGuideSchema } from 'shared/schemas';
import { useAuth } from '../hooks/useAuth.js';
import './NewGuidePage.css';

const NewGuidePage: FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mapId, setMapId] = useState('');
  const [mapName, setMapName] = useState('');
  const [published, setPublished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <p className="new-guide-login">
        Please <a href="/login">log in</a> to create a guide.
      </p>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !content.trim() || !mapId.trim() || !mapName.trim()) {
      setError('Fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const body: CreateGuideSchema = {
        title: title.trim(),
        content: content.trim(),
        mapId: mapId.trim(),
        mapName: mapName.trim(),
        published,
      };
      const guide = await createGuide(body);
      navigate(`/guides/${guide.slug}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create guide');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-guide">
      <h1>New Guide</h1>
      <form onSubmit={handleSubmit} className="new-guide-form">
        {error && <p className="new-guide-error">{error}</p>}
        <label>
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Black River – Main route"
            required
          />
        </label>
        <label>
          Map ID
          <input
            value={mapId}
            onChange={(e) => setMapId(e.target.value)}
            placeholder="e.g. michigan_black_river"
            required
          />
        </label>
        <label>
          Map name
          <input
            value={mapName}
            onChange={(e) => setMapName(e.target.value)}
            placeholder="e.g. Black River"
            required
          />
        </label>
        <label>
          Content
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your guide…"
            rows={12}
            required
          />
        </label>
        <label className="new-guide-checkbox">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Publish (visible to everyone)
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating…' : 'Create guide'}
        </button>
      </form>
    </div>
  );
};

export default NewGuidePage;
