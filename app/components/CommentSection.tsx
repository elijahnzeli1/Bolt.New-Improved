import React, { useState } from 'react';

interface CommentSectionProps {
  comments: string[];
  onCommentSubmit: (comment: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, onCommentSubmit }) => {
  const [newComment, setNewComment] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!newComment.trim()) {
      setError('Comment cannot be empty.');
      return;
    }
    try {
      onCommentSubmit(newComment);
      setNewComment('');
      setError(null);
    } catch (e) {
      setError('Failed to submit comment. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="new-comment" style={{ display: 'block', marginBottom: '5px' }}>Add a comment:</label>
          <input
            id="new-comment"
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            aria-invalid={!!error}
            aria-describedby="comment-error"
          />
          {error && <p id="comment-error" style={{ color: 'red' }}>{error}</p>}
        </div>
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>Submit</button>
      </form>
      <ul style={{ marginTop: '20px' }}>
        {comments.map((comment, index) => (
          <li key={index} style={{ marginBottom: '10px' }}>{comment}</li>
        ))}
      </ul>
    </div>
  );
};

export default CommentSection;