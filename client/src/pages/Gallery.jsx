import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PhotoCard from '../components/PhotoCard.jsx';
import PhotoSlider from '../components/PhotoSlider.jsx';
import UploadForm from '../components/UploadForm.jsx';

// Display styles the user can switch between
const views = [
  { id: 'grid3', label: '3-Column' },
  { id: 'grid4', label: '4-Column' },
  { id: 'list', label: 'List' },
  { id: 'slider', label: 'Slider' },
];

function Gallery({ user }) {
  const [searchParams] = useSearchParams();

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('grid3');
  const [showUpload, setShowUpload] = useState(searchParams.get('upload') === '1');

  // Fetch all photos from the API when the page loads
  useEffect(() => {
    fetch('/api/photos')
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error((data && data.message) || 'Could not load photos');
        return data;
      })
      .then((data) => setPhotos(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleUploaded = (photo) => {
    setPhotos([photo, ...photos]);
    setShowUpload(false);
  };

  return (
    <section>
      <div className="page-header">
        <h2>Gallery</h2>

        <div className="page-actions">
          <div className="btn-group" role="group" aria-label="Display style">
            {views.map((v) => (
              <button
                key={v.id}
                type="button"
                className={view === v.id ? 'btn btn-sm btn-outline-secondary active' : 'btn btn-sm btn-outline-secondary'}
                onClick={() => setView(v.id)}
              >
                {v.label}
              </button>
            ))}
          </div>

          {user && (
            <button type="button" className="btn btn-sm" onClick={() => setShowUpload(!showUpload)}>
              {showUpload ? 'Close' : 'Add photo'}
            </button>
          )}
        </div>
      </div>

      {!user && (
        <p className="notice">
          <Link to="/login">Please login</Link> to upload photos and leave comments.
        </p>
      )}

      {user && showUpload && (
        <div className="narrow">
          <UploadForm user={user} onUploaded={handleUploaded} />
        </div>
      )}

      {loading && <p className="state-message">Loading photos...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && photos.length === 0 && (
        <p className="notice">No photos yet. Be the first to add one.</p>
      )}

      {photos.length > 0 && view === 'slider' && <PhotoSlider photos={photos} />}

      {view === 'list' && (
        <div className="photo-list">
          {photos.map((photo) => (
            <PhotoCard key={photo._id} photo={photo} view="list" />
          ))}
        </div>
      )}

      {(view === 'grid3' || view === 'grid4') && (
        <div className={view === 'grid4' ? 'photo-grid photo-grid-4' : 'photo-grid'}>
          {photos.map((photo) => (
            <PhotoCard key={photo._id} photo={photo} view="grid" />
          ))}
        </div>
      )}
    </section>
  );
}

export default Gallery;
