import React from 'react';
import { generateId, upsertEvent } from '../utils/eventsStore';
import api from '../api';

const CreazionePostAttivita = () => {
  const [allowed, setAllowed] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [form, setForm] = React.useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    image: '',
    link: '',
    status: 'pubblicato'
  });
  const [uploading, setUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState('');

  React.useEffect(() => {
    document.title = 'Creazione Attività';
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get('/users/me');
        const isAdmin = data?.role === 'admin';
        const can = isAdmin || data?.permessi?.sito?.gestione === true;
        if (mounted) setAllowed(!!can);
      } catch (_) {
        if (mounted) setAllowed(false);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const reset = () => setForm({ title: '', date: '', time: '', location: '', description: '', image: '', link: '', status: 'pubblicato' });

  const onSelectFile = async (e) => {
    try {
      setUploadError('');
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const fd = new FormData();
      fd.append('file', file);
      setUploading(true);
      const { data } = await api.post('/uploads/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const url = data?.url;
      if (url) setForm((f) => ({ ...f, image: url }));
    } catch (err) {
      setUploadError(err?.response?.data?.error || 'Upload immagine fallito');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const id = generateId();
    const ev = {
      id,
      type: 'attivita',
      title: form.title,
      date: form.date,
      time: form.time,
      location: form.location,
      description: form.description,
      image: form.image,
      link: form.link,
      status: form.status
    };
    upsertEvent(ev);
    reset();
  };

  if (loading) return <div className="container mt-4"><div className="text-muted">Caricamento…</div></div>;
  if (allowed === false) return <div className="container mt-4"><div className="alert alert-warning">Non autorizzato.</div></div>;

  return (
    <div className="container mt-4">
      <h2>Creazione Post Attività</h2>
      <div className="card mt-3">
        <div className="card-body">
          <form onSubmit={onSubmit}>
            <div className="row g-2">
              <div className="col-12">
                <label className="form-label">Titolo</label>
                <input className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="col-6">
                <label className="form-label">Data</label>
                <input type="date" className="form-control" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              </div>
              <div className="col-6">
                <label className="form-label">Orario</label>
                <input type="time" className="form-control" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              </div>
              <div className="col-12">
                <label className="form-label">Luogo</label>
                <input className="form-control" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div className="col-12">
                <label className="form-label">Immagine</label>
                <input type="file" accept="image/*" className="form-control" onChange={onSelectFile} />
                {uploading && <div className="form-text">Caricamento in corso…</div>}
                {uploadError && <div className="text-danger small mt-1">{uploadError}</div>}
                {form.image && (
                  <div className="mt-2">
                    <img src={form.image} alt="Anteprima" style={{ maxWidth: '240px', height: 'auto' }} />
                  </div>
                )}
              </div>
              <div className="col-12">
                <label className="form-label">Link esterno (opzionale)</label>
                <input className="form-control" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
              </div>
              <div className="col-12">
                <label className="form-label">Descrizione</label>
                <textarea className="form-control" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="col-12">
                <label className="form-label">Stato</label>
                <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="pubblicato">Pubblicato</option>
                  <option value="bozza">Bozza</option>
                </select>
              </div>
            </div>
            <div className="mt-3 d-flex gap-2">
              <button type="submit" className="btn btn-primary">Crea</button>
              <button type="button" className="btn btn-secondary" onClick={reset}>Annulla</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreazionePostAttivita;
