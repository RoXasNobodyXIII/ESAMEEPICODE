import React, { useEffect, useState } from 'react';

<<<<<<< HEAD
function Calendar() {
=======
const Calendar = () => {
>>>>>>> d11cca6 (first commit)
  useEffect(() => {
    document.title = 'Calendario turni';
  }, []);

<<<<<<< HEAD
  // Calendari: 118 (Google Sheets) e Servizi Secondari (Excel on web)
  const SHEET_118_EMBED_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQUjQS5bQnFA-rXWhw1V2WeXKTg6dBs8yVZyh-ZzQMZLSClJrtL07hzUx_p2FX0gg/pubhtml';
  const SHEET_118_OPEN_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQUjQS5bQnFA-rXWhw1V2WeXKTg6dBs8yVZyh-ZzQMZLSClJrtL07hzUx_p2FX0gg/pubhtml';
  const SHEET_SECONDARI_EMBED_URL = '';
  const SHEET_SECONDARI_OPEN_URL = '';


  const [cacheKey, setCacheKey] = useState(() => Date.now());
  const refreshEmbed = () => setCacheKey(Date.now());
  const [view, setView] = useState('118');
=======
  // View-only embed using the published link
  // Provided published URL (stable, no login required):
  const SHEET_EMBED_URL =
    'https://docs.google.com/spreadsheets/d/1O34kqNWVjDBG8CeSE8EJYRTu5PorV9pC/pubhtml?widget=true&headers=false';
  // Button target (full Google Sheets UI for editing)
  const SHEET_EDIT_URL =
    'https://docs.google.com/spreadsheets/d/1O34kqNWVjDBG8CeSE8EJYRTu5PorV9pC/edit?usp=sharing';

  // Cache-busting key to force reload of the published content
  const [cacheKey, setCacheKey] = useState(() => Date.now());
  const refreshEmbed = () => setCacheKey(Date.now());
>>>>>>> d11cca6 (first commit)

  return (
    <div>
      <h4>Calendario turni</h4>
<<<<<<< HEAD
      <ul className="nav nav-pills mb-3">
        <li className="nav-item me-2">
          <button className={`btn btn-sm ${view==='118' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={()=>setView('118')}>118</button>
        </li>
        <li className="nav-item">
          <button className={`btn btn-sm ${view==='secondari' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={()=>setView('secondari')}>Servizi Secondari (Excel)</button>
        </li>
      </ul>
=======
      <p className="text-muted mb-2">
        Il calendario turni è gestito tramite Google Sheets.
      </p>
>>>>>>> d11cca6 (first commit)

      <div className="d-flex align-items-center justify-content-between mb-2">
        <small className="text-muted">Ultimo aggiornamento incorporato: {new Date(cacheKey).toLocaleTimeString()}</small>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-secondary" onClick={refreshEmbed}>Aggiorna</button>
<<<<<<< HEAD
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
=======
          <a
            className="btn btn-sm btn-outline-primary"
            href={SHEET_EDIT_URL}
            target="_blank"
            rel="noreferrer noopener"
          >
            Apri Google Fogli
          </a>
        </div>
      </div>

      <div className="ratio ratio-16x9" style={{ minHeight: 500 }}>
        <iframe
          src={`${SHEET_EMBED_URL}${SHEET_EMBED_URL.includes('?') ? '&' : '?'}cb=${cacheKey}`}
          title="Calendario turni - Google Sheets"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ border: 0, width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};
>>>>>>> d11cca6 (first commit)

export default Calendar;
