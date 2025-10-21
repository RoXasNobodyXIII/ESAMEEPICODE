const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendMail } = require('../services/email');
const router = express.Router();

if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  throw new Error('Missing JWT secrets. Set JWT_SECRET and JWT_REFRESH_SECRET in environment');
}
const ACCESS_TTL = process.env.JWT_ACCESS_TTL || '60m';
const REFRESH_TTL = process.env.JWT_REFRESH_TTL || '14d';
const APP_PUBLIC_URL = process.env.APP_PUBLIC_URL || process.env.FRONTEND_URL || '';

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const uname = typeof username === 'string' ? username.trim() : '';
  const pword = typeof password === 'string' ? password.trim() : '';

  try {
    const db = req.app.locals.db;
    const usersCol = db.collection('users');
    
    let user = await usersCol.findOne({ username: uname });
    if (!user && uname) {
      const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const anchored = `^${escapeRegex(uname)}$`;
      user = await usersCol.findOne({ username: { $regex: anchored, $options: 'i' } });
      if (!user && uname.includes('@')) {
        user = await usersCol.findOne({ email: { $regex: anchored, $options: 'i' } });
      }
    }
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.suspended === true) {
      return res.status(403).json({ message: 'Account sospeso. Contatta un amministratore.' });
    }

    
    let isValidPassword = false;
    if (typeof user.password === 'string' && user.password.startsWith('$2')) {
      isValidPassword = await bcrypt.compare(pword, user.password);
    } else {
      isValidPassword = pword === user.password;
      if (isValidPassword) {
        try {
          const newHash = await bcrypt.hash(pword, 10);
          await usersCol.updateOne({ id: user.id }, { $set: { password: newHash } });
          user.password = newHash;
        } catch (_) {}
      }
    }
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TTL }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TTL }
    );

    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Refresh token
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const db = req.app.locals.db;
    db.collection('users').findOne({ id: decoded.id }).then(user => {
      if (!user) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }

      const newAccessToken = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: ACCESS_TTL }
      );

      res.json({ accessToken: newAccessToken });
    }).catch(() => res.status(401).json({ message: 'Invalid refresh token' }));
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

module.exports = router;

// Forgot password
router.post('/forgot', async (req, res) => {
  try {
    const { email, username } = req.body || {};
    const db = req.app.locals.db;
    const users = db.collection('users');
    const query = email ? { email } : (username ? { username } : null);
    if (!query) return res.status(400).json({ message: 'Email o username richiesti' });
    const user = await users.findOne(query);
    if (!user) return res.json({ ok: true });

    const token = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    const exp = new Date(Date.now() + 1000 * 60 * 60);

    await users.updateOne({ id: user.id }, { $set: { resetTokenHash: hash, resetTokenExp: exp } });

    const base = (APP_PUBLIC_URL || '').replace(/\/$/, '');
    const link = `${base}/reset-password?token=${encodeURIComponent(token)}&u=${encodeURIComponent(String(user.id))}`;

    try {
      await sendMail({
        to: user.email,
        subject: 'Reimposta la tua password',
        text: `Per reimpostare la password, apri questo link entro 1 ora: ${link}`,
        html: `<p>Per reimpostare la password, clicca qui entro 1 ora:</p><p><a href="${link}" target="_blank" rel="noopener">Reimposta password</a></p>`
      });
    } catch (_) {}

    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ message: 'Errore richiesta reset' });
  }
});

// Reset password
router.post('/reset', async (req, res) => {
  try {
    const { token, password } = req.body || {};
    if (!token || !password || String(password).length < 6) {
      return res.status(400).json({ message: 'Token o password non validi' });
    }
    const db = req.app.locals.db;
    const users = db.collection('users');
    const hash = crypto.createHash('sha256').update(String(token)).digest('hex');
    const now = new Date();
    const user = await users.findOne({ resetTokenHash: hash, resetTokenExp: { $gt: now } });
    if (!user) return res.status(400).json({ message: 'Token non valido o scaduto' });

    const hashed = await bcrypt.hash(String(password), 10);
    await users.updateOne(
      { id: user.id },
      { $set: { password: hashed }, $unset: { resetTokenHash: '', resetTokenExp: '' } }
    );

    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ message: 'Errore reset password' });
  }
});
