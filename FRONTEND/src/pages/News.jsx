import React from 'react';
import { Link } from 'react-router-dom';
import CalendarMonth from '../components/CalendarMonth.jsx';
import { listEvents as fetchEvents } from '../utils/eventsApi';

const News = () => {
  React.useEffect(() => {
    document.title = "EVENTI";
  }, []);
  const [events, setEvents] = React.useState([]);
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchEvents(false);
        if (mounted) setEvents(Array.isArray(data) ? data : []);
      } catch (_) {
        if (mounted) setEvents([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="container mt-5">
      <h1>EVENTI</h1>
      <div className="mt-3">
        <h2 className="h4">Attività prossime</h2>
        {
          (() => {
            const now = new Date();
            const todayKey = now.toISOString().slice(0,10);
            const toTime = (d, t) => {
              const [hh,mm] = (t || '00:00').split(':');
              return new Date(`${d}T${hh.padStart(2,'0')}:${mm.padStart(2,'0')}:00`);
            };
            const upcoming = events
              .filter(e => e && e.status !== 'bozza' && e.date >= todayKey)
              .sort((a,b) => toTime(a.date,a.time) - toTime(b.date,b.time));
            if (upcoming.length === 0) {
              return <div className="text-muted">Nessun evento imminente.</div>;
            }
            return (
              <div className="row">
                {upcoming.map(ev => (
                  <div className="col-md-4 mb-3" key={ev.id}>
                    <div className="card h-100">
                      {((Array.isArray(ev.images) && ev.images[0]) || ev.image) && (
                        <img src={(Array.isArray(ev.images) && ev.images[0]) || ev.image} alt={ev.title} className="card-img-top" style={{ objectFit: 'cover', maxHeight: '160px' }} />
                      )}
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title mb-1">{ev.title}</h5>
                        <div className="text-muted small mb-2">{ev.date}{ev.time ? ` • ${ev.time}` : ''}</div>
                        {ev.description && <p className="card-text flex-grow-1">{ev.description.length>140? ev.description.slice(0,140)+'…' : ev.description}</p>}
                        <Link className="btn btn-primary mt-auto" to={`/eventi/${ev.id}`}>Dettagli</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()
        }
      </div>
      <div className="mt-3">
        <CalendarMonth />
      </div>
    </div>
  );
};

export default News;

