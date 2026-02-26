import type { FC } from 'react';
import type { CommentWithAuthor } from '../types/index.js';
import './CommentList.css';

export interface CommentListProps {
  comments: CommentWithAuthor[];
  currentUserId: string | null;
  onEdit?: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
}

const CommentList: FC<CommentListProps> = ({
  comments,
  currentUserId,
  onEdit,
  onDelete,
}) => {
  return (
    <ul className="comment-list">
      {comments.map((c) => (
        <li key={c.id} className="comment-item">
          <div className="comment-header">
            <span className="comment-author">{c.author?.username ?? 'Unknown'}</span>
            <span className="comment-date">
              {new Date(c.createdAt).toLocaleDateString()}
            </span>
            {currentUserId === c.authorId && (
              <span className="comment-actions">
                {onEdit && (
                  <button
                    type="button"
                    className="comment-action"
                    onClick={() => onEdit(c.id, c.content)}
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    className="comment-action"
                    onClick={() => onDelete(c.id)}
                  >
                    Delete
                  </button>
                )}
              </span>
            )}
          </div>
          <p className="comment-content">{c.content}</p>
        </li>
      ))}
    </ul>
  );
};

export default CommentList;
