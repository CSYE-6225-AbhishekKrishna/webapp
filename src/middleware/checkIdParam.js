const isValidUUID  = require('./validateUUID');
const logger = require('../log/cloudwatch-log');

const checkIdParam = (req, res, next) => {
    const assignmentId = req.params.id;

    // Check if the 'id' parameter is missing or is not a valid UUID
    if (!assignmentId || !isValidUUID(assignmentId)) {
        console.log('IN checkIdParam() : ERROR: Invalid or missing Assignment ID in the request.');

        // Respond with a 400 Bad Request and an error message
        logger.error("ERROR: AssignmentId Not found : incorrect(UUID format wrong) (HTTP Status: 404 NOT FOUND)");
        return res.status(404).send();
    }

    // If the 'id' parameter is valid, continue to the next middleware or route handler
    next();
};

module.exports = checkIdParam;