const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const userRoutes = require('./routes/users');
const warehouseRoutes = require('./routes/warehouse');
const shiftRoutes = require('./routes/shifts');
const reportRoutes = require('./routes/reports');
const peopleRoutes = require('./routes/people');
const fogliMarciaRoutes = require('./routes/fogliMarcia');
const emailRoutes = require('./routes/email');
const vehiclesRoutes = require('./routes/vehicles');
const uploadsRoutes = require('./routes/uploads');
const eventsRoutes = require('./routes/events');
const { requestLogger } = require('./middleware/logging');
const { generalLimiter, authLimiter } = require('./middleware/rateLimit');
const securityHeaders = require('./middleware/sanitization');
const { connectToDB, getDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(securityHeaders);
app.use(requestLogger);
app.use(generalLimiter);
app.use(cors({ origin: ['https://crocedorosudpontino.onrender.com/'] }));
app.use(express.json());


app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);
app.use('/users', userRoutes);
app.use('/warehouse', warehouseRoutes);
app.use('/shifts', shiftRoutes);
app.use('/reports', reportRoutes);
app.use('/people', peopleRoutes);
app.use('/fogli-marcia', fogliMarciaRoutes);
app.use('/email', emailRoutes);
app.use('/vehicles', vehiclesRoutes);
app.use('/uploads', uploadsRoutes);
app.use('/events', eventsRoutes);

// Basic root and health endpoints (useful for Render health checks)
app.get('/', (req, res) => {
  res.status(200).json({ ok: true, name: 'Croce d\'Oro API', version: process.env.RENDER_GIT_COMMIT || 'local' });
});
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server only after DB connection
connectToDB()
  .then(async () => {
    app.locals.db = getDB();
    try {
      const usersCol = app.locals.db.collection('users');
      const count = await usersCol.countDocuments();
      if (count === 0) {
        const username = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
        const email = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
        const plain = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
        const hashed = await bcrypt.hash(plain, 10);
        const existingMax = await usersCol
          .find({}, { projection: { id: 1 } })
          .sort({ id: -1 })
          .limit(1)
          .toArray();
        const nextId = existingMax.length ? (Number(existingMax[0].id) || 0) + 1 : 1;
        await usersCol.insertOne({
          id: nextId,
          username,
          password: hashed,
          email,
          role: 'admin',
          suspended: false
        });
        console.log('Seeded default admin user');
      }
    } catch (e) {}
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });

