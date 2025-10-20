const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
<<<<<<< HEAD
  if (req.method === 'OPTIONS') {
    return next();
  }
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.body && (req.body.accessToken || req.body.token)) {
    token = req.body.accessToken || req.body.token;
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

=======
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const token = authHeader.substring(7);
>>>>>>> d11cca6 (first commit)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
