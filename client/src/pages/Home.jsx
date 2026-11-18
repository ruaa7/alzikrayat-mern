import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home({ user }) {
  const [stats, setStats] = useState(null); // { totalPhotos, totalUsers }
  const [recentPhotos, setRecentPhotos] = useState([]);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setStats(data))
      .catch(() => {});

    fetch('/api/photos')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setRecentPhotos(data.slice(0, 6)))
      .catch(() => {});
  }, []);

  return (
    <>
      <section className="hero">
        <h1>Welcome to Alzikrayat</h1>
        <p>
          "Alzikrayat" means <em>memories</em> — a simple, fast place to upload,
          browse, and comment on the photos that matter to you and your friends.
        </p>
        <div className="hero-actions">
          <Link to="/gallery" className="btn btn-light btn-lg">
            Browse Gallery
          </Link>
          {user ? (
            <Link to="/gallery?upload=1" className="btn btn-light btn-lg">
              Upload a Photo
            </Link>
          ) : (
            <Link to="/login" className="btn btn-light btn-lg">
              Join Now
            </Link>
          )}
        </div>
      </section>

      <div className="stats">
        <div className="stat-card">
          <h2>{stats ? stats.totalPhotos : '—'}</h2>
          <p>Photos Shared</p>
        </div>
        <div className="stat-card">
          <h2>{stats ? stats.totalUsers : '—'}</h2>
          <p>Active Members</p>
        </div>
      </div>

      {recentPhotos.length > 0 && (
        <>
          <h3 className="section-title">Recent Memories</h3>
          <div className="recent-grid">
            {recentPhotos.map((photo) => (
              <Link key={photo._id} to={`/photos/${photo._id}`}>
                <img src={`/uploads/${photo.fileName}`} alt={photo.title} loading="lazy" />
              </Link>
            ))}
          </div>
        </>
      )}

      <section className="about-card" id="about">
        <h3>About Us</h3>
        <p>
          Every photo holds a moment worth remembering: a family gathering, a trip with friends, a quiet
          evening, or a day you never want to forget.
        </p>
      </section>
    </>
  );
}

export default Home;
