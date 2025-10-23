import React from 'react';
import { Link } from 'react-router-dom';
import { listEvents as fetchEvents } from '../utils/eventsApi';

const Galleria = () => {
  React.useEffect(() => {
    document.title = "GALLERIA";
  }, []);

  const [items, setItems] = React.useState([]);
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const evs = await fetchEvents(false);
        const mapped = (evs || [])
          .filter(e => e && e.image && e.status !== 'bozza')
          .map(e => ({ id: e.id, title: e.title, image: e.image, date: e.date }))
          .sort((a,b) => (b.date || '').localeCompare(a.date || ''));
        if (mounted) setItems(mapped);
      } catch (_) {
        if (mounted) setItems([]);
      }
    })();
    return () => { mounted = false; };
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

