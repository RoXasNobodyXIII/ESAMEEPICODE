const express = require('express');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
<<<<<<< HEAD
const http = require('http');
const https = require('https');
const router = express.Router();

=======
const router = express.Router();

// Mock warehouse items (in real app, use database)
>>>>>>> d11cca6 (first commit)
let items = [
  { id: 1, name: 'Bandages', quantity: 100, description: 'Medical bandages' },
  { id: 2, name: 'Gloves', quantity: 50, description: 'Latex gloves' }
];

// Validation rules
const itemValidationRules = [
  body('name').isLength({ min: 1 }).withMessage('Name is required'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description must be less than 500 characters')
];

<<<<<<< HEAD
// List all items
=======
// GET /warehouse - List all items
>>>>>>> d11cca6 (first commit)
router.get('/', authMiddleware, (req, res) => {
  res.json(items);
});

<<<<<<< HEAD
// List items from MongoDB collection instead of in-memory array
router.get('/db', authMiddleware, async (req, res) => {
  try {
    const db = req.app?.locals?.db;
    if (!db) return res.status(500).json({ message: 'Database not initialized' });
    const col = db.collection('warehouse_items');
    const docs = await col.find({}).toArray();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch from DB', error: err?.message || String(err) });
  }
});

// Diagnostic: verify auth header and user decoding
router.get('/auth-test', authMiddleware, (req, res) => {
  res.json({
    ok: true,
    hasAuthorizationHeader: Boolean(req.headers.authorization),
    user: req.user || null,
  });
});

// Get item by ID
=======
// GET /warehouse/:id - Get item by ID
>>>>>>> d11cca6 (first commit)
router.get('/:id', authMiddleware, (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }
  res.json(item);
});

<<<<<<< HEAD
// Create new item (admin only)
=======
// POST /warehouse - Create new item (admin only)
>>>>>>> d11cca6 (first commit)
router.post('/', authMiddleware, roleMiddleware(['admin']), itemValidationRules, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, quantity, description } = req.body;
  const newItem = {
    id: items.length + 1,
    name,
    quantity,
    description
  };

  items.push(newItem);
  res.status(201).json(newItem);
});

<<<<<<< HEAD
// Update item (admin only)
=======
// PUT /warehouse/:id - Update item (admin only)
>>>>>>> d11cca6 (first commit)
router.put('/:id', authMiddleware, roleMiddleware(['admin']), itemValidationRules, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  const { name, quantity, description } = req.body;
  item.name = name;
  item.quantity = quantity;
  item.description = description;

  res.json(item);
});

<<<<<<< HEAD
// Delete item (admin only)
=======
// DELETE /warehouse/:id - Delete item (admin only)
>>>>>>> d11cca6 (first commit)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  const itemIndex = items.findIndex(i => i.id === parseInt(req.params.id));
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }

  items.splice(itemIndex, 1);
  res.json({ message: 'Item deleted successfully' });
});

<<<<<<< HEAD
// Helper to populate Authorization header from body/query if missing (dev resilience)
function attachAuthFromPayload(req, res, next) {
  if (!req.headers.authorization) {
    const token = (req.body && (req.body.accessToken || req.body.token)) || req.query.token;
    if (token) {
      req.headers.authorization = `Bearer ${token}`;
    }
  }
  return next();
}

