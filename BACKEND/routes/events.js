const express = require('express');
const { getDB } = require('../services/db');

const router = express.Router();

const COLLECTION = 'events';

function generateId() {
  return `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

function sanitizeEvent(input) {
  const allowed = ['id','title','date','time','description','image','link','type','status','location'];
  const out = {};
  for (const k of allowed) {
    if (input[k] !== undefined) out[k] = input[k];
  }
  return out;
}

// List events (public). Optional query: includeAll=true to include drafts
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const col = db.collection(COLLECTION);
    const includeAll = String(req.query.includeAll || 'false') === 'true';
    const filter = includeAll ? {} : { status: { $ne: 'bozza' } };
    const items = await col.find(filter).sort({ date: 1, time: 1 }).toArray();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list events' });
  }
});

// Get event by id (public)
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const col = db.collection(COLLECTION);
    const ev = await col.findOne({ id: String(req.params.id) });
    if (!ev) return res.status(404).json({ error: 'Not found' });
    res.json(ev);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get event' });
  }
});

// Create event
router.post('/', async (req, res) => {
  try {
    const db = getDB();
    const col = db.collection(COLLECTION);
    const data = sanitizeEvent(req.body || {});
    data.id = data.id || generateId();
    data.createdAt = new Date();
    data.updatedAt = new Date();
    await col.insertOne(data);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update event
router.put('/:id', async (req, res) => {
  try {
    const db = getDB();
    const col = db.collection(COLLECTION);
    const data = sanitizeEvent(req.body || {});
    data.updatedAt = new Date();
    const { value } = await col.findOneAndUpdate(
      { id: String(req.params.id) },
      { $set: data },
      { returnDocument: 'after' }
    );
    if (!value) return res.status(404).json({ error: 'Not found' });
    res.json(value);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const col = db.collection(COLLECTION);
    const result = await col.deleteOne({ id: String(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router;
