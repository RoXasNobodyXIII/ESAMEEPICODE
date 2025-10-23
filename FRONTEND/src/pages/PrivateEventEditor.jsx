import React from 'react';
import { listEvents, upsertEvent, deleteEvent } from '../utils/eventsStore';
import { getUserRole } from '../auth';

const PrivateEventEditor = () => {
  const role = getUserRole();
  const canEdit = role === 'admin';
  const [items, setItems] = React.useState(listEvents());
  const [form, setForm] = React.useState(null);

  const reset = () => setForm(null);

  if (!canEdit) return <div className="container mt-4"><div className="alert alert-warning">Non autorizzato.</div></div>;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form?.id) return;
    const ev = { ...form };
    upsertEvent(ev);
    setItems(listEvents());
    reset();
  };

  const onEdit = (ev) => setForm(ev);
  const onDelete = (id) => { deleteEvent(id); setItems(listEvents()); };

  return (
    <div className="container mt-4">
      <h2>Gestione Eventi</h2>
      <div className="row g-3">
        {form && (
          <div className="col-lg-5 order-lg-2">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Modifica {form.type === 'attivita' ? 'Attività' : 'Evento'}</h5>
                <form onSubmit={onSubmit}>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label">Tipo</label>
                      <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                        <option value="evento">Evento</option>
                        <option value="attivita">Attività</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label">Stato</label>
                      <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                        <option value="pubblicato">Pubblicato</option>
                        <option value="bozza">Bozza</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Titolo</label>
                      <input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                    </div>
                    <div className="col-6">
                      <label className="form-label">Data</label>
                      <input type="date" className="form-control" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                    </div>
                    <div className="col-6">
                      <label className="form-label">Orario</label>
                      <input type="time" className="form-control" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Luogo</label>
                      <input className="form-control" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Immagine (URL)</label>
                      <input className="form-control" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Link esterno (opzionale)</label>
                      <input className="form-control" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Descrizione</label>
                      <textarea className="form-control" rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    </div>
                  </div>
                  <div className="mt-3 d-flex gap-2">
                    <button className="btn btn-primary" type="submit">Salva</button>
                    <button type="button" className="btn btn-secondary" onClick={reset}>Annulla</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        <div className={form ? 'col-lg-7 order-lg-1' : 'col-12'}>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Elenco</h5>
              <div className="table-responsive">
                <table className="table table-sm align-middle">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Titolo</th>
                      <th>Tipo</th>
                      <th>Stato</th>
                      <th style={{ width: '120px' }}>Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(ev => (
                      <tr key={ev.id}>
                        <td>{ev.date} {ev.time}</td>
                        <td>{ev.title}</td>
                        <td>{ev.type}</td>
                        <td>{ev.status}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(ev)}>Modifica</button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(ev.id)}>Elimina</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {items.length === 0 && (
                      <tr><td colSpan="5" className="text-muted text-center">Nessun elemento</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateEventEditor;
