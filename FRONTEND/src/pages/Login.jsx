import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { setTokens } from '../auth';

const Login = () => {
  useEffect(() => {
    document.title = 'Area Riservata Login';
  }, []);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
  const [showForgot, setShowForgot] = useState(false);
  const [forgotId, setForgotId] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
=======
>>>>>>> d11cca6 (first commit)
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { username, password });
      setTokens(data.accessToken, data.refreshToken);
      navigate('/private');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 420 }}>
      <div className="card">
        <div className="card-body">
          <h3 className="mb-3">Area Riservata - Login</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Accesso in corso...' : 'Accedi'}
            </button>
          </form>
<<<<<<< HEAD
          <div className="d-flex justify-content-between align-items-center mt-3">
            <button className="btn btn-link p-0" onClick={() => { setShowForgot(!showForgot); setForgotMsg(''); }}>Password dimenticata?</button>
          </div>
          {showForgot && (
            <div className="mt-3">
              {forgotMsg && <div className="alert alert-success">{forgotMsg}</div>}
              <form onSubmit={async (e) => {
                e.preventDefault();
                setForgotMsg('');
                try {
                  const body = forgotId.includes('@') ? { email: forgotId } : { username: forgotId };
                  await api.post('/auth/forgot', body);
                  setForgotMsg('Se l’account esiste, riceverai un’email con le istruzioni.');
                } catch (err) {}
              }}>
                <div className="mb-2">
                  <label className="form-label">Email o Username</label>
                  <input className="form-control" value={forgotId} onChange={(e) => setForgotId(e.target.value)} required />
                </div>
                <button className="btn btn-outline-secondary w-100" type="submit">Invia link di reset</button>
              </form>
            </div>
          )}
=======
          <div className="mt-3 small text-muted">
            Utenti demo: admin / volontario (password preconfigurate)
          </div>
>>>>>>> d11cca6 (first commit)
        </div>
      </div>
    </div>
  );
};

export default Login;
