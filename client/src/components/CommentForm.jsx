import { useState } from 'react';

function CommentForm({ photoId, user, onCommentAdded }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`/api/photos/${photoId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user._id },
        body: JSON.stringify({ comment: text }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Could not add the comment');

      onCommentAdded(data);
      setText('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="text"
          aria-label="Add a comment"
          placeholder="Add a comment..."
          maxLength={1000}
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
    </form>
  );
}

export default CommentForm;
