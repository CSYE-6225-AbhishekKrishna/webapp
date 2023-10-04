const express = require('express');
const router = express.Router();
const { Assignment } = require('../config/database'); 
const { authentication } = require('../config/checkAuth');
const { validateAssignment, handleValidationErrors } = require('../middleware/assignmentValidation');
const isValidUUID  = require('../middleware/validateUUID');
const checkIdParam = require('../middleware/checkIdParam')

// '../middleware/validateUUID'}
var createdTimeDate = new Date().toISOString();
var updatedTimeDate = new Date().toISOString();

// Apply the authentication to the entire router
router.use(authentication);

// Implement get all method
router.get('/', async (req, res) => {
    const user_id = req.user.id;
    console.log(user_id);
    // console.log("Authenticated User OBJECT-------------> ", user);
    console.log("------------------in assignmentRoute.js GET")
    try {
        console.log("------------------in assignmentRoute.js TRY block")
      // Find all assignments from the database
      const attributesToInclude = ['id', 'name', 'points', 'num_of_attempts', 'deadline', 'assignment_created','assignment_updated'];

      // const assignment = await Assignment.findAll({ where: { user_id } });
      const assignment = await Assignment.findAll({
        attributes: attributesToInclude,
      });

  
      // Send the assignments as a response
      res.status(200).json({ assignment });
        // return res.status(200).send();
    } catch (error) {
      console.error('Error fetching assignments:', error);
      res.status(400).send();
    }
  });

  // Implement get method specefic to an id
  router.get('/:id', async (req, res) => {
    const assignmentId = req.params.id; // Get the assignment ID from the URL parameter
    // const user_Id = req.user.id; // Get the user ID from the authenticated user

    if (!assignmentId || !isValidUUID(assignmentId)) {
      // Respond with a 400 Bad Request and an error message
      console.log('ERROR: Invalid or missing Assignment ID in the request.');
      return res.status(400).send();
    }

    console.log(`Fetching assignment with ID: ${assignmentId}`);
    
    try {
        // Find the assignment by ID in the database for the specific user
        const attributesToInclude = ['id', 'name', 'points', 'num_of_attempts', 'deadline', 'assignment_created','assignment_updated'];
        const assignment = await Assignment.findOne({attributes: attributesToInclude,
            where: {
                id: assignmentId,
                // user_id: user_Id // Add the user_id filter
            }
        });
  
        if (!assignment) {
          console.log(`Assignment with ID: ${assignmentId} not found`);
          return res.status(404).send();
        }
  
        // Send the assignment as a response
        res.status(200).json({ assignment });
    } catch (error) {
      console.log("in get('/:id' function")
        console.error('Error fetching assignment:', error);
        res.status(400).send();
    }
});
// Implement post method to add Assignment to the database
  router.post('/', validateAssignment, handleValidationErrors, async (req, res) => {
    const user = req.user;
    console.log(user.id);
    console.log("------------------in assignmentRoute.js POST")
    try {
      console.log("------------------in assignmentRoute.js POST TRY block")
      console.log(req.body.name);
      // Extract assignment data from the request body
      const { name, points, num_of_attempts, deadline } = req.body;
      console.log("name -> " +name);
      console.log("points -> " +points);
      console.log("num_of_attempts -> " +num_of_attempts);
      console.log("deadline -> " +deadline);
  
      // Create a new assignment in the database
      const newAssignment = await Assignment.create({
        name,
        points,
        num_of_attempts,
        deadline,
        assignment_created:createdTimeDate,
        assignment_updated:updatedTimeDate,
        user_id:user.id,
      });
  
      res.status(201).json({
        id: newAssignment.id,
        name: newAssignment.name,
        points: newAssignment.points,
        num_of_attempts: newAssignment.num_of_attempts,
        deadline: newAssignment.deadline,
        assignment_created: newAssignment.assignment_created,
        assignment_updated: newAssignment.assignment_updated,
    });
    //   res.status(201).send();
    } catch (error) {
      console.error('Error creating assignment:', error);
      res.status(400).send();
    }
  });
// Implement put method to update Assignment to the database
  router.put('/:id', checkIdParam, validateAssignment, handleValidationErrors, async (req, res) => {
    console.log("IN PUT");
    const assignmentId = req.params.id; // Get the assignment ID from the URL parameter
    const user_Id = req.user.id; // Get the user ID from the authenticated user

    console.log(`Updating assignment with ID: ${assignmentId} for user with ID: ${user_Id}`);

    try {
        // Find the assignment by ID in the database for the specific user
        const assignment = await Assignment.findOne({
            where: {
                id: assignmentId,
                user_id: user_Id // Add the user_id filter
            }
        });
        // console.log("--------------------assignment.user_id ---> "+assignment.user_id )
        // console.log("--------------------user_Id ---> "+user_Id )

        // if (assignment.user_id !== user_Id) {
        //   return res.status(403).json({ error: 'Permission denied' });
        // }

        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }

        

        // Update the assignment properties based on the request body
        assignment.name = req.body.name;
        assignment.points = req.body.points;
        assignment.num_of_attempts = req.body.num_of_attempts;
        assignment.deadline = req.body.deadline;
        assignment.assignment_updated = new Date().toISOString(); // Update the assignment_updated field

        // Save the updated assignment
        await assignment.save();

        // Send the updated assignment as a response
        res.status(204).send();
    } catch (error) {
        console.error('Error updating assignment:', error);
        res.status(400).send();
    }
});

// Implement delete method to delete Assignment from the database
  router.delete('/:id',checkIdParam,  async (req, res) => {
    const assignmentId = req.params.id; // Get the assignment ID from the URL parameter
    const user_Id = req.user.id; // Get the user ID from the authenticated user

    // Check if the 'id' parameter is missing
    // if (!assignmentId || !isValidUUID(assignmentId)) {
    //   // Respond with a 400 Bad Request and an error message
    //   console.log('ERROR: Invalid or missing Assignment ID in the request.');
    //   return res.status(400).send();
    // }

    console.log(`Deleting assignment with ID: ${assignmentId} for user with ID: ${user_Id}`);
    
    try {
        // Find the assignment by ID in the database for the specific user
        const assignment = await Assignment.findOne({
            where: {
                id: assignmentId,
                user_id: user_Id // Add the user_id filter
            }
        });

        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }

        // Delete the assignment
        await assignment.destroy();

        // Send a success response
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting assignment:', error);
        res.status(400).send();
    }
});

router.put('/', async (req, res) => {console.log('PUT NEED ID');res.status(400).send();});
router.delete('/', async (req, res) => {console.log('DELETE NEED ID');res.status(400).send();});


module.exports = router;