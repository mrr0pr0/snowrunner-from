import type { FC } from 'react';
import type { GuideWithAuthor } from '../types/index.js';
import { Link } from 'react-router-dom';



export interface guideCardProps {
    guide: GuideWithAuthor
}

const guideCard: FC<guideCardProps> = ({ guide }) => {
    return (
        <article className="guide-card">
            <Link to={`/guides/${guide.slug}`} className="guide-card-link">
                <h3 className="guide-card-title">{guide.title}</h3>
                <p className="guide-card-meta">
                    {guide.mapName} · by {guide.author?.username ?? 'Unknown'}
                </p>
                <p className="guide-card-excerpt">
                    {guide.content.slice(0, 120)}
                    {guide.content.length > 120 ? '…' : ''}
                </p>
                {!guide.published && <span className="guide-card-draft">Draft</span>}
            </Link>
        </article>
    );
};

export default guideCard;