const fs = require('fs');
const path = require('path');

// Ensure log directory exists
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Create log file stream
const logStream = fs.createWriteStream(
  path.join(logDir, `server-${new Date().toISOString().split('T')[0]}.log`),
  { flags: 'a' }
);

/**
 * Request logger middleware
 */
const logger = (req, res, next) => {
  const start = Date.now();
  
  // Once the response is finished, log the request
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress
    };
    
    // Log to console
    console.log(`${log.timestamp} ${log.method} ${log.url} ${log.status} - ${log.duration}`);
    
    // Log to file
    logStream.write(JSON.stringify(log) + '\n');
  });
  
  next();
};

module.exports = logger; 