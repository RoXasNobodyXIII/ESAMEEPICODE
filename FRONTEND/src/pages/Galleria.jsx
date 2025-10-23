import React from 'react';
import { Link } from 'react-router-dom';
import { listEvents } from '../utils/eventsStore';

const Galleria = () => {
  React.useEffect(() => {
    document.title = "GALLERIA";
  }, []);

  const items = React.useMemo(() => {
    const evs = listEvents();
    return (evs || [])
      .filter(e => e && e.image && e.status !== 'bozza')
      .map(e => ({ id: e.id, title: e.title, image: e.image, date: e.date }))
      .sort((a,b) => (b.date || '').localeCompare(a.date || ''));
  }, []);

  return (
    <div className="container mt-5">
      <h1>GALLERIA</h1>
      {items.length === 0 ? (
        <p className="text-muted">Ancora nessuna immagine caricata dagli eventi.</p>
      ) : (
        <div className="row g-3 mt-2">
          {items.map(it => (
            <div className="col-6 col-md-4 col-lg-3" key={it.id}>
              <div className="card h-100">
                <Link to={`/eventi/${it.id}`} className="text-decoration-none">
                  <img src={it.image} alt={it.title} className="card-img-top" style={{ objectFit: 'cover', aspectRatio: '1 / 1' }} />
                </Link>
                <div className="card-body py-2">
                  <div className="small text-truncate" title={it.title}>{it.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Galleria;

