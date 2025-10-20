<<<<<<< HEAD
=======

>>>>>>> d11cca6 (first commit)
import React, { useEffect, useMemo, useState } from 'react';
import api from '../api';

const FogliMarcia = () => {
  useEffect(() => {
    document.title = 'Fogli di Marcia';
  }, []);

  const [mezzo, setMezzo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null); // item in modifica
  const [saving, setSaving] = useState(false);
<<<<<<< HEAD
  const [vehicles, setVehicles] = useState([]);
  const [vehLoading, setVehLoading] = useState(false);

  // Carica elenco mezzo
=======

  // Carica elenco quando cambia mezzo
>>>>>>> d11cca6 (first commit)
  useEffect(() => {
    setError('');
    setItems([]);
    const m = (mezzo || '').trim();
    if (!m) return;
    setLoading(true);
<<<<<<< HEAD
    const params = { mezzo: m };
    api
      .get('/fogli-marcia', { params })
=======
    api
      .get('/fogli-marcia', { params: { mezzo: m } })
>>>>>>> d11cca6 (first commit)
      .then(({ data }) => setItems(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.response?.data?.message || 'Errore nel caricamento'))
      .finally(() => setLoading(false));
  }, [mezzo]);

<<<<<<< HEAD
  const loadVehicles = async () => {
    setVehLoading(true);
    try {
      const { data } = await api.get('/vehicles');
      setVehicles(Array.isArray(data) ? data : []);
    } catch (_) {}
    finally { setVehLoading(false); }
  };
  useEffect(() => { loadVehicles(); }, []);

  // Raggruppa per data
=======
  // Raggruppa per data (YYYY-MM-DD) e ordina per sequenza (serviceCode ultimo 5 cifre) o id
>>>>>>> d11cca6 (first commit)
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
<<<<<<< HEAD
    // ordina gruppi
=======
    // ordina gruppi per data desc, elementi per seq asc
>>>>>>> d11cca6 (first commit)
    const seqOf = (it) => {
      const sc = it.serviceCode;
      if (sc) {
        const m = sc.match(/^CDO\d{2}(\d{4,5})$/);
        if (m) return Number(m[1]);
      }
      return Number(it.id) || 0;
    };
    const entries = Array.from(map.entries())
      .sort((a, b) => (a[0] < b[0] ? 1 : a[0] > b[0] ? -1 : 0))
      .map(([d, arr]) => [d, arr.slice().sort((a, b) => seqOf(a) - seqOf(b))]);
    return entries;
  }, [items]);

  const openEdit = (it) => setEditItem({ ...it });
  const closeEdit = () => setEditItem(null);
  const onEditField = (k, v) => setEditItem((e) => ({ ...e, [k]: v }));
  const saveEdit = async () => {
    if (!editItem) return;
    setSaving(true);
    try {
      const payload = {
        indirizzo: editItem.indirizzo,
        uscita: editItem.uscita,
        sulPosto: editItem.sulPosto,
        arrivoDestinazione: editItem.arrivoDestinazione,
        fine: editItem.fine,
        esito: editItem.esito,
        destinazione: editItem.destinazione,
        note: editItem.note,
        autista: editItem.autista,
        soccorritore1: editItem.soccorritore1,
        soccorritore2: editItem.soccorritore2,
        infermiere: editItem.infermiere,
        medico: editItem.medico,
        kmFinali: editItem.kmFinali,
      };
      await api.put(`/fogli-marcia/${editItem.id}`, payload);
      // refresh list
      const { data } = await api.get('/fogli-marcia', { params: { mezzo } });
      setItems(Array.isArray(data) ? data : []);
      closeEdit();
    } catch (err) {
      alert(err.response?.data?.message || 'Errore salvataggio');
    } finally {
      setSaving(false);
    }
  };

  const delItem = async (it) => {
    if (!window.confirm(`Eliminare il foglio ${it.serviceCode || `#${it.id}`}?`)) return;
    try {
      await api.delete(`/fogli-marcia/${it.id}`);
      setItems((prev) => prev.filter((p) => p.id !== it.id));
    } catch (err) {
      alert(err.response?.data?.message || 'Errore eliminazione');
    }
  };

  return (
    <div>
      <h4 className="mb-3">Fogli di Marcia</h4>

      <div className="row g-3 align-items-end">
        <div className="col-md-6">
          <label className="form-label">🚑 Mezzo</label>
          <select
            className="form-select"
            value={mezzo}
            onChange={(e) => setMezzo(e.target.value)}
          >
            <option value="">- SELEZIONA -</option>
<<<<<<< HEAD
            {vehicles.map(v => {
              const label = `${v.identificativo || ''} - ${v.targa || ''} - ${v.codiceARES || ''}`.replace(/\s+-\s+-\s*$/,'').trim();
              return <option key={v.id} value={label}>{label}</option>;
            })}
=======
            <option>A03 - GG772FV - 1106</option>
            <option>A04 - GN005MH - 1284</option>
>>>>>>> d11cca6 (first commit)
          </select>
        </div>
      </div>

      <div className="card mt-3">
        <div className="card-body">
          {!mezzo && <div className="text-muted">Seleziona un mezzo per vedere i fogli di marcia.</div>}
          {mezzo && loading && <div>Caricamento elenco...</div>}
          {mezzo && !loading && error && <div className="text-danger">{error}</div>}
          {mezzo && !loading && !error && items.length === 0 && (
            <div>Nessun foglio trovato per questo mezzo.</div>
          )}
          {mezzo && !loading && !error && items.length > 0 && (
            <div>
              {grouped.map(([dateKey, arr]) => (
                <div key={dateKey} className="mb-3">
                  <h5 className="mb-2">{dateKey}</h5>
<<<<<<< HEAD
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
                            <th>Tools</th>
                          </tr>
                        </thead>
                        <tbody>
                          {arr.map((f) => (
                            <tr key={f._id || f.id}>
                              <td style={{whiteSpace:'nowrap'}}>{f.serviceCode || `#${f.id}`}</td>
                              <td>{f.indirizzo || '-'}</td>
                              <td>{f.uscita || '-'}</td>
                              <td>{f.fine || '-'}</td>
                              <td>{f.esito || '-'}</td>
                              <td>
                                <div className="btn-group btn-group-sm" role="group">
                                  <button className="btn btn-outline-primary" onClick={() => openEdit(f)}>Modifica</button>
                                  <button className="btn btn-outline-danger" onClick={() => delItem(f)}>Elimina</button>
                                </div>
                              </td>
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
                            <div className="btn-group btn-group-sm" role="group">
                              <button className="btn btn-outline-primary" onClick={() => openEdit(f)}>Modifica</button>
                              <button className="btn btn-outline-danger" onClick={() => delItem(f)}>Elimina</button>
                            </div>
                          </div>
                          <div className="small text-muted">{f.indirizzo || '-'}</div>
                          <div className="mt-1">
                            <span className="badge bg-light text-dark me-1">Partenza: {f.uscita || '-'}</span>
                            <span className="badge bg-light text-dark me-1">Fine: {f.fine || '-'}</span>
                            <span className="badge bg-secondary">{f.esito || '-'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
=======
                  <div className="table-responsive">
                    <table className="table table-sm table-hover mb-0">
                      <thead>
                        <tr>
                          <th style={{whiteSpace:'nowrap'}}>#</th>
                          <th>Indirizzo</th>
                          <th>Partenza</th>
                          <th>Fine</th>
                          <th>Esito</th>
                          <th>Tools</th>
                        </tr>
                      </thead>
                      <tbody>
                        {arr.map((f) => (
                          <tr key={f._id || f.id}>
                            <td style={{whiteSpace:'nowrap'}}>{f.serviceCode || `#${f.id}`}</td>
                            <td>{f.indirizzo || '-'}</td>
                            <td>{f.uscita || '-'}</td>
                            <td>{f.fine || '-'}</td>
                            <td>{f.esito || '-'}</td>
                            <td>
                              <div className="btn-group btn-group-sm" role="group">
                                <button className="btn btn-outline-primary" onClick={() => openEdit(f)}>Modifica</button>
                                <button className="btn btn-outline-danger" onClick={() => delItem(f)}>Elimina</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
>>>>>>> d11cca6 (first commit)
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

<<<<<<< HEAD
=======
      {/* Modal semplice per modifica */}
>>>>>>> d11cca6 (first commit)
      {editItem && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modifica {editItem.serviceCode || `#${editItem.id}`}</h5>
                <button type="button" className="btn-close" onClick={closeEdit} />
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Indirizzo</label>
                    <input className="form-control" value={editItem.indirizzo || ''} onChange={(e) => onEditField('indirizzo', e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Partenza</label>
                    <input type="time" className="form-control" value={editItem.uscita || ''} onChange={(e) => onEditField('uscita', e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Fine</label>
                    <input type="time" className="form-control" value={editItem.fine || ''} onChange={(e) => onEditField('fine', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Esito</label>
                    <select className="form-select" value={editItem.esito || ''} onChange={(e) => onEditField('esito', e.target.value)}>
                      <option value="">- SELEZIONA -</option>
                      <option>PS/DEA</option>
                      <option>Ospedale/Clinica</option>
                      <option>Domicilio</option>
                      <option>Presidio senza trasporto</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Destinazione</label>
                    <input className="form-control" value={editItem.destinazione || ''} onChange={(e) => onEditField('destinazione', e.target.value)} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Note</label>
                    <textarea className="form-control" rows={2} value={editItem.note || ''} onChange={(e) => onEditField('note', e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-secondary" onClick={closeEdit} disabled={saving}>Chiudi</button>
                <button className="btn btn-primary" onClick={saveEdit} disabled={saving}>{saving ? 'Salvataggio...' : 'Salva'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FogliMarcia;
