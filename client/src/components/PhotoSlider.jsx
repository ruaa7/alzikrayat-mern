import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Slider view: one photo at a time with previous
function PhotoSlider({ photos }) {
  const [index, setIndex] = useState(0);

  const goNext = () => setIndex((current) => (current + 1) % photos.length);
  const goPrev = () => setIndex((current) => (current - 1 + photos.length) % photos.length);

  useEffect(() => {
    if (photos.length < 2) return undefined;
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [photos.length, index]);

  const photo = photos[index % photos.length];
  const firstName = photo.userId ? photo.userId.firstName : 'Unknown';
  const lastName = photo.userId ? photo.userId.lastName : '';

  return (
    <div className="slider">
      <Link to={`/photos/${photo._id}`}>
        <img src={`/uploads/${photo.fileName}`} alt={photo.title} />
      </Link>

      <div className="slider-caption">
        <h5>{photo.title}</h5>
        <p>
          by {firstName} {lastName}
        </p>
      </div>

      {photos.length > 1 && (
        <>
          <button type="button" className="slider-control slider-prev" onClick={goPrev} aria-label="Previous photo">
            ‹
          </button>
          <button type="button" className="slider-control slider-next" onClick={goNext} aria-label="Next photo">
            ›
          </button>
        </>
      )}
    </div>
  );
}

export default PhotoSlider;
