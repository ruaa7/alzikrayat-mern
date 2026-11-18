import { useState } from 'react';

// Upload form sends the image + metadata to POST /api/photos
function UploadForm({ user, onUploaded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!file) {
      setError('Please choose an image to upload');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('photo', file);

    setLoading(true);
    try {
      const res = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'x-user-id': user._id }, // the browser sets the multipart Content-Type itself
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Upload failed');

      onUploaded(data);
      setTitle('');
      setDescription('');
      setFile(null);
      event.target.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Add a photo</h2>

      <label htmlFor="photoFile">Image (JPG, PNG, GIF or WEBP, up to 5 MB)</label>
      <input
        id="photoFile"
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={(e) => setFile(e.target.files[0] || null)}
        required
      />

      <label htmlFor="photoTitle">Title</label>
      <input
        id="photoTitle"
        value={title}
        maxLength={200}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label htmlFor="photoDescription">Description (optional)</label>
      <textarea
        id="photoDescription"
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {error && <p className="error-message">{error}</p>}

      <button type="submit" className="btn" disabled={loading}>
        {loading ? 'Uploading...' : 'Upload photo'}
      </button>
    </form>
  );
}

export default UploadForm;
