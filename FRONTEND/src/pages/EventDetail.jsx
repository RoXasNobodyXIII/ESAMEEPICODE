import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEvent as fetchEvent } from '../utils/eventsApi';

const EventDetail = () => {
  const { id } = useParams();
  const [ev, setEv] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [active, setActive] = React.useState(0);
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchEvent(id);
        if (mounted) setEv(data || null);
      } catch (_) {
        if (mounted) setEv(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className="container mt-5"><div className="text-muted">Caricamento…</div></div>;
  if (!ev) return (
    <div className="container mt-5">
      <div className="alert alert-warning">Evento non trovato.</div>
      <Link to="/news" className="btn btn-outline-secondary">Torna al calendario</Link>
    </div>
  );

  const images = (Array.isArray(ev.images) && ev.images.length > 0) ? ev.images : (ev.image ? [ev.image] : []);

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

          {images.length > 0 && (
            <div className="event-gallery mb-3">
              <div className="event-gallery__main mb-2">
                <img src={images[Math.min(active, images.length-1)]} alt={ev.title} className="img-fluid event-gallery__img" />
              </div>
              {images.length > 1 && (
                <div className="row g-2">
                  {images.map((src, idx) => (
                    <div key={idx} className="col-3 col-md-2">
                      <img
                        src={src}
                        alt={`thumb-${idx}`}
                        className={`event-gallery__thumb img-fluid ${idx===active? 'border border-2 border-warning' : ''}`}
                        onClick={() => setActive(idx)}
                        role="button"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {ev.description && <p>{ev.description}</p>}
          {ev.link && <a href={ev.link} target="_blank" rel="noreferrer" className="btn btn-primary">Approfondisci</a>}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
