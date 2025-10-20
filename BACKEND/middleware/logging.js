const winston = require('winston');

<<<<<<< HEAD
// logger instance
=======
// Create a logger instance
>>>>>>> d11cca6 (first commit)
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'backend-service' },
  transports: [
<<<<<<< HEAD

    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  
=======
    // Write all logs with importance level of `error` or less to `error.log`
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // Write all logs with importance level of `info` or less to `combined.log`
>>>>>>> d11cca6 (first commit)
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

<<<<<<< HEAD

=======
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
>>>>>>> d11cca6 (first commit)
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Middleware function to log requests
const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  });

  next();
};

module.exports = { logger, requestLogger };
