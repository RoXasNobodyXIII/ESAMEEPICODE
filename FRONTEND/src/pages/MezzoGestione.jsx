import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

const MezzoGestione = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const vid = Number(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const [v, setV] = useState({ targa: '', codiceARES: '', identificativo: '', posti: '', olioMax: '', currentKm: '', note: '' });
  const [events, setEvents] = useState([]);
  const [evForm, setEvForm] = useState({ type: 'assicurazione', date: '', prossimaData: '', km: '', prossimoKm: '', luogo: '', eseguitoDa: '', note: '' });
  const [notifDays, setNotifDays] = useState(15);
  const [notifKm, setNotifKm] = useState(500);
  const [collapsed, setCollapsed] = useState({ assicurazione: false, revisione: false, tagliando: false, pneumatici: false });
  const addFormRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  const load = async () => {
    if (!Number.isFinite(vid)) return;
    setLoading(true); setError(''); setMsg('');
    try {
      const [{ data: vd }, { data: evd }, { data: users }] = await Promise.all([
        api.get(`/vehicles/${vid}`),
        api.get(`/vehicles/${vid}/events`),
        api.get('/users')
      ]);
      setV({
        targa: vd.targa || '',
        codiceARES: vd.codiceARES || '',
        identificativo: vd.identificativo || '',
        posti: vd.posti ?? '',
        olioMax: vd.olioMax ?? '',
        currentKm: vd.currentKm ?? '',
        note: vd.note || ''
      });
      setEvents(Array.isArray(evd) ? evd : []);
      setAllUsers(Array.isArray(users) ? users : []);
    } catch (e) {
      setError('Errore caricamento mezzo');
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [vid]);

  const saveVehicle = async (e) => {
    e.preventDefault();
    setError(''); setMsg('');
    try {
      await api.put(`/vehicles/${vid}`, {
        targa: v.targa,
        codiceARES: v.codiceARES,
        identificativo: v.identificativo,
        posti: v.posti ? Number(v.posti) : 0,
        olioMax: v.olioMax ? Number(v.olioMax) : 0,
        currentKm: v.currentKm ? Number(v.currentKm) : 0,
        note: v.note
      });
      setMsg('Dati mezzo salvati');
      await load();
    } catch (e) { setError(e?.response?.data?.message || 'Errore salvataggio mezzo'); }
  };

  const addEvent = async (e) => {
    e.preventDefault();
    setError(''); setMsg('');
    try {
      const body = {
        type: evForm.type,
        date: evForm.date || null,
        prossimaData: evForm.prossimaData || null,
        km: evForm.km ? Number(evForm.km) : null,
        prossimoKm: evForm.prossimoKm ? Number(evForm.prossimoKm) : null,
        luogo: evForm.luogo || null,
        eseguitoDa: evForm.eseguitoDa || null,
        note: evForm.note || ''
      };
      await api.post(`/vehicles/${vid}/events`, body);
      setEvForm({ type: 'assicurazione', date: '', prossimaData: '', km: '', prossimoKm: '', luogo: '', eseguitoDa: '', note: '' });
      setMsg('Evento aggiunto');
      await load();
      setShowModal(false);
    } catch (err) { setError(err?.response?.data?.message || 'Errore salvataggio evento'); }
  };

  const triggerNotify = async () => {
    setError(''); setMsg('');
    try {
      await api.post('/vehicles/notify/due', { days: Number(notifDays)||15, kmThreshold: Number(notifKm)||500 });
      setMsg('Notifiche inviate (se configurate)');
    } catch (e) { setError('Errore invio notifiche'); }
  };

  const grouped = useMemo(() => {
    const map = new Map();
    for (const ev of events) {
      if (!map.has(ev.type)) map.set(ev.type, []);
      map.get(ev.type).push(ev);
    }
    for (const [k, arr] of map.entries()) {
      arr.sort((a, b) => (new Date(b.date||0)).getTime() - (new Date(a.date||0)).getTime());
    }
    return map;
  }, [events]);

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-3">
        <button className="btn btn-link p-0" onClick={()=>navigate(-1)}>← Indietro</button>
        <h4 className="mb-0">Gestione mezzo #{vid}</h4>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {msg && <div className="alert alert-success">{msg}</div>}

      

      <div className="row g-3 mb-3">
        {[{k:'assicurazione',label:'Assicurazione',icon:'📄'},{k:'revisione',label:'Revisione',icon:'🧪'},{k:'tagliando',label:'Tagliando',icon:'🛠️'},{k:'pneumatici',label:'Pneumatici',icon:'🛞'}].map(sec => (
          <div className="col-lg-6" key={sec.k}>
            <div className="card" style={{background:'#1f1f1f', color:'#eee'}}>
              <div className="card-header d-flex align-items-center justify-content-between" style={{background:'#1f1f1f', color:'#eee', borderBottom:'1px solid #333'}}>
                <div className="d-flex align-items-center gap-2">
                  <span aria-hidden="true">{sec.icon}</span>
                  <span>{sec.label}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button className="btn btn-sm btn-primary" onClick={(e)=>{e.preventDefault(); setEvForm(f=>({...f, type: sec.k })); setShowModal(true);}}>+</button>
                  <button className="btn btn-sm btn-danger" onClick={(e)=>{e.preventDefault(); setCollapsed(c=>({...c, [sec.k]: !c[sec.k]}));}}>✖</button>
                </div>
              </div>
              {!collapsed[sec.k] && (
                <div className="card-body p-0">
                  <div className="d-none d-md-block" style={{background:'#111'}}>
                    <div className="table-responsive">
                      <table className="table table-sm mb-0" style={{color:'#ddd'}}>
                        <thead style={{background:'#222'}}>
                          <tr>
                            <th>Scadenza</th>
                            <th>Km scadenza</th>
                            <th className="text-end">Tools</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(grouped.get(sec.k) || []).map(ev => (
                            <tr key={ev.id}>
                              <td>{ev.prossimaData ? new Date(ev.prossimaData).toLocaleDateString('it-IT') : (ev.date ? new Date(ev.date).toLocaleDateString('it-IT') : '-')}</td>
                              <td>{ev.prossimoKm ?? ev.km ?? '-'}</td>
                              <td className="text-end">-</td>
                            </tr>
                          ))}
                          {!((grouped.get(sec.k) || []).length) && (
                            <tr>
                              <td colSpan="3" className="text-center" style={{color:'#aaa'}}>NESSUN RECORD</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="d-md-none" style={{background:'#111'}}>
                    <div className="list-group list-group-flush">
                      {(grouped.get(sec.k) || []).map(ev => (
                        <div key={ev.id} className="list-group-item" style={{background:'#111', color:'#ddd'}}>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <div>Scadenza: {ev.prossimaData ? new Date(ev.prossimaData).toLocaleDateString('it-IT') : (ev.date ? new Date(ev.date).toLocaleDateString('it-IT') : '-')}</div>
                              <div className="small text-muted">Km scadenza: {ev.prossimoKm ?? ev.km ?? '-'}</div>
                            </div>
                            <div className="text-end" style={{minWidth:'60px'}}>-</div>
                          </div>
                        </div>
                      ))}
                      {!((grouped.get(sec.k) || []).length) && (
                        <div className="list-group-item text-center" style={{background:'#111', color:'#aaa'}}>NESSUN RECORD</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <div className="d-flex align-items-end gap-2 mb-2">
            <div>
              <label className="form-label">Notifica entro giorni</label>
              <input type="number" className="form-control" value={notifDays} onChange={(e)=>setNotifDays(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Soglia km</label>
              <input type="number" className="form-control" value={notifKm} onChange={(e)=>setNotifKm(e.target.value)} />
            </div>
            <button className="btn btn-outline-primary ms-auto" onClick={triggerNotify}>Invia notifiche email</button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,.5)', position: 'fixed', inset: 0, zIndex: 2000 }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Aggiungi evento</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={()=>setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={addEvent} className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Data</label>
                    <input type="date" className="form-control" value={evForm.date} onChange={(e)=>setEvForm({ ...evForm, date: e.target.value })} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Prossima data</label>
                    <input type="date" className="form-control" value={evForm.prossimaData} onChange={(e)=>setEvForm({ ...evForm, prossimaData: e.target.value })} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Km</label>
                    <input type="number" className="form-control" value={evForm.km} onChange={(e)=>setEvForm({ ...evForm, km: e.target.value })} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Prossimo km</label>
                    <input type="number" className="form-control" value={evForm.prossimoKm} onChange={(e)=>setEvForm({ ...evForm, prossimoKm: e.target.value })} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Luogo</label>
                    <input className="form-control" value={evForm.luogo} onChange={(e)=>setEvForm({ ...evForm, luogo: e.target.value })} />
                  </div>
                  <div className="col-md-8">
                    <label className="form-label">Eseguito da</label>
                    <select className="form-select" value={evForm.eseguitoDa} onChange={(e)=>setEvForm({ ...evForm, eseguitoDa: e.target.value })}>
                      <option value="">- SELEZIONA -</option>
                      {allUsers.map(u => (
                        <option key={u.id} value={u.id}>{u.nome || u.username} {u.cognome || ''}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Note</label>
                    <textarea className="form-control" rows={5} value={evForm.note} onChange={(e)=>setEvForm({ ...evForm, note: e.target.value })} />
                  </div>
                  <div className="col-12 d-flex justify-content-end">
                    <button className="btn btn-secondary" type="submit">Salva</button>
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

export default MezzoGestione;
