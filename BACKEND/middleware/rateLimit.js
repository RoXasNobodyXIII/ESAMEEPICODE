const rateLimit = require('express-rate-limit');

<<<<<<< HEAD
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 100000, 
  max: 100, 
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
=======
// General rate limiter for all requests
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Stricter limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
>>>>>>> d11cca6 (first commit)
  message: {
    error: 'Too many login attempts from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

<<<<<<< HEAD
module.exports = { generalLimiter, authLimiter }; 


=======
module.exports = { generalLimiter, authLimiter };
>>>>>>> d11cca6 (first commit)
