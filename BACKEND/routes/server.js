const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const authRoutes = require('./auth');
const protectedRoutes = require('./protected');
const userRoutes = require('./users');
const warehouseRoutes = require('./warehouse');
const reportRoutes = require('./reports');
const peopleRoutes = require('./people');
const fogliMarciaRoutes = require('./fogliMarcia');
const emailRoutes = require('./email');
const uploadRoutes = require('./uploads');
const vehiclesRoutes = require('./vehicles');
const { requestLogger } = require('../middleware/logging');
const { generalLimiter, authLimiter } = require('../middleware/rateLimit');
const { connectToDB, getDB } = require('../services/db');
const { verifyMailTransport } = require('../services/email');

const app = express();
const PORT = process.env.PORT || 5002;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;

// Middleware
app.use(requestLogger);
app.use(generalLimiter);
app.use(cors(FRONTEND_ORIGIN ? {
  origin: FRONTEND_ORIGIN,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: false,
} : {
  origin: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: false,
}));
app.use(express.json());

// Routes
app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/auth', authLimiter, authRoutes);
app.use('/protected', protectedRoutes);
app.use('/users', userRoutes);
app.use('/warehouse', warehouseRoutes);
app.use('/reports', reportRoutes);
app.use('/people', peopleRoutes);
app.use('/fogli-marcia', fogliMarciaRoutes);
app.use('/email', emailRoutes);
app.use('/uploads', uploadRoutes);
app.use('/vehicles', vehiclesRoutes);

// Start server only after DB connection
connectToDB()
  .then(async () => {
    app.locals.db = getDB();
    try {
      await verifyMailTransport();
    } catch (err) {
      console.error('SMTP verify failed:', err?.message || err);
    }
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
