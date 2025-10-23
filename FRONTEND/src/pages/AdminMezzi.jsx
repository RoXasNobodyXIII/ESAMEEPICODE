import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const AdminMezzi = () => {
  useEffect(() => { document.title = 'Amministrazione - Mezzi'; }, []);

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [newV, setNewV] = useState({ identificativo: '', targa: '', codiceARES: '' });


  const load = async () => {
    setLoading(true); setError('');
    try {
      const { data } = await api.get('/vehicles');
      setList(Array.isArray(data) ? data : []);
    } catch (e) { setError('Errore caricamento mezzi'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const submitCreate = async (e) => {
    e.preventDefault();
    setError(''); setMsg('');
    try {
      const body = {
        identificativo: (newV.identificativo || '').trim(),
        targa: (newV.targa || '').trim(),
        codiceARES: (newV.codiceARES || '').trim()
      };
      if (!body.identificativo || !body.targa || !body.codiceARES) {
        setError('Compila identificativo, targa e Codice ARES');
        return;
      }
      const { data } = await api.post('/vehicles', body);
      setShowModal(false);
      setNewV({ identificativo: '', targa: '', codiceARES: '' });
      await load();
      if (data?.id) {
        window.open(`/private/tools/amministrazione/mezzi/${data.id}`, '_blank', 'noopener');
        setMsg('Mezzo creato');
      } else setMsg('Mezzo creato');
    } catch (e) { setError(e?.response?.data?.message || 'Errore creazione mezzo'); }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Amministrazione · Mezzi</h4>
        <button className="btn btn-primary" onClick={()=>setShowModal(true)}>Crea mezzo</button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {msg && <div className="alert alert-success">{msg}</div>}

      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-start align-items-center mb-2">
            <h5 className="mb-0">Elenco mezzi</h5>
          </div>
          <div className="d-none d-md-block">
            <div className="table-responsive">
              <table className="table table-sm align-middle table-hover">
                <thead>
                  <tr>
                    <th>ID</th><th>Targa</th><th>Codice ARES</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {list.map(v => (
                    <tr key={v.id}>
                      <td>{v.id}</td>
                      <td>{v.targa || '-'}</td>
                      <td>{v.codiceARES || '-'}</td>
                      <td className="text-end">
                        <Link className="btn btn-outline-secondary" to={`/private/tools/amministrazione/mezzi/${v.id}`} title="Gestione" target="_blank" rel="noreferrer">
                          <span aria-hidden="true">⚙️</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {list.length === 0 && (
                    <tr><td colSpan="4" className="text-center text-muted">Nessun mezzo</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="d-md-none">
            <div className="list-group">
              {list.map(v => (
                <div key={v.id} className="list-group-item py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div><strong>#{v.id}</strong> · {v.targa || '-'} </div>
                      <div className="small text-muted">{v.codiceARES || '-'}</div>
                    </div>
                    <Link className="btn btn-outline-secondary" to={`/private/tools/amministrazione/mezzi/${v.id}`} title="Gestione" target="_blank" rel="noreferrer">⚙️</Link>
                  </div>
                </div>
              ))}
              {list.length === 0 && (
                <div className="list-group-item text-center text-muted">Nessun mezzo</div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,.5)', position: 'fixed', inset: 0, zIndex: 2000 }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Nuovo mezzo</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={()=>setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={submitCreate} className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Identificativo</label>
                    <input className="form-control" value={newV.identificativo} onChange={(e)=>setNewV({...newV, identificativo: e.target.value})} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Targa</label>
                    <input className="form-control" value={newV.targa} onChange={(e)=>setNewV({...newV, targa: e.target.value})} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Codice ARES</label>
                    <input className="form-control" value={newV.codiceARES} onChange={(e)=>setNewV({...newV, codiceARES: e.target.value})} required />
                  </div>
                  <div className="col-12 d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-outline-secondary" onClick={()=>setShowModal(false)}>Annulla</button>
                    <button className="btn btn-primary" type="submit">Crea</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMezzi;

