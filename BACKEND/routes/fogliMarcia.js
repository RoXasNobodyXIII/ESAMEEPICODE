const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
<<<<<<< HEAD
const { encrypt, decrypt } = require('../services/crypto');

async function getCurrentUser(req) {
  const db = req.app.locals.db;
  return db.collection('users').findOne({ username: req.user?.username });
}

function hasPerm(user, section, key) {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return user?.permessi?.[section]?.[key] === true;
}
=======
>>>>>>> d11cca6 (first commit)

// Collection name
const COLLECTION = 'fogli_marcia';
const ODO_COLLECTION = 'mezzi_odo';
const COUNTERS_COLLECTION = 'service_counters';
<<<<<<< HEAD
const PDFDocument = require('pdfkit');
const https = require('https');

// Validate input
=======

// Validate and normalize input
>>>>>>> d11cca6 (first commit)
function validatePayload(body) {
  const required = ['tipologiaServizio','data','richiestoDa','motivoServizio','cognome','nome'];
  for (const k of required) {
    if (!body[k] || String(body[k]).trim() === '') {
      return { ok: false, message: `Campo obbligatorio mancante: ${k}` };
    }
  }
  return { ok: true };
}

<<<<<<< HEAD

router.post('/', authMiddleware, async (req, res) => {
  try {
    const user = await getCurrentUser(req);
    if (!hasPerm(user, 'fogliMarcia', 'inserire')) {
      return res.status(403).json({ message: 'Permesso mancante: fogliMarcia.inserire' });
    }
=======
// POST /fogli-marcia -> create new record
router.post('/', authMiddleware, async (req, res) => {
  try {
>>>>>>> d11cca6 (first commit)
    const db = req.app.locals.db;
    const col = db.collection(COLLECTION);
    const odos = db.collection(ODO_COLLECTION);
    const counters = db.collection(COUNTERS_COLLECTION);

    const payload = req.body || {};
    const check = validatePayload(payload);
    if (!check.ok) return res.status(400).json({ message: check.message });

<<<<<<< HEAD
    // mezzo
    const mezzo = (payload.mezzo || '').trim();

=======
    // normalize mezzo
    const mezzo = (payload.mezzo || '').trim();
    console.log('[POST /fogli-marcia] payload keys:', Object.keys(payload));
    console.log('[POST /fogli-marcia] mezzo:', mezzo || '(none)');

    // helper: get current odometer with baseline if needed
>>>>>>> d11cca6 (first commit)
    async function getCurrentOdo(mz) {
      if (!mz) return null;
      const existing = await odos.findOne({ mezzo: mz });
      if (existing && typeof existing.currentKm === 'number') return existing.currentKm;
<<<<<<< HEAD

      let baseline = null;
      if (mz.startsWith('A03') || mz.includes('GG772FV') || mz.includes('1106')) baseline = 88904;
      else if (mz.startsWith('A04') || mz.includes('GN005MH') || mz.includes('1284')) baseline = 60803;

=======
      // Baseline defaults
      let baseline = null;
      if (mz.startsWith('A03') || mz.includes('GG772FV') || mz.includes('1106')) baseline = 88904;
      else if (mz.startsWith('A04') || mz.includes('GN005MH') || mz.includes('1284')) baseline = 60803;
      // If baseline defined, upsert now
>>>>>>> d11cca6 (first commit)
      if (baseline !== null) {
        await odos.updateOne(
          { mezzo: mz },
          { $setOnInsert: { mezzo: mz, currentKm: baseline, updatedAt: new Date() } },
          { upsert: true }
        );
        return baseline;
      }
<<<<<<< HEAD
      return 0; 
    }

=======
      return 0; // default if unknown mezzo
    }

    // generate incremental id (legacy numeric)
    // Use atomic counter to avoid duplicates or resets
>>>>>>> d11cca6 (first commit)
    let nextId = 1;
    try {
      const idCounter = await counters.findOneAndUpdate(
        { _id: 'fogli_marcia_global' },
        { $inc: { seq: 1 }, $setOnInsert: { _id: 'fogli_marcia_global', createdAt: new Date() } },
        { upsert: true, returnDocument: 'after' }
      );
      nextId = Number(idCounter.value?.seq) || 1;
    } catch (e) {
      console.warn('[POST /fogli-marcia] global counter failed, falling back to scan:', e?.message);
      const last = await col.find({}, { projection: { id: 1 } }).sort({ id: -1 }).limit(1).toArray();
      nextId = last.length ? (Number(last[0].id) || 0) + 1 : 1;
    }

<<<<<<< HEAD
  
=======
    // generate per-year service code: CDOyyNNNNN, where yy = last two digits of year, NNNNN = 5-digit sequence per year
>>>>>>> d11cca6 (first commit)
    const year = new Date().getFullYear();
    const yy = String(year % 100).padStart(2, '0');
    let serviceCode = `CDO${yy}00000`;
    try {
<<<<<<< HEAD
=======
      console.log('[POST /fogli-marcia] incrementing counter for year');
      // Use per-year atomic counter with stable _id and no conflicting seq in $setOnInsert
>>>>>>> d11cca6 (first commit)
      const counterDoc = await counters.findOneAndUpdate(
        { _id: `fogli_marcia_year_${year}` },
        { $inc: { seq: 1 }, $setOnInsert: { _id: `fogli_marcia_year_${year}`, year, createdAt: new Date() } },
        { upsert: true, returnDocument: 'after' }
      );
      let seq = Number(counterDoc.value?.seq);
      if (!Number.isFinite(seq)) {
        console.warn('[POST /fogli-marcia] counterDoc.value.seq invalid, refetching');
        const after = await counters.findOne({ _id: `fogli_marcia_year_${year}` });
<<<<<<< HEAD
        seq = Number(after?.seq) || 1; 
=======
        seq = Number(after?.seq) || 1;
>>>>>>> d11cca6 (first commit)
      }
      serviceCode = `CDO${yy}${String(seq).padStart(5, '0')}`;
    } catch (e) {
      console.error('[POST /fogli-marcia] counter increment failed:', e?.message);
<<<<<<< HEAD
      const t = Date.now() % 100000;
      serviceCode = `CDO${yy}${String(t).padStart(5, '0')}`;
    }
    
=======
      // fallback: derive a semi-unique sequence from time to avoid duplicates
      const t = Date.now() % 100000; // last 5 digits of timestamp
      serviceCode = `CDO${yy}${String(t).padStart(5, '0')}`;
    }
    console.log('[POST /fogli-marcia] serviceCode:', serviceCode);

    // ensure kmIniziali default from odometer if not provided
>>>>>>> d11cca6 (first commit)
    if ((!payload.kmIniziali && payload.kmIniziali !== 0) && mezzo) {
      payload.kmIniziali = await getCurrentOdo(mezzo);
    }

<<<<<<< HEAD
    const encKeys = ['note','destinazione','indirizzo','cognome','nome'];
    for (const k of encKeys) {
      if (payload[k] != null && String(payload[k]).trim() !== '') payload[k] = encrypt(payload[k]);
    }
=======
>>>>>>> d11cca6 (first commit)
    const doc = {
      id: nextId,
      createdAt: new Date(),
      createdBy: req.user?.username || 'unknown',
      serviceCode,
      ...payload,
    };

<<<<<<< HEAD
    let result;
    try {
      result = await col.insertOne(doc);
    } catch (e) {
      if (e && e.code === 11000) {
        console.warn('[POST /fogli-marcia] duplicate id detected, retrying with recomputed nextId');
        const last = await col.find({}, { projection: { id: 1 } }).sort({ id: -1 }).limit(1).toArray();
        const recomputedId = last.length ? (Number(last[0].id) || 0) + 1 : 1;
        doc.id = recomputedId;
        result = await col.insertOne(doc);
      } else {
        throw e;
      }
    }

    // Update kmFinali
=======
    const result = await col.insertOne(doc);
    console.log('[POST /fogli-marcia] inserted id:', result.insertedId);

    // Update odometer if kmFinali present and valid
>>>>>>> d11cca6 (first commit)
    const kmIni = Number(payload.kmIniziali);
    const kmFin = Number(payload.kmFinali);
    try {
      if (mezzo && Number.isFinite(kmFin) && (!Number.isFinite(kmIni) || kmFin >= kmIni)) {
        await odos.updateOne(
          { mezzo },
          { $set: { mezzo, currentKm: kmFin, updatedAt: new Date() } },
          { upsert: true }
        );
      }
    } catch (e) {
      console.warn('[POST /fogli-marcia] odometer update failed:', e?.message);
<<<<<<< HEAD
=======
      // do not fail request due to auxiliary update
>>>>>>> d11cca6 (first commit)
    }

    return res.status(201).json({ id: nextId, serviceCode, _id: result.insertedId, message: 'Creato' });
  } catch (err) {
    console.error('Errore creazione foglio marcia:', err?.message, err?.stack);
    return res.status(500).json({ message: 'Errore server', error: err?.message });
  }
});

<<<<<<< HEAD
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await getCurrentUser(req);
    if (!hasPerm(user, 'fogliMarcia', 'elenco')) {
      return res.status(403).json({ message: 'Permesso mancante: fogliMarcia.elenco' });
    }
    const db = req.app.locals.db;
    const col = db.collection(COLLECTION);

    const role = req.user?.role || 'volontario';
    const username = req.user?.username;

    const q = {};
    if (req.query.mezzo) q.mezzo = String(req.query.mezzo);

    const rx = (s) => new RegExp(String(s).trim().replace(/[.*+?^${}()|[\\]\\]/g, '\\$&'), 'i');
    const filterIndirizzo = (req.query.indirizzo && String(req.query.indirizzo).trim()) ? rx(req.query.indirizzo) : null;
    const filterCognome = (req.query.cognome && String(req.query.cognome).trim()) ? rx(req.query.cognome) : null;
    const filterNome = (req.query.nome && String(req.query.nome).trim()) ? rx(req.query.nome) : null;

    if (role !== 'admin' && username) {

      q.$or = [
        { autista: username },
        { soccorritore1: username },
        { soccorritore2: username },
        { infermiere: username },
        { medico: username },
        { createdBy: username }
      ];

      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      const day = `${y}-${m}-${d}`;

      const start = new Date(day + 'T00:00:00.000Z');
      const end = new Date(day + 'T23:59:59.999Z');

      q.$and = [
        {
          $or: [
            { data: day },
            { createdAt: { $gte: start, $lt: end } }
          ]
        }
      ];
    }

    const items = await col.find(q).sort({ createdAt: -1 }).limit(200).toArray();
    const encKeys = ['note','destinazione','indirizzo','cognome','nome'];
    const out = items.map(it => {
      const o = { ...it };
      for (const k of encKeys) {
        if (o[k]) o[k] = decrypt(o[k]);
      }
      return o;
    });
    const filtered = out.filter(o => {
      if (filterIndirizzo && !filterIndirizzo.test(String(o.indirizzo || ''))) return false;
      if (filterCognome && !filterCognome.test(String(o.cognome || ''))) return false;
      if (filterNome && !filterNome.test(String(o.nome || ''))) return false;
      return true;
    });
    return res.json(filtered);
=======
// GET /fogli-marcia -> list (optional filter by mezzo)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const col = db.collection(COLLECTION);
    const q = {};
    if (req.query.mezzo) q.mezzo = String(req.query.mezzo);
    const items = await col.find(q).sort({ createdAt: -1 }).limit(200).toArray();
    return res.json(items);
>>>>>>> d11cca6 (first commit)
  } catch (err) {
    console.error('Errore list fogli marcia:', err);
    return res.status(500).json({ message: 'Errore server' });
  }
});

