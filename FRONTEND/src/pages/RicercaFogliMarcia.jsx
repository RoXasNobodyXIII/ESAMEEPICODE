import React, { useEffect, useMemo, useState } from 'react';
import api from '../api';
import { getUserRole } from '../auth';

const RicercaFogliMarcia = () => {
  useEffect(() => { document.title = 'Ricerca Fogli di Marcia'; }, []);

  const role = getUserRole();
  const [mezzo, setMezzo] = useState('ALL');
  const [day, setDay] = useState(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });
  const [indirizzo, setIndirizzo] = useState('');
  const [cognome, setCognome] = useState('');
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [vehLoading, setVehLoading] = useState(false);

  const onlyTime = (v) => {
    if (!v) return '-';
    try {
      const dt = new Date(v);
      if (!Number.isNaN(dt.getTime())) {
        return dt.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
      }
    } catch (_) {}
    const m = String(v).match(/T(\d{2}:\d{2})/);
    return m ? m[1] : String(v);
  };

  const search = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setItems([]);
    // mezzo optional; if 'ALL' or empty, we don't filter by mezzo
    setLoading(true);
    try {
      const base = role === 'admin'
        ? { date: day, indirizzo: indirizzo || undefined, cognome: cognome || undefined, nome: nome || undefined }
        : { indirizzo: indirizzo || undefined, cognome: cognome || undefined, nome: nome || undefined };
      const params = (mezzo && mezzo !== 'ALL') ? { ...base, mezzo } : base;
      const { data } = await api.get('/fogli-marcia', { params });
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Errore ricerca');
    } finally { setLoading(false); }
  };

  const grouped = useMemo(() => {
    const fmtDate = (d) => {
      if (!d) return '';
      const dt = typeof d === 'string' && d.length <= 10 ? new Date(d) : new Date(d);
      if (Number.isNaN(dt.getTime())) return '';
      const y = dt.getFullYear();
      const m = String(dt.getMonth() + 1).padStart(2, '0');
      const day = String(dt.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };
    const map = new Map();
    for (const it of items) {
      const key = fmtDate(it.data || it.createdAt) || 'Senza data';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(it);
    }
    const seqOf = (it) => {
      const sc = it.serviceCode; if (sc) { const m = sc.match(/^CDO\d{2}(\d{4,5})$/); if (m) return Number(m[1]); }
      return Number(it.id) || 0;
    };
    return Array.from(map.entries())
      .sort((a, b) => (a[0] < b[0] ? 1 : a[0] > b[0] ? -1 : 0))
      .map(([d, arr]) => [d, arr.slice().sort((a, b) => seqOf(a) - seqOf(b))]);
  }, [items]);

  const loadVehicles = async () => {
    setVehLoading(true);
    try {
      const { data } = await api.get('/vehicles');
      setVehicles(Array.isArray(data) ? data : []);
    } catch (_) {}
    finally { setVehLoading(false); }
  };
  useEffect(() => { loadVehicles(); }, []);

  return (
    <div>
      <h4 className="mb-3">Ricerca Fogli di Marcia</h4>

      <form onSubmit={search} className="row g-3 align-items-end">
        <div className="col-md-4">
          <label className="form-label">🚑 Mezzo</label>
          <select className="form-select" value={mezzo} onChange={(e) => setMezzo(e.target.value)}>
            <option value="ALL">TUTTI I MEZZI</option>
            {vehicles.map(v => {
              const label = `${v.identificativo || ''} - ${v.targa || ''} - ${v.codiceARES || ''}`.replace(/\s+-\s+-\s*$/,'').trim();
              return <option key={v.id} value={label}>{label}</option>;
            })}
          </select>
        </div>
        {role === 'admin' && (
          <div className="col-md-3">
            <label className="form-label">📅 Data</label>
            <input type="date" className="form-control" value={day} onChange={(e) => setDay(e.target.value)} />
          </div>
        )}
        <div className="col-md-2"></div>
        <div className="col-md-6">
          <label className="form-label">🛣 Indirizzo</label>
          <input className="form-control" value={indirizzo} onChange={(e) => setIndirizzo(e.target.value)} placeholder="Cerca per indirizzo" />
        </div>
        <div className="col-md-3">
          <label className="form-label">👤 Cognome</label>
          <input className="form-control" value={cognome} onChange={(e) => setCognome(e.target.value)} placeholder="Cognome" />
        </div>
        <div className="col-md-3">
          <label className="form-label">👤 Nome</label>
          <input className="form-control" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">Cerca</button>
        </div>
      </form>

      <div className="card mt-3">
        <div className="card-body">
          {loading && <div>Ricerca in corso...</div>}
          {!loading && error && <div className="text-danger">{error}</div>}
          {!loading && !error && items.length === 0 && (
            <div>Nessun risultato.</div>
          )}
          {!loading && !error && items.length > 0 && (
            <div>
              {grouped.map(([dateKey, arr]) => (
                <div key={dateKey} className="mb-3">
                  <h5 className="mb-2">{dateKey}</h5>
                  <div className="d-none d-md-block">
                    <div className="table-responsive">
                      <table className="table table-sm table-hover mb-0">
                        <thead>
                          <tr>
                            <th style={{whiteSpace:'nowrap'}}>#</th>
                            <th>Indirizzo</th>
                            <th>Partenza</th>
                            <th>Fine</th>
                            <th>Esito</th>
                          </tr>
                        </thead>
                        <tbody>
                          {arr.map((f) => (
                            <tr key={f._id || f.id}>
                              <td style={{whiteSpace:'nowrap'}}>{f.serviceCode || `#${f.id}`}</td>
                              <td>{f.indirizzo || '-'}</td>
                              <td>{onlyTime(f.uscita)}</td>
                              <td>{f.fine || '-'}</td>
                              <td>{f.esito || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="d-md-none">
                    <div className="list-group">
                      {arr.map((f) => (
                        <div key={f._id || f.id} className="list-group-item">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <strong>{f.serviceCode || `#${f.id}`}</strong>
                          </div>
                          <div className="small text-muted">{f.indirizzo || '-'}</div>
                          <div className="mt-1">
                            <span className="badge bg-light text-dark me-1">Partenza: {onlyTime(f.uscita)}</span>
                            <span className="badge bg-light text-dark me-1">Fine: {f.fine || '-'}</span>
                            <span className="badge bg-secondary">{f.esito || '-'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RicercaFogliMarcia;
