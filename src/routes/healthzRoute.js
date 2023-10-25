const express = require('express');
const router = express.Router();
const { checkDatabaseConnection } = require('../config/database');

router.get('/', async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    if (await checkDatabaseConnection(req, res)) {
        console.log("------------------in healthz")
        res.status(200).send();
    } else {
        res.status(503).send();
    }
});

module.exports = router;
