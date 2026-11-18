import { useState } from 'react';

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  location: '',
  occupation: '',
  description: '',
};

// Register form: calls POST /api/auth/register then logs the new user in
function RegisterForm({ onLogin }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Create an account</h2>

      <label htmlFor="firstName">First name</label>
      <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} required />

      <label htmlFor="lastName">Last name</label>
      <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} required />

      <label htmlFor="registerEmail">Email</label>
      <input
        id="registerEmail"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <label htmlFor="registerPassword">Password (at least 6 characters)</label>
      <input
        id="registerPassword"
        name="password"
        type="password"
        minLength={6}
        value={form.password}
        onChange={handleChange}
        required
      />

      <label htmlFor="location">Location (optional)</label>
      <input id="location" name="location" value={form.location} onChange={handleChange} />

      <label htmlFor="occupation">Occupation (optional)</label>
      <input id="occupation" name="occupation" value={form.occupation} onChange={handleChange} />

      <label htmlFor="description">About you (optional)</label>
      <textarea
        id="description"
        name="description"
        rows={3}
        value={form.description}
        onChange={handleChange}
      />

      {error && <p className="error-message">{error}</p>}

      <button type="submit" className="btn" disabled={loading}>
        {loading ? 'Creating account...' : 'Register'}
      </button>
    </form>
  );
}

export default RegisterForm;
