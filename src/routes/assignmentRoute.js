const express = require('express');
const router = express.Router();
const { authentication } = require('../config/checkAuth');
const { validateAssignment, handleValidationErrors } = require('../middleware/assignmentValidation');
const isValidUUID  = require('../middleware/validateUUID');
const checkIdParam = require('../middleware/checkIdParam')
const assignmentController = require('../controller/assignmentController');
const logger = require('../log/cloudwatch-log');
const statsdClient = require("../log/statsd-metric");


// Apply the authentication to the entire router
router.use(authentication);

router.get('/', assignmentController.getAllAssignments);
router.get('/:id', assignmentController.getAssignmentById);
router.post('/', validateAssignment, handleValidationErrors, assignmentController.createAssignment);
router.put('/:id', checkIdParam, validateAssignment, handleValidationErrors, assignmentController.updateAssignment);
router.delete('/:id', checkIdParam, assignmentController.deleteAssignment);

router.post('/:id/submission',assignmentController.submitAssignment);

// Handling 400 Bad Request
router.delete('/', async (req, res) => {
    logger.error("ERROR: Delete request need ID (HTTP Status: 400 BAD REQUEST)");
    console.log('DELETE NEED ID');res.status(400).send();});
router.put('/', async (req, res) => {
    logger.error("ERROR: Update request need ID (HTTP Status: 400 BAD REQUEST)");
    console.log('PUT NEED ID');res.status(400).send();});
// Handling 405 bas Method Not Found
router.patch('/', async (req, res) => {
    logger.error("ERROR: PATCH request is not supported (HTTP Status: 405 METHOD NOT ALLOWED)");
    console.log('PATCH IS NOT SUPPORTED');res.status(405).send();});
router.patch('/:id', async (req, res) => {
    logger.error("ERROR: PATCH request is not supported (HTTP Status: 405 METHOD NOT ALLOWED)");
    console.log('PATCH IS NOT SUPPORTED');res.status(405).send();});

module.exports = router;