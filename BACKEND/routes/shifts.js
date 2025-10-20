const express = require('express');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const router = express.Router();

// Mock shifts (in real app, use database)
let shifts = [
  { id: 1, userId: 2, date: '2023-10-01', startTime: '09:00', endTime: '17:00', description: 'Morning shift', role: 'Autista' },
  { id: 2, userId: 2, date: '2023-10-02', startTime: '14:00', endTime: '22:00', description: 'Evening shift', role: 'Medico' }
];

// Validation rules
const shiftValidationRules = [
  body('userId')
    .custom((v) => Number.isInteger(v) || (typeof v === 'string' && v.trim().length > 0))
    .withMessage('User ID must be an integer or a non-empty string (name)'),
  body('date').isISO8601().withMessage('Date must be in ISO format (YYYY-MM-DD)'),
  body('startTime').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Start time must be in HH:MM format'),
  body('endTime').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('End time must be in HH:MM format'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description must be less than 500 characters')
  ,
  body('role').optional().isString().isLength({ max: 100 }).withMessage('Role must be a string up to 100 characters')
];

// GET /shifts - List all shifts
router.get('/', authMiddleware, (req, res) => {
  res.json(shifts);
});

// GET /shifts/:id - Get shift by ID
router.get('/:id', authMiddleware, (req, res) => {
  const shift = shifts.find(s => s.id === parseInt(req.params.id));
  if (!shift) {
    return res.status(404).json({ message: 'Shift not found' });
  }
  res.json(shift);
});

// POST /shifts - Create new shift (admin only)
router.post('/', authMiddleware, roleMiddleware(['admin']), shiftValidationRules, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, date, startTime, endTime, description, role } = req.body;
  const newShift = {
    id: shifts.length + 1,
    userId,
    date,
    startTime,
    endTime,
    description,
    role
  };

  shifts.push(newShift);
  res.status(201).json(newShift);
});

// PUT /shifts/:id - Update shift (admin only)
router.put('/:id', authMiddleware, roleMiddleware(['admin']), shiftValidationRules, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const shift = shifts.find(s => s.id === parseInt(req.params.id));
  if (!shift) {
    return res.status(404).json({ message: 'Shift not found' });
  }

  const { userId, date, startTime, endTime, description, role } = req.body;
  shift.userId = userId;
  shift.date = date;
  shift.startTime = startTime;
  shift.endTime = endTime;
  shift.description = description;
  shift.role = role;

  res.json(shift);
});

// DELETE /shifts/:id - Delete shift (admin only)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  const shiftIndex = shifts.findIndex(s => s.id === parseInt(req.params.id));
  if (shiftIndex === -1) {
    return res.status(404).json({ message: 'Shift not found' });
  }

  shifts.splice(shiftIndex, 1);
  res.json({ message: 'Shift deleted successfully' });
});

module.exports = router;