// Import warehouse data from Google Sheets (gviz JSON) into MongoDB
// Admin only
router.post('/import-google', attachAuthFromPayload, authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  // Accept either a published URL (pubhtml/pub) or a Sheet ID
  const defaultPublishedUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRsmBqj7eqRlsMgQD6PQXm33YayJnCRrNw8NgD-vMXL1pySJlUeFqBkXzAY1nPZcw/pubhtml';
  const sheetUrl = (req.body && req.body.sheetUrl) || defaultPublishedUrl;
  const sheetId = (req.body && req.body.sheetId) || null;

  function toCsvUrl(inputUrl, id) {
    if (inputUrl && /\/d\/e\//.test(inputUrl)) {
      // Published doc (d/e/..../pubhtml or /pub)
      return inputUrl.replace(/\/pubhtml(?:.*)?$/, '/pub?output=csv').replace(/\/pub(?:\?.*)?$/, '/pub?output=csv');
    }
    if (id) {
      return `https://docs.google.com/spreadsheets/d/${encodeURIComponent(id)}/export?format=csv`;
    }
    return null;
  }

  function parseCSV(text) {
    const rows = [];
    let cur = '';
    let inQuotes = false;
    let row = [];
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (inQuotes) {
        if (ch === '"') {
          if (text[i + 1] === '"') { cur += '"'; i++; } else { inQuotes = false; }
        } else {
          cur += ch;
        }
      } else {
        if (ch === '"') { inQuotes = true; }
        else if (ch === ',') { row.push(cur); cur = ''; }
        else if (ch === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
        else if (ch === '\r') { /* ignore */ }
        else { cur += ch; }
      }
    }
    if (cur.length > 0 || row.length > 0) { row.push(cur); rows.push(row); }
    return rows;
  }

  try {
    const csvUrl = toCsvUrl(sheetUrl, sheetId);
    if (!csvUrl) {
      return res.status(400).json({ message: 'Missing sheetUrl or sheetId' });
    }

    async function getWithRedirects(url, maxRedirects = 5) {
      return await new Promise((resolve, reject) => {
        const doGet = (u, redirects) => {
          const client = u.startsWith('https:') ? https : http;
          const req = client.get(u, { headers: { 'User-Agent': 'NodeJS' } }, (resp) => {
            const status = resp.statusCode || 0;
            if (status >= 300 && status < 400 && resp.headers.location) {
              if (redirects <= 0) return reject(new Error('Too many redirects'));
              const next = resp.headers.location.startsWith('http') ? resp.headers.location : new URL(resp.headers.location, u).toString();
              resp.resume();
              return doGet(next, redirects - 1);
            }
            if (status >= 400) {
              return reject(new Error(`HTTP ${status}`));
            }
            let data = '';
            resp.on('data', (chunk) => (data += chunk));
            resp.on('end', () => resolve(data));
          });
          req.on('error', (err) => reject(err));
        };
        doGet(url, maxRedirects);
      });
    }

    const csv = await getWithRedirects(csvUrl);

    const rows = parseCSV(csv);
    if (!rows.length) return res.json({ ok: true, total: 0, upserted: 0 });
    const headers = rows[0].map((h) => String(h || '').trim());
    const docs = [];
    for (let r = 1; r < rows.length; r++) {
      const rowVals = rows[r];
      if (!rowVals || !rowVals.some((v) => String(v).trim() !== '')) continue;
      const raw = {};
      headers.forEach((h, i) => {
        if (!h) return;
        const key = h.toLowerCase().trim();
        raw[key] = rowVals[i] ?? '';
      });

      // Helper to pick first non-empty value by possible header aliases
      const pick = (keys) => {
        for (const k of keys) {
          const v = raw[k];
          if (v != null && String(v).trim() !== '') return v;
        }
        return '';
      };
      const toNum = (v) => {
        const n = Number(String(v).replace(/[^0-9.-]/g, ''));
        return Number.isNaN(n) ? undefined : n;
      };

      const doc = {
        descrizione: pick(['descrizione', 'description', 'descrizione prodotto', 'nome', 'name']),
        categoria: pick(['categoria', 'category', 'cat']),
        quantita: toNum(pick(['quantita', 'quantità', 'quantity', 'qta'])),
        q_min: toNum(pick(['q.min', 'q_min', 'qmin', 'min', 'scorta_minima'])),
        q_reintegro: toNum(pick(['q.reintegro', 'q_reintegro', 'qreintegro', 'reintegro', 'scorta_target'])),
        updatedAt: new Date(),
      };

      // Skip empty lines with no core fields
      if (!doc.descrizione && !doc.categoria && doc.quantita === undefined && doc.q_min === undefined && doc.q_reintegro === undefined) {
        continue;
      }

      docs.push(doc);
    }

    const db = req.app?.locals?.db;
    if (!db) {
      return res.status(500).json({ message: 'Database not initialized' });
    }
    const col = db.collection('warehouse_items');
    try { await col.createIndex({ code: 1 }, { unique: true, sparse: true, name: 'uniq_code' }); } catch (_) {}
    try { await col.createIndex({ name: 1 }, { name: 'idx_name' }); } catch (_) {}
    try { await col.createIndex({ descrizione: 1, categoria: 1 }, { unique: true, sparse: true, name: 'uniq_descr_categoria' }); } catch (_) {}

    let upserted = 0;
    for (const doc of docs) {
      let filter = null;
      if (doc.code) filter = { code: doc.code };
      else if (doc.name) filter = { name: doc.name };
      else if (doc.descrizione && doc.categoria) filter = { descrizione: doc.descrizione, categoria: doc.categoria };
      else if (doc.descrizione) filter = { descrizione: doc.descrizione };

      if (filter) {
        const update = { $set: doc, $setOnInsert: { createdAt: new Date() } };
        const result = await col.updateOne(filter, update, { upsert: true });
        if (result.upsertedCount || result.modifiedCount) upserted += 1;
      } else {
        // No identifier at all: insert a new document so the item is not lost
        await col.insertOne({ ...doc, createdAt: new Date() });
        upserted += 1;
      }
    }

    return res.json({ ok: true, total: docs.length, upserted });
  } catch (err) {
    console.error('Import error:', err?.message || err);
    return res.status(500).json({ message: 'Import failed', error: err?.message || String(err) });
  }
});

=======
>>>>>>> d11cca6 (first commit)
module.exports = router;
