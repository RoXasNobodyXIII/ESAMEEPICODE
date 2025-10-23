import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEvent } from '../utils/eventsStore';

const EventDetail = () => {
  const { id } = useParams();
  const ev = getEvent(id);

  if (!ev) return (
    <div className="container mt-5">
      <div className="alert alert-warning">Evento non trovato.</div>
      <Link to="/news" className="btn btn-outline-secondary">Torna al calendario</Link>
    </div>
  );

  return (
    <div className="container mt-5">
      <Link to="/news" className="btn btn-sm btn-outline-secondary mb-3">← Calendario</Link>
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">{ev.title}</h2>
          <div className="text-muted mb-2">
            <div className="d-flex flex-wrap gap-3 align-items-center small">
              <span>{ev.type === 'attivita' ? 'Attività' : 'Evento'}</span>
              <span className="d-inline-flex align-items-center gap-1"><i className="bi bi-calendar-event"></i>{ev.date}</span>
              {ev.time && (
                <span className="d-inline-flex align-items-center gap-1"><i className="bi bi-clock"></i>{ev.time}</span>
              )}
              {ev.location && (
                <span className="d-inline-flex align-items-center gap-1"><i className="bi bi-geo-alt"></i>{ev.location}</span>
              )}
            </div>
          </div>
          {ev.image && (
            <div className="mb-3"><img src={ev.image} alt={ev.title} className="img-fluid" /></div>
          )}
          {ev.description && <p>{ev.description}</p>}
          {ev.link && <a href={ev.link} target="_blank" rel="noreferrer" className="btn btn-primary">Approfondisci</a>}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
