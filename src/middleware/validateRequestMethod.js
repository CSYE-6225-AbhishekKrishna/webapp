const logger = require('../log/cloudwatch-log');

// Middleware to check if the request uses a supported HTTP method (GET)
function validateRequestMethod(req, res, next) {
    const supportedMethods = ['GET', 'POST', 'PUT', 'DELETE'];
    res.setHeader('Cache-Control', 'no-cache');
    if (req.path == '/v1/assignments/')
    {
        if (!supportedMethods.includes(req.method) ) {
            logger.error("ERROR: PATCH request is not supported (HTTP Status: 405 METHOD NOT ALLOWED)");
            return res.status(405).send();
        }

    }
    if (req.path == '/healthz')
    {
        if(req.method != 'GET')
        {
            logger.error("ERROR: PATCH request is not supported (HTTP Status: 405 METHOD NOT ALLOWED)");
            return res.status(405).send();
        }
    }

    
    
    next();
}

module.exports = validateRequestMethod;