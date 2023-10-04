// Middleware to check for request parameters
function checkRequestParameters(req, res, next) {
    res.setHeader('Cache-Control', 'no-cache');
    // Check if the request path is not /healthz
    // if (req.path !== '/healthz' && req.path !== '/authenticate' && req.path !== '/assignments') {
    //     console.log('PATH REJECT');
    //     return res.status(404).send();
    // }
    /*if (req.path === '/v1/assignments') {
       
    }*/

    // Check if the request query parameters object is not empty
    if (Object.keys(req.query).length > 0) {
        return res.status(400).send();
    }
    next();
}

module.exports = checkRequestParameters;
