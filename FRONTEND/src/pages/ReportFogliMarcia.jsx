import React, { useEffect, useState } from 'react';
import { getUserRole, getAccessToken } from '../auth';

const ReportFogliMarcia = () => {
  useEffect(() => { document.title = 'Report Fogli di Marcia'; }, []);

  const role = getUserRole();
  const [mezzo, setMezzo] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [vehLoading, setVehLoading] = useState(false);

  const buildParams = () => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    if (mezzo && mezzo !== 'ALL') params.append('mezzo', mezzo);
    return params;
  };

  const loadVehicles = async () => {
    setVehLoading(true);
    try {
      const res = await fetch('/vehicles', { headers: { Authorization: `Bearer ${getAccessToken()}` } });
      if (res.ok) {
        const data = await res.json();
        setVehicles(Array.isArray(data) ? data : []);
      }
    } catch (_) {}
    finally { setVehLoading(false); }
  };
  useEffect(() => { loadVehicles(); }, []);

  const handlePreview = async (e) => {
    e.preventDefault();
    setError('');
    setPreviewUrl('');
    if (!mezzo) { setError('Seleziona un mezzo'); return; }
    const params = buildParams();
    params.append('disposition', 'inline');
    const url = `/fogli-marcia/report?${params.toString()}`;
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${getAccessToken()}` } });
      if (!res.ok) throw new Error('Errore generazione report');
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      setPreviewUrl(objectUrl);
    } catch (err) {
      setError(err.message || 'Errore generazione report');
    }
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    setError('');
    if (!mezzo) { setError('Seleziona un mezzo'); return; }
    const params = buildParams();
    const url = `/fogli-marcia/report?${params.toString()}`; // default attachment
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${getAccessToken()}` } });
      if (!res.ok) throw new Error('Errore generazione report');
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'report-fogli-marcia.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err.message || 'Errore generazione report');
    }
  };

  return (
    <div>
      <h4 className="mb-3">Report Fogli di Marcia</h4>

      <form className="row g-3 align-items-end" onSubmit={handlePreview}>
        <div className="col-md-4">
          <label className="form-label">📆 Dal</label>
          <input type="datetime-local" className="form-control" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="col-md-4">
          <label className="form-label">📆 Al</label>
          <input type="datetime-local" className="form-control" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <div className="col-md-4">
          <label className="form-label">🚑 Mezzo</label>
          <select className="form-select" value={mezzo} onChange={(e) => setMezzo(e.target.value)}>
            <option value="">- SELEZIONA -</option>
            <option value="ALL">Seleziona Tutti</option>
            {vehicles.map(v => {
              const label = `${v.identificativo || ''} - ${v.targa || ''} - ${v.codiceARES || ''}`.replace(/\s+-\s+-\s*$/,'').trim();
              return <option key={v.id} value={label}>{label}</option>;
            })}
          </select>
          <div className="form-text d-flex align-items-center gap-2 mt-1">
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={loadVehicles} disabled={vehLoading}>{vehLoading ? 'Aggiorno...' : 'Ricarica mezzi'}</button>
          </div>
        </div>
        
        <div className="col-12 d-flex gap-2">
          <button type="submit" className="btn btn-secondary">Anteprima</button>
          <button type="button" className="btn btn-primary" onClick={handleDownload}>Scarica PDF</button>
        </div>
      </form>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {previewUrl && (
        <div className="mt-3">
          <embed src={previewUrl} type="application/pdf" width="100%" height="800px" />
        </div>
      )}
    </div>
  );
};

export default ReportFogliMarcia;
