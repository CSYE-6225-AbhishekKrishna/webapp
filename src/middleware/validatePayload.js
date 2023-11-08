const logger = require('../log/cloudwatch-log');

// Middleware to check for request payload
function validatePayload(req, res, next) {
    res.setHeader('Cache-Control', 'no-cache');
    if (req.path == '/healthz' && req.headers['content-length'] > 0) {
        logger.error("ERROR: Incorrect payload (HTTP Status: 400 BAD REQUEST)");
        return res.status(400).send();
    }
    next();
}

module.exports = validatePayload;
