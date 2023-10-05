// Middleware to check if the request uses a supported HTTP method (GET)
function validateRequestMethod(req, res, next) {
    const supportedMethods = ['GET', 'POST', 'PUT', 'DELETE'];
    res.setHeader('Cache-Control', 'no-cache');
    if (req.path == '/v1/assignments/')
    {
        if (!supportedMethods.includes(req.method) ) {
            return res.status(405).send();
        }

    }
    if (req.path == '/healthz')
    {
        if(req.method != 'GET')
        {
            return res.status(405).send();
        }
    }

    
    
    next();
}

module.exports = validateRequestMethod;