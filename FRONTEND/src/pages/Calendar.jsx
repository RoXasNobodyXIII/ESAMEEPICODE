import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function Calendar() {
  useEffect(() => {
    document.title = 'Calendario turni';
  }, []);

  // Calendari: 118 (Google Sheets) e Servizi Secondari
  const SHEET_118_EMBED_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQUjQS5bQnFA-rXWhw1V2WeXKTg6dBs8yVZyh-ZzQMZLSClJrtL07hzUx_p2FX0gg/pubhtml';
  const SHEET_118_OPEN_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQUjQS5bQnFA-rXWhw1V2WeXKTg6dBs8yVZyh-ZzQMZLSClJrtL07hzUx_p2FX0gg/pubhtml';
  const SHEET_SECONDARI_EMBED_URL = '';
  const SHEET_SECONDARI_OPEN_URL = '';


  const [cacheKey, setCacheKey] = useState(() => Date.now());
  const refreshEmbed = () => setCacheKey(Date.now());
  const location = useLocation();
  const [view, setView] = useState('118');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const v = (params.get('view') || '').toLowerCase();
    if (v === 'secondari') setView('secondari');
    else setView('118');
  }, [location.search]);

  return (
    <div>
      <h4>Calendario turni</h4>

      <div className="d-flex align-items-center justify-content-between mb-2">
        <small className="text-muted">Ultimo aggiornamento incorporato: {new Date(cacheKey).toLocaleTimeString()}</small>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-secondary" onClick={refreshEmbed}>Aggiorna</button>
          {view === '118' ? (
            <a className="btn btn-sm btn-outline-primary" href={SHEET_118_OPEN_URL} target="_blank" rel="noreferrer noopener">Apri 118</a>
          ) : (
            <a className="btn btn-sm btn-outline-primary" href={SHEET_SECONDARI_OPEN_URL || '#'} target={SHEET_SECONDARI_OPEN_URL ? '_blank' : undefined} rel="noreferrer noopener">Apri Secondari</a>
          )}
        </div>
      </div>

      {view === '118' && (
        <div className="ratio ratio-16x9" style={{ minHeight: 500 }}>
          <iframe
            src={`${SHEET_118_EMBED_URL}${SHEET_118_EMBED_URL.includes('?') ? '&' : '?'}cb=${cacheKey}`}
            title="Calendario 118"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ border: 0, width: '100%', height: '100%' }}
          />
        </div>
      )}
      {view === 'secondari' && (
        SHEET_SECONDARI_EMBED_URL ? (
          <div className="ratio ratio-16x9" style={{ minHeight: 500 }}>
            <iframe
              src={`${SHEET_SECONDARI_EMBED_URL}${SHEET_SECONDARI_EMBED_URL.includes('?') ? '&' : '?'}cb=${cacheKey}`}
              title="Servizi Secondari"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0, width: '100%', height: '100%' }}
            />
          </div>
        ) : (
          <div className="alert alert-info">
            Configura l'URL Excel dei Servizi Secondari in `Calendar.jsx` per visualizzarlo qui.
          </div>
        )
      )}
    </div>
  );
}

export default Calendar;