<<<<<<< HEAD

=======
// GET /fogli-marcia/:id -> get single by numeric id
>>>>>>> d11cca6 (first commit)
router.get('/:id(\\d+)', authMiddleware, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const col = db.collection(COLLECTION);
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: 'ID non valido' });
    const doc = await col.findOne({ id });
    if (!doc) return res.status(404).json({ message: 'Non trovato' });
<<<<<<< HEAD
    const encKeys = ['note','destinazione','indirizzo','cognome','nome'];
    const o = { ...doc };
    for (const k of encKeys) {
      if (o[k]) o[k] = decrypt(o[k]);
    }
    return res.json(o);
=======
    return res.json(doc);
>>>>>>> d11cca6 (first commit)
  } catch (err) {
    console.error('Errore get foglio marcia:', err);
    return res.status(500).json({ message: 'Errore server' });
  }
});

<<<<<<< HEAD
router.put('/:id(\\d+)', authMiddleware, async (req, res) => {
  try {
    const user = await getCurrentUser(req);
    if (!hasPerm(user, 'fogliMarcia', 'modifica')) {
      return res.status(403).json({ message: 'Permesso mancante: fogliMarcia.modifica' });
    }
=======
// PUT /fogli-marcia/:id -> update limited fields
router.put('/:id(\\d+)', authMiddleware, async (req, res) => {
  try {
>>>>>>> d11cca6 (first commit)
    const db = req.app.locals.db;
    const col = db.collection(COLLECTION);
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: 'ID non valido' });
<<<<<<< HEAD
    const allowed = ['indirizzo','uscita','sulPosto','arrivoDestinazione','fine','esito','destinazione','note','autista','soccorritore1','soccorritore2','infermiere','medico','kmFinali','cognome','nome'];
    const update = {};
    for (const k of allowed) if (k in req.body) update[k] = req.body[k];
    const encKeys = ['note','destinazione','indirizzo','cognome','nome'];
    for (const k of encKeys) {
      if (k in update && update[k] != null && String(update[k]).trim() !== '') update[k] = encrypt(update[k]);
    }
=======
    const allowed = ['indirizzo','uscita','sulPosto','arrivoDestinazione','fine','esito','destinazione','note','autista','soccorritore1','soccorritore2','infermiere','medico','kmFinali'];
    const update = {};
    for (const k of allowed) if (k in req.body) update[k] = req.body[k];
>>>>>>> d11cca6 (first commit)
    if (Object.keys(update).length === 0) return res.status(400).json({ message: 'Nessun campo aggiornabile fornito' });
    update.updatedAt = new Date();
    const result = await col.findOneAndUpdate({ id }, { $set: update }, { returnDocument: 'after' });
    if (!result.value) return res.status(404).json({ message: 'Non trovato' });
<<<<<<< HEAD
    const o = { ...result.value };
    for (const k of encKeys) {
      if (o[k]) o[k] = decrypt(o[k]);
    }
    return res.json({ message: 'Aggiornato', item: o });
=======
    return res.json({ message: 'Aggiornato', item: result.value });
>>>>>>> d11cca6 (first commit)
  } catch (err) {
    console.error('Errore update foglio marcia:', err);
    return res.status(500).json({ message: 'Errore server' });
  }
});

<<<<<<< HEAD
=======
// DELETE /fogli-marcia/:id -> delete by numeric id
>>>>>>> d11cca6 (first commit)
router.delete('/:id(\\d+)', authMiddleware, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const col = db.collection(COLLECTION);
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: 'ID non valido' });
    const result = await col.deleteOne({ id });
    if (!result.deletedCount) return res.status(404).json({ message: 'Non trovato' });
    return res.json({ message: 'Eliminato' });
  } catch (err) {
    console.error('Errore delete foglio marcia:', err);
    return res.status(500).json({ message: 'Errore server' });
  }
});

<<<<<<< HEAD

=======
// GET /fogli-marcia/odometer?mezzo=... -> currentKm for mezzo with baseline if needed
>>>>>>> d11cca6 (first commit)
router.get('/odometer', authMiddleware, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const odos = db.collection(ODO_COLLECTION);
    const mezzo = String(req.query.mezzo || '').trim();
    if (!mezzo) return res.status(400).json({ message: 'Parametro mezzo mancante' });

    let rec = await odos.findOne({ mezzo });
    if (!rec) {
<<<<<<< HEAD
=======
      // Seed baseline if applicable
>>>>>>> d11cca6 (first commit)
      let baseline = null;
      if (mezzo.startsWith('A03') || mezzo.includes('GG772FV') || mezzo.includes('1106')) baseline = 88904;
      else if (mezzo.startsWith('A04') || mezzo.includes('GN005MH') || mezzo.includes('1284')) baseline = 60803;
      await odos.updateOne(
        { mezzo },
        { $setOnInsert: { mezzo, currentKm: baseline !== null ? baseline : 0, updatedAt: new Date() } },
        { upsert: true }
      );
      rec = await odos.findOne({ mezzo });
    }
    return res.json({ mezzo, currentKm: rec.currentKm || 0 });
  } catch (err) {
    console.error('Errore odometer:', err);
    return res.status(500).json({ message: 'Errore server' });
  }
});

