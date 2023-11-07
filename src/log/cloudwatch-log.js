const winston = require('winston');

// Create a Winston logger instance
const logger = winston.createLogger({
  level: 'info', 
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() 
  ),
  transports: [
    new winston.transports.File({ filename: '/home/admin/webapp/logs/info-log-csye6225.log' }), // Log to a file
    new winston.transports.Console()
  ],
});

module.exports = logger;