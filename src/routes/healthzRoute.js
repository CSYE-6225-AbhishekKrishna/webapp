const express = require('express');
const router = express.Router();
const { checkDatabaseConnection } = require('../config/database');
const logger = require('../log/cloudwatch-log');
const statsdClient = require("../log/statsd-metric");

router.get('/', async (req, res) => {
    statsdClient.increment("healthz.count");
    res.setHeader('Cache-Control', 'no-cache');
    if (await checkDatabaseConnection(req, res)) {
        logger.info("INFO: User successfully logged in. (HTTP Status: 200 OK)")
        console.log("------------------in healthz")
        res.status(200).send();
    } else {
        logger.error("ERROR: Service is not supported (HTTP Status: 503 SERVICE UNAVAILABLE)");
        res.status(503).send();
    }
});

module.exports = router;