module.exports = router;
<<<<<<< HEAD

// PDF Report: GET /fogli-marcia/report?from=YYYY-MM-DDTHH:mm&to=YYYY-MM-DDTHH:mm&mezzo=...&postazione=...
router.get('/report', authMiddleware, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const col = db.collection(COLLECTION);

    const role = req.user?.role || 'volontario';
    const username = req.user?.username;

    // Parse filters
    const mezzo = (req.query.mezzo || '').trim();
    const postazione = (req.query.postazione || '').trim();
    const fromStr = (req.query.from || '').trim();
    const toStr = (req.query.to || '').trim();

    let q = {};
    const and = [];
    if (mezzo) and.push({ mezzo });
    if (postazione) and.push({ postazione });

    // Date range
    let start, end;
    if (fromStr) start = new Date(fromStr);
    if (toStr) end = new Date(toStr);

    // Non-admin: restrict to involvement and to TODAY regardless of provided range
    if (role !== 'admin' && username) {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      const day = `${y}-${m}-${d}`;
      start = new Date(day + 'T00:00:00.000Z');
      end = new Date(day + 'T23:59:59.999Z');
      q.$or = [
        { autista: username },
        { soccorritore1: username },
        { soccorritore2: username },
        { infermiere: username },
        { medico: username },
        { createdBy: username }
      ];
    }

    if (start || end) {
      const cond = {};
      if (start) cond.$gte = start;
      if (end) cond.$lt = end;
      and.push({ createdAt: cond });
    }

    if (and.length) q.$and = and;

    const items = await col.find(q).sort({ createdAt: 1 }).limit(2000).toArray();

    // Build PDF
    const disposition = (String(req.query.disposition || '').toLowerCase() === 'inline') ? 'inline' : 'attachment';
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `${disposition}; filename="report-fogli-marcia.pdf"`);

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    doc.pipe(res);

    // Utilities
    const fmtDateTime = (dt) => (dt ? new Date(dt).toLocaleString('it-IT', { hour12: false }) : '');
    const fetchBuffer = (url) => new Promise((resolve, reject) => {
      if (!url) return resolve(null);
      https
        .get(url, (resp) => {
          const chunks = [];
          resp.on('data', (d) => chunks.push(d));
          resp.on('end', () => resolve(Buffer.concat(chunks)));
        })
        .on('error', reject);
    });

    // Header with logos and organization info
    const LOGO_URL = 'https://res.cloudinary.com/dkbahjqa6/image/upload/v1760208659/LOGO_CROCE_yzhmab.jpg';
    let logoBuf = null;
    try { logoBuf = await fetchBuffer(LOGO_URL); } catch {}

    const pageWidth = doc.page.width;
    const margin = doc.page.margins.left; // 40
    const contentWidth = pageWidth - margin - doc.page.margins.right;
    const topY = 40;

    if (logoBuf) {
      try { doc.image(logoBuf, margin, topY, { width: 60 }); } catch {}
      try { doc.image(logoBuf, margin + contentWidth - 60, topY, { width: 60 }); } catch {}
    }

    doc.fontSize(14).fillColor('#000').text("Croce d'Oro Sud Pontino ODV", margin, topY + 5, {
      width: contentWidth,
      align: 'center',
    });
    doc.moveDown(0.2);
    doc.fontSize(10).fillColor('#1a73e8').text('Via Roma snc', {
      width: contentWidth,
      align: 'center',
    });
    doc.text('04016 SPERLONGA (LT)', {
      width: contentWidth,
      align: 'center',
    });

    // Filters (Periodo / Postazione)
    const fromTxt = fmtDateTime(fromStr);
    const toTxt = fmtDateTime(toStr);
    doc.moveDown(0.6);
    const yAfterHeader = doc.y;

    doc.fontSize(11).fillColor('#000');
    doc.text('Periodo: ', margin + 100, yAfterHeader, { continued: true });
    doc.fontSize(11).fillColor('#000').font('Helvetica-Bold');
    doc.text(`${fromTxt || '-'}`);
    doc.text('  -  ', { continued: true });
    doc.text(`${toTxt || '-'}`);
    doc.font('Helvetica');
    doc.moveDown(0.2);
    doc.text(`Postazione: ${postazione || '-'}`, { align: 'center' });

    // Table configuration
    const tableTop = doc.y + 12;
    const colDefs = [
      { key: 'data', label: 'Data e ora', width: 95 },
      { key: 'targa', label: 'Targa', width: 70 },
      { key: 'prog', label: 'Progr.CO', width: 70 },
      { key: 'target', label: 'Target', width: 170 },
      { key: 'kmStart', label: 'Km di partenza', width: 85 },
      { key: 'kmEnd', label: 'Km di arrivo', width: 85 },
      { key: 'kmPerc', label: 'Km percorsi', width: 80 },
    ];
    const colX = [];
    let accX = margin;
    for (const c of colDefs) { colX.push(accX); accX += c.width; }

    // Header row background
    const headerHeight = 24;
    doc.save();
    doc.rect(margin, tableTop, accX - margin, headerHeight).fill('#ffeb3b');
    doc.restore();
    doc.strokeColor('#000').lineWidth(1);
    // Vertical lines for header
    for (let i = 0; i <= colDefs.length; i++) {
      const x = i === colDefs.length ? accX : colX[i];
      doc.moveTo(x, tableTop).lineTo(x, tableTop + headerHeight).stroke();
    }
    // Header labels
    doc.fillColor('#000').font('Helvetica-Bold').fontSize(10);
    colDefs.forEach((c, i) => {
      doc.text(c.label, colX[i] + 4, tableTop + 6, { width: c.width - 8, align: 'center' });
    });

    // Rows
    let y = tableTop + headerHeight;
    doc.font('Helvetica').fontSize(9).fillColor('#000');
    const rowHeight = 20;
    items.forEach((it, idx) => {
      // zebra background
      if (idx % 2 === 1) {
        doc.save();
        doc.rect(margin, y, accX - margin, rowHeight).fill('#fafafa');
        doc.restore();
      }

      const dTxt = fmtDateTime(it.data || it.createdAt);
      const targa = it.mezzo || '-';
      const prog = it.serviceCode || `#${it.id}`;
      const target = it.indirizzo || '-';
      const kmStart = Number.isFinite(Number(it.kmIniziali)) ? Number(it.kmIniziali) : '';
      const kmEnd = Number.isFinite(Number(it.kmFinali)) ? Number(it.kmFinali) : '';
      const kmPerc = (Number.isFinite(Number(kmStart)) && Number.isFinite(Number(kmEnd))) ? (Number(kmEnd) - Number(kmStart)) : '';

      const cells = [dTxt, targa, prog, target, String(kmStart), String(kmEnd), String(kmPerc)];
      cells.forEach((val, i) => {
        const align = i >= 4 ? 'right' : (i === 3 ? 'left' : 'center');
        doc.fillColor('#000').text(val || '', colX[i] + 4, y + 5, { width: colDefs[i].width - 8, align });
      });

      // Row borders
      doc.strokeColor('#000').lineWidth(0.5);
      doc.moveTo(margin, y).lineTo(accX, y).stroke();
      for (let i = 0; i <= colDefs.length; i++) {
        const x = i === colDefs.length ? accX : colX[i];
        doc.moveTo(x, y).lineTo(x, y + rowHeight).stroke();
      }

      y += rowHeight;
      // page break
      if (y > doc.page.height - doc.page.margins.bottom - 40) {
        doc.addPage();
        // re-draw header on new page
        y = doc.y;
        const newTop = y;
        doc.save();
        doc.rect(margin, newTop, accX - margin, headerHeight).fill('#ffeb3b');
        doc.restore();
        doc.strokeColor('#000').lineWidth(1);
        for (let i = 0; i <= colDefs.length; i++) {
          const x = i === colDefs.length ? accX : colX[i];
          doc.moveTo(x, newTop).lineTo(x, newTop + headerHeight).stroke();
        }
        doc.fillColor('#000').font('Helvetica-Bold').fontSize(10);
        colDefs.forEach((c, i) => {
          doc.text(c.label, colX[i] + 4, newTop + 6, { width: c.width - 8, align: 'center' });
        });
        y = newTop + headerHeight;
        doc.font('Helvetica').fontSize(9);
      }
    });

    // Bottom border line for the last row
    doc.strokeColor('#000').lineWidth(0.5);
    doc.moveTo(margin, y).lineTo(accX, y).stroke();

    doc.end();
  } catch (err) {
    console.error('Errore report fogli marcia:', err);
    return res.status(500).json({ message: 'Errore generazione report' });
  }
});
=======
>>>>>>> d11cca6 (first commit)
