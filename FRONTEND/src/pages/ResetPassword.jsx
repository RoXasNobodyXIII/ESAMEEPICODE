import React, { useEffect, useState } from 'react';
import api from '../api';

const ResetPassword = () => {
  useEffect(() => { document.title = 'Reimposta password'; }, []);
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const t = url.searchParams.get('token') || '';
      setToken(t);
    } catch {}
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setOk(false);
    if (!token) { setError('Token mancante'); return; }
    if (!password || password.length < 6) { setError('Password troppo corta'); return; }
    if (password !== confirm) { setError('Le password non coincidono'); return; }
    try {
      const { data } = await api.post('/auth/reset', { token, password });
      if (data?.ok) setOk(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Errore reset');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 420 }}>
      <div className="card">
        <div className="card-body">
          <h3 className="mb-3">Reimposta password</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          {ok ? (
            <div className="alert alert-success">Password aggiornata. Ora puoi accedere.</div>
          ) : (
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label className="form-label">Nuova password</label>
                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Conferma password</label>
                <input type="password" className="form-control" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary w-100">Reimposta</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
