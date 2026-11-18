import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CommentForm from '../components/CommentForm.jsx';

function PhotoDetail({ user }) {
  const { id } = useParams(); // photo id from the URL (/photos/:id)
  const navigate = useNavigate();

  const [photo, setPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  // Fetch the photo and its comments
  useEffect(() => {
    setLoading(true);
    setError('');

    fetch(`/api/photos/${id}`)
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error((data && data.message) || 'Could not load the photo');
        return data;
      })
      .then((data) => {
        setPhoto(data);
        setComments(data.comments);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCommentAdded = (comment) => {
    setComments([...comments, comment]);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this photo permanently?')) return;

    setDeleting(true);
    setError('');
    try {
      const res = await fetch(`/api/photos/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': user._id },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Could not delete the photo');

      navigate('/gallery');
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  if (loading) return <p className="state-message">Loading photo...</p>;
  if (!photo) {
    return (
      <p className="error-message">
        {error || 'Photo not found'} <Link to="/gallery">Back to the gallery</Link>
      </p>
    );
  }

  const owner = photo.userId ? `${photo.userId.firstName} ${photo.userId.lastName}` : 'Unknown';
  const isOwner = user && photo.userId && photo.userId._id === user._id;

  return (
    <section>
      <Link to="/gallery" className="back-link">
        Back to the gallery
      </Link>

      <div className="detail-grid">
        <div>
          <img className="detail-image" src={`/uploads/${photo.fileName}`} alt={photo.title} />
        </div>

        <div className="detail-info">
          <div className="detail-head">
            <h2>{photo.title}</h2>
            {isOwner && (
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            )}
          </div>

          <p className="muted">
            by {owner} · {new Date(photo.dateTime).toLocaleString()}
          </p>
          {photo.description && <p>{photo.description}</p>}
          {error && <p className="error-message">{error}</p>}

          <hr />

          <h5>Comments ({comments.length})</h5>
          <div className="comments-box">
            {comments.length === 0 && (
              <p className="muted">No comments yet. Be the first to comment!</p>
            )}
            {comments.map((c) => (
              <div className="comment" key={c._id}>
                <strong>{c.userId ? `${c.userId.firstName} ${c.userId.lastName}` : 'Unknown'}</strong>
                <small> · {new Date(c.dateTime).toLocaleString()}</small>
                <p>{c.comment}</p>
              </div>
            ))}
          </div>

          {user ? (
            <CommentForm photoId={photo._id} user={user} onCommentAdded={handleCommentAdded} />
          ) : (
            <p>
              <Link to="/login">Log in</Link> to add a comment.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default PhotoDetail;
