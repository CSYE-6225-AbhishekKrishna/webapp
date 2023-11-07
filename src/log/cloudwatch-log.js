const winston = require('winston');
const path = require("path");

// Create a Winston logger instance
const logger = winston.createLogger({
  level: 'info', 
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() 
  ),
  transports: [
    new winston.transports.File({ filename: path.join(__dirname, '../../logs/info-log-csye6225.log') }), // Log to a file
    new winston.transports.Console()
  ],
});

module.exports = logger;

filename: path.join(__dirname, "../../logs/info.log")