const express = require('express');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const router = express.Router();

<<<<<<< HEAD
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
=======
// Mock data references (in real app, import from database)
const users = [
  { id: 1, username: 'admin', role: 'admin', email: 'admin@example.com' },
  { id: 2, username: 'volontario', role: 'volontario', email: 'volontario@example.com' }
];

const items = [
  { id: 1, name: 'Bandages', quantity: 100, description: 'Medical bandages' },
  { id: 2, name: 'Gloves', quantity: 50, description: 'Latex gloves' }
];

const shifts = [
  { id: 1, userId: 2, date: '2023-10-01', startTime: '09:00', endTime: '17:00', description: 'Morning shift' },
  { id: 2, userId: 2, date: '2023-10-02', startTime: '14:00', endTime: '22:00', description: 'Evening shift' }
];

// GET /reports/users - User report (admin only)
router.get('/users', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  const report = {
    totalUsers: users.length,
    adminCount: users.filter(u => u.role === 'admin').length,
    volontarioCount: users.filter(u => u.role === 'volontario').length,
    users: users.map(u => ({ id: u.id, username: u.username, role: u.role }))
  };
  res.json(report);
});

// GET /reports/warehouse - Warehouse report
router.get('/warehouse', authMiddleware, (req, res) => {
  const report = {
    totalItems: items.length,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    lowStockItems: items.filter(item => item.quantity < 20),
    items: items
  };
  res.json(report);
});

// GET /reports/shifts - Shifts report
router.get('/shifts', authMiddleware, (req, res) => {
  const report = {
    totalShifts: shifts.length,
    shiftsByUser: shifts.reduce((acc, shift) => {
      acc[shift.userId] = (acc[shift.userId] || 0) + 1;
      return acc;
    }, {}),
    upcomingShifts: shifts.filter(shift => new Date(shift.date) >= new Date()),
    shifts: shifts
  };
  res.json(report);
>>>>>>> d11cca6 (first commit)
});

module.exports = router;
