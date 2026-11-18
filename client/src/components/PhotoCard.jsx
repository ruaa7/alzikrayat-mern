import { Link } from 'react-router-dom';

function PhotoCard({ photo, view }) {
  const firstName = photo.userId ? photo.userId.firstName : 'Unknown';
  const fullName = photo.userId ? `${photo.userId.firstName} ${photo.userId.lastName}` : 'Unknown';
  const imageUrl = `/uploads/${photo.fileName}`;

  if (view === 'list') {
    return (
      <Link to={`/photos/${photo._id}`} className="photo-row">
        <img src={imageUrl} alt={photo.title} loading="lazy" />
        <div>
          <h6>{photo.title}</h6>
          <small>
            by {fullName} · {new Date(photo.dateTime).toLocaleString()}
          </small>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/photos/${photo._id}`} className="photo-card">
      <img src={imageUrl} alt={photo.title} loading="lazy" />
      <div className="photo-card-body">
        <p className="photo-title">{photo.title}</p>
        <p className="photo-by">by {firstName}</p>
      </div>
    </Link>
  );
}

export default PhotoCard;
