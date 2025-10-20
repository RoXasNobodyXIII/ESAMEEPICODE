const express = require('express');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const router = express.Router();

function getDb(req) {
  return req.app?.locals?.db;
}

router.get('/users', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const db = getDb(req);
    if (!db) return res.status(500).json({ message: 'Database not initialized' });
    const list = await db.collection('users').find({}, { projection: { _id: 0, password: 0 } }).toArray();
    const totalUsers = list.length;
    const adminCount = list.filter(u => u.role === 'admin').length;
    const volontarioCount = list.filter(u => u.role === 'volontario').length;
    const users = list.map(u => ({ id: u.id, username: u.username, role: u.role }));
    res.json({ totalUsers, adminCount, volontarioCount, users });
  } catch (e) {
    res.status(500).json({ message: 'Failed to build users report' });
  }
});

router.get('/warehouse', authMiddleware, async (req, res) => {
  try {
    const db = getDb(req);
    if (!db) return res.status(500).json({ message: 'Database not initialized' });
    const docs = await db.collection('warehouse_items').find({}, { projection: { _id: 0 } }).toArray();
    const totalItems = docs.length;
    const totalQuantity = docs.reduce((sum, it) => sum + (Number(it.quantita) || 0), 0);
    const lowStockItems = docs.filter(it => (Number(it.quantita) || 0) < (Number(it.q_min) || 0 || 20));
    res.json({ totalItems, totalQuantity, lowStockItems, items: docs });
  } catch (e) {
    res.status(500).json({ message: 'Failed to build warehouse report' });
  }
});

module.exports = router;
