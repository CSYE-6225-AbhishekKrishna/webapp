// Middleware to check if the request uses a supported HTTP method (GET)
function validateRequestMethod(req, res, next) {
    const supportedMethods = ['GET', 'POST', 'PUT', 'DELETE'];
    res.setHeader('Cache-Control', 'no-cache');
    if (!supportedMethods.includes(req.method)) {
        return res.status(405).send();
    }
    next();
}

module.exports = validateRequestMethod;