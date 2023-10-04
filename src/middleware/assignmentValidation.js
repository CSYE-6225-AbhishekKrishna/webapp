const { body, validationResult } = require('express-validator');

// Middleware for request body validation
const validateAssignment = [
    body('name').notEmpty().isString(),
    body('points').notEmpty().isInt({ min: 1, max: 100 }),
    body('num_of_attempts').notEmpty().isInt({ min: 1, max: 100 }),
    body('deadline').notEmpty().isISO8601(),
];

// Custom error handler middleware for validation errors
const handleValidationErrors = (req, res, next) => {
    console.log('----------------handleValidationErrors-------------------');
    const { name, points, num_of_attempts, deadline } = req.body;
    console.log(name);
    console.log(points);
    console.log(num_of_attempts);
    console.log(deadline);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("errors in JSON ");
        return res.status(400).send();
    }
    next();
};

module.exports = {
    validateAssignment,
    handleValidationErrors,
};
