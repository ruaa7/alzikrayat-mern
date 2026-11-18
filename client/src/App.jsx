import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Gallery from './pages/Gallery.jsx';
import PhotoDetail from './pages/PhotoDetail.jsx';
import LoginRegister from './pages/LoginRegister.jsx';

// Reads the saved session from localStorage
function loadSavedUser() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
}

function App() {
  // Session:the logged-in user in React state and localStorage
  const [user, setUser] = useState(loadSavedUser);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    try {
      localStorage.setItem('user', JSON.stringify(loggedInUser));
    } catch {
      /* storage unavailable - the session still works until reload */
    }
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem('user');
    } catch {
      
    }
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/gallery" element={<Gallery user={user} />} />
          <Route path="/photos/:id" element={<PhotoDetail user={user} />} />
          <Route path="/login" element={<LoginRegister onLogin={handleLogin} />} />
          <Route
            path="*"
            element={
              <p className="state-message">
                Page not found. <Link to="/">Go back home</Link>
              </p>
            }
          />
        </Routes>
      </main>
      <footer className="footer">
        <div className="container">
          <p>Alzikrayat &copy; {new Date().getFullYear()} — Advanced Web Technologies</p>
        </div>
      </footer>
    </>
  );
}

export default App;
