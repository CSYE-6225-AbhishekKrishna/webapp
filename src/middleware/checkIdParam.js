const isValidUUID  = require('./validateUUID');
const logger = require('../log/cloudwatch-log');

const checkIdParam = (req, res, next) => {
    const assignmentId = req.params.id;

    // Check if the 'id' parameter is missing or is not a valid UUID
    if (!assignmentId || !isValidUUID(assignmentId)) {
        console.log('IN checkIdParam() : ERROR: Invalid or missing Assignment ID in the request.');

        // Respond with a 400 Bad Request and an error message
        clogger.error("ERROR: AssignmentId incorrect(UUID format wrong) (HTTP Status: 400 BAD REQUEST)");
        return res.status(400).send();
    }

    // If the 'id' parameter is valid, continue to the next middleware or route handler
    next();
};

module.exports = checkIdParam;