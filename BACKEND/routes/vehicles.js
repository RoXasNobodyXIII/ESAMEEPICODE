const express = require('express');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const { sendMail } = require('../services/email');

const router = express.Router();

const VEHICLES_COL = 'vehicles';
const EVENTS_COL = 'vehicle_events';

function adminOnly(req, res, next) {
  return roleMiddleware(['admin'])(req, res, next);
}

function getDb(req) {
  return req.app.locals.db;
}

router.get('/', authMiddleware, async (req, res) => {
  try {
    const db = getDb(req);
    const items = await db.collection(VEHICLES_COL).find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: 'Errore caricamento mezzi' });
  }
});

router.get('/:id(\\d+)', authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const db = getDb(req);
    const v = await db.collection(VEHICLES_COL).findOne({ id }, { projection: { _id: 0 } });
    if (!v) return res.status(404).json({ message: 'Mezzo non trovato' });
    res.json(v);
  } catch (e) {
    res.status(500).json({ message: 'Errore caricamento mezzo' });
  }
});

router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const db = getDb(req);
    const col = db.collection(VEHICLES_COL);
    const last = await col.find({}, { projection: { id: 1 } }).sort({ id: -1 }).limit(1).toArray();
    const nextId = last.length ? (Number(last[0].id) || 0) + 1 : 1;

    const body = req.body || {};
    const doc = {
      id: nextId,
      createdAt: new Date(),
      createdBy: req.user?.username || 'unknown',
      targa: String(body.targa || '').trim(),
      codiceARES: String(body.codiceARES || '').trim(),
      identificativo: String(body.identificativo || '').trim(),
      tipologia: String(body.tipologia || '').trim(),
      posti: Number(body.posti) || 0,
      olioMax: Number(body.olioMax) || 0,
      currentKm: Number(body.currentKm) || 0,
      note: String(body.note || '').trim()
    };
    if (!doc.identificativo || !doc.targa || !doc.tipologia) {
      return res.status(400).json({ message: 'Campi richiesti: identificativo, targa, tipologia' });
    }

    await col.insertOne(doc);
    res.status(201).json(doc);
  } catch (e) {
    res.status(500).json({ message: 'Errore creazione mezzo' });
  }
});

router.put('/:id(\\d+)', authMiddleware, adminOnly, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const db = getDb(req);
    const update = {};
    const allowed = ['targa','codiceARES','identificativo','tipologia','posti','olioMax','currentKm','note'];
    for (const k of allowed) if (k in req.body) update[k] = req.body[k];
    if (!Object.keys(update).length) return res.status(400).json({ message: 'Nessun campo' });
    update.updatedAt = new Date();
    const r = await db.collection(VEHICLES_COL).findOneAndUpdate({ id }, { $set: update }, { returnDocument: 'after' });
    if (!r.value) return res.status(404).json({ message: 'Non trovato' });
    res.json(r.value);
  } catch (e) {
    res.status(500).json({ message: 'Errore aggiornamento mezzo' });
  }
});

router.delete('/:id(\\d+)', authMiddleware, adminOnly, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const db = getDb(req);
    await db.collection(VEHICLES_COL).deleteOne({ id });
    await db.collection(EVENTS_COL).deleteMany({ vehicleId: id });
    res.json({ message: 'Eliminato' });
  } catch (e) {
    res.status(500).json({ message: 'Errore eliminazione mezzo' });
  }
});

router.get('/:id(\\d+)/events', authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const db = getDb(req);
    const events = await db.collection(EVENTS_COL).find({ vehicleId: id }, { projection: { _id: 0 } }).sort({ date: -1, createdAt: -1 }).toArray();
    res.json(events);
  } catch (e) {
    res.status(500).json({ message: 'Errore caricamento eventi' });
  }
});

router.post('/:id(\\d+)/events', authMiddleware, adminOnly, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const db = getDb(req);
    const v = await db.collection(VEHICLES_COL).findOne({ id });
    if (!v) return res.status(404).json({ message: 'Mezzo non trovato' });

    const body = req.body || {};
    const type = String(body.type || '').trim();
    if (!['assicurazione','revisione','tagliando','pneumatici','manutenzione'].includes(type)) {
      return res.status(400).json({ message: 'Tipo evento non valido' });
    }

    const eventsCol = db.collection(EVENTS_COL);
    const last = await eventsCol.find({}, { projection: { id: 1 } }).sort({ id: -1 }).limit(1).toArray();
    const nextId = last.length ? (Number(last[0].id) || 0) + 1 : 1;

    const ev = {
      id: nextId,
      vehicleId: id,
      type,
      createdAt: new Date(),
      createdBy: req.user?.username || 'unknown',
      date: body.date ? new Date(body.date) : null,
      km: Number(body.km) || null,
      luogo: String(body.luogo || '').trim() || null,
      eseguitoDa: String(body.eseguitoDa || '').trim() || null,
      prossimoKm: Number(body.prossimoKm) || null,
      prossimaData: body.prossimaData ? new Date(body.prossimaData) : null,
      note: String(body.note || '').trim() || ''
    };

    await eventsCol.insertOne(ev);

    if (type === 'tagliando' || type === 'pneumatici') {
      const ck = Number(body.km);
      if (Number.isFinite(ck) && ck > (Number(v.currentKm) || 0)) {
        await db.collection(VEHICLES_COL).updateOne({ id }, { $set: { currentKm: ck, updatedAt: new Date() } });
      }
    }

    res.status(201).json(ev);
  } catch (e) {
    res.status(500).json({ message: 'Errore creazione evento' });
  }
});

router.post('/notify/due', authMiddleware, adminOnly, async (req, res) => {
  try {
    const db = getDb(req);
    const days = Number(req.body?.days || 15);
    const kmThreshold = Number(req.body?.kmThreshold || 500);

    const now = new Date();
    const onOrBefore = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const items = await db.collection(VEHICLES_COL).find({}).toArray();
    const events = await db.collection(EVENTS_COL).find({}).toArray();

    const byVehicle = new Map();
    for (const e of events) {
      if (!byVehicle.has(e.vehicleId)) byVehicle.set(e.vehicleId, []);
      byVehicle.get(e.vehicleId).push(e);
    }

    const due = [];
    for (const v of items) {
      const list = (byVehicle.get(v.id) || []).slice();
      const lastByType = (t) => list.filter(x => x.type === t).sort((a,b) => (b.date?.getTime()||0)-(a.date?.getTime()||0))[0];

      const insurance = lastByType('assicurazione');
      const revision = lastByType('revisione');
      const tagliando = lastByType('tagliando');
      const gomme = lastByType('pneumatici');

      if (insurance?.prossimaData && insurance.prossimaData <= onOrBefore) due.push({ mezzo: v, tipo: 'Assicurazione', data: insurance.prossimaData });
      if (revision?.prossimaData && revision.prossimaData <= onOrBefore) due.push({ mezzo: v, tipo: 'Revisione', data: revision.prossimaData });

      if (tagliando?.prossimoKm && Number.isFinite(Number(tagliando.prossimoKm))) {
        const deltaKm = Number(tagliando.prossimoKm) - Number(v.currentKm || 0);
        if (deltaKm <= kmThreshold) due.push({ mezzo: v, tipo: 'Tagliando', km: tagliando.prossimoKm });
      }
      if (gomme?.prossimoKm && Number.isFinite(Number(gomme.prossimoKm))) {
        const deltaKm = Number(gomme.prossimoKm) - Number(v.currentKm || 0);
        if (deltaKm <= kmThreshold) due.push({ mezzo: v, tipo: 'Pneumatici', km: gomme.prossimoKm });
      }
    }

    if (!due.length) return res.json({ ok: true, sent: 0 });

    const to = (process.env.MEZZI_NOTIFY_TO || '').split(',').map(s => s.trim()).filter(Boolean);
    if (!to.length) return res.json({ ok: true, sent: 0, warn: 'No recipients configured' });

    const lines = due.map(d => {
      const head = `${d.tipo} - ${d.mezzo.targa}${d.mezzo.codiceARES ? ' ('+d.mezzo.codiceARES+')' : ''}`;
      if (d.data) return `${head}: entro ${d.data.toLocaleDateString('it-IT')}`;
      if (d.km) return `${head}: entro ${d.km} km (attuali ${d.mezzo.currentKm || 0})`;
      return head;
    });

    try {
      await sendMail({ to, subject: 'Scadenze mezzi', text: lines.join('\n'), html: `<pre>${lines.map(l=>l.replace(/</g,'&lt;')).join('<br/>')}</pre>` });
    } catch (e) {}

    res.json({ ok: true, sent: to.length, due: lines.length });
  } catch (e) {
    res.status(500).json({ message: 'Errore invio notifiche' });
  }
});

module.exports = router;
