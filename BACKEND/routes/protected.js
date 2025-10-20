const express = require('express');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const router = express.Router();

<<<<<<< HEAD

=======
// Protected route for any authenticated user
>>>>>>> d11cca6 (first commit)
router.get('/user', authMiddleware, (req, res) => {
  res.json({ message: 'Welcome to the protected area!', user: req.user });
});

<<<<<<< HEAD
// admin only
=======
// Protected route for admin only
>>>>>>> d11cca6 (first commit)
router.get('/admin', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  res.json({ message: 'Admin area', user: req.user });
});

<<<<<<< HEAD
// users
=======
// Protected route for volontario or admin
>>>>>>> d11cca6 (first commit)
router.get('/volontario', authMiddleware, roleMiddleware(['volontario', 'admin']), (req, res) => {
  res.json({ message: 'Volontario area', user: req.user });
});

module.exports = router;
