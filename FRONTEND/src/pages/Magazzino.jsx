import React, { useEffect, useState } from 'react';
import api from '../api';
import { getAccessToken, getUserRole } from '../auth';

const Magazzino = () => {
  const SHEET_PUB_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRsmBqj7eqRlsMgQD6PQXm33YayJnCRrNw8NgD-vMXL1pySJlUeFqBkXzAY1nPZcw/pubhtml';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');
  const [importInfo, setImportInfo] = useState(null);

  useEffect(() => {
    document.title = 'Magazzino';
  }, []);

  const loadItems = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/warehouse/db');
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Errore caricamento');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auth guard: if no token, go to login
    const token = getAccessToken();
    if (!token) {
      try { window.location && (window.location.href = '/login'); } catch {}
      return;
    }
    loadItems();
  }, []);

  const importFromGoogle = async () => {
    setImporting(true);
    setError('');
    setImportInfo(null);
    try {
      const token = getAccessToken();
      const { data } = await api.post(
        '/warehouse/import-google',
        { sheetUrl: SHEET_PUB_URL, accessToken: token },
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
      setImportInfo(data);
      await loadItems();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Errore import');
    } finally {
      setImporting(false);
    }
  };
  return (
    <div>
      <h4>Magazzino</h4>
      <p className="text-muted">CRUD materiali/dispositivi (lista, aggiungi, modifica, elimina) – integrazione API in corso.</p>

      <div className="d-flex align-items-center gap-2 mb-3">
        <button className="btn btn-sm btn-outline-secondary" onClick={loadItems} disabled={loading || importing}>
          {loading ? 'Caricamento…' : 'Ricarica'}
        </button>
        <button
          className="btn btn-sm btn-primary"
          onClick={importFromGoogle}
          disabled={loading || importing || getUserRole() !== 'admin'}
          title={getUserRole() !== 'admin' ? 'Solo amministratori possono importare' : ''}
        >
          {importing ? 'Import in corso…' : 'Importa da Google Sheets'}
        </button>
      </div>

      {getUserRole() !== 'admin' ? (
        <div className="alert alert-warning py-2">Solo gli utenti con ruolo admin possono importare dal foglio Google.</div>
      ) : null}

      {error ? (
        <div className="alert alert-danger py-2">{error}</div>
      ) : null}

      {importInfo ? (
        <div className="alert alert-success py-2">
          Import eseguito: {importInfo?.upserted ?? 0} aggiornati/inseriti su {importInfo?.total ?? 0}
        </div>
      ) : null}

      <div className="d-none d-md-block">
        <div className="table-responsive">
          <table className="table table-sm table-striped align-middle">
            <thead>
              <tr>
                <th>Descrizione</th>
                <th>Categoria</th>
                <th>Quantità</th>
                <th>Q. Min</th>
                <th>Q. Reintegro</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-muted">Nessun elemento</td>
                </tr>
              ) : (
                items.map((it) => (
                  <tr key={it._id || `${it.descrizione || ''}-${it.categoria || ''}`}>
                    <td>{it.descrizione || ''}</td>
                    <td>{it.categoria || ''}</td>
                    <td>{typeof it.quantita === 'number' ? it.quantita : (it.quantita || '')}</td>
                    <td>{typeof it.q_min === 'number' ? it.q_min : (it.q_min || '')}</td>
                    <td>{typeof it.q_reintegro === 'number' ? it.q_reintegro : (it.q_reintegro || '')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="d-md-none">
        <div className="list-group">
          {items.length === 0 ? (
            <div className="list-group-item text-muted">Nessun elemento</div>
          ) : (
            items.map((it) => (
              <div key={it._id || `${it.descrizione || ''}-${it.categoria || ''}`} className="list-group-item">
                <div className="fw-semibold">{it.descrizione || ''}</div>
                <div className="small text-muted">{it.categoria || ''}</div>
                <div className="mt-1">
                  <span className="badge bg-light text-dark me-1">Q: {typeof it.quantita === 'number' ? it.quantita : (it.quantita || '')}</span>
                  <span className="badge bg-light text-dark me-1">Min: {typeof it.q_min === 'number' ? it.q_min : (it.q_min || '')}</span>
                  <span className="badge bg-light text-dark">Reint.: {typeof it.q_reintegro === 'number' ? it.q_reintegro : (it.q_reintegro || '')}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Magazzino;

