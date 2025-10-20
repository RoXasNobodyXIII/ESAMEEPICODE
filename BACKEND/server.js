const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const userRoutes = require('./routes/users');
const warehouseRoutes = require('./routes/warehouse');
const shiftRoutes = require('./routes/shifts');
const reportRoutes = require('./routes/reports');
const peopleRoutes = require('./routes/people');
const fogliMarciaRoutes = require('./routes/fogliMarcia');
const emailRoutes = require('./routes/email');
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
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authLimiter, authRoutes);
app.use('/protected', protectedRoutes);
app.use('/users', userRoutes);
app.use('/warehouse', warehouseRoutes);
app.use('/shifts', shiftRoutes);
app.use('/reports', reportRoutes);
app.use('/people', peopleRoutes);
app.use('/fogli-marcia', fogliMarciaRoutes);
app.use('/email', emailRoutes);

// Start server only after DB connection
connectToDB()
  .then(() => {
    app.locals.db = getDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
