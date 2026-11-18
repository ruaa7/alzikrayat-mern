import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm.jsx';
import RegisterForm from '../components/RegisterForm.jsx';

function LoginRegister({ onLogin }) {
  const [mode, setMode] = useState('login');
  const navigate = useNavigate();

  const handleSuccess = (user) => {
    onLogin(user);
    navigate('/gallery');
  };

  return (
    <section className="narrow">
      {mode === 'login' ? (
        <>
          <LoginForm onLogin={handleSuccess} />
          <p className="switch-text">
            New here?{' '}
            <button type="button" className="link-button" onClick={() => setMode('register')}>
              Create an account
            </button>
          </p>
        </>
      ) : (
        <>
          <RegisterForm onLogin={handleSuccess} />
          <p className="switch-text">
            Already registered?{' '}
            <button type="button" className="link-button" onClick={() => setMode('login')}>
              Login
            </button>
          </p>
        </>
      )}
    </section>
  );
}

export default LoginRegister;
