const logger = require('../log/cloudwatch-log');
// Middleware to check for request parameters
function checkRequestParameters(req, res, next) {
    res.setHeader('Cache-Control', 'no-cache');
    // Check if the request path is not /healthz
    console.log(req.path);
    // if (req.path !== '/healthz'
    // //  && req.path !== '/v1/assignments/'
    //  ) {
    //     console.log('PATH REJECT');
    //     return res.status(404).send();
    // }

    // Check if the request query parameters object is not empty
    if (Object.keys(req.query).length > 0) {
        logger.error("ERROR: Parameter not supported (HTTP Status: 400 BAD REQUEST)");
        return res.status(400).send();
    }
    next();
}

module.exports = checkRequestParameters;
