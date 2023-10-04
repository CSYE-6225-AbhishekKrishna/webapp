const express = require('express');
const router = express.Router();
const { authentication } = require('../config/checkAuth');

router.get('/', (req, res, next) => {
    
    authentication(req, res, (err) => {
        if (err) {
            // Handle authentication error here
            console.log(err.message);
            return res.status(err.status).send();
        }
        // This code will only execute if authentication is successful
        res.send('You are authenticated!');
    });
});
module.exports = router;