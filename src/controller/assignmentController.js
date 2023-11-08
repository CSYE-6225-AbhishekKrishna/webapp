const AssignmentService = require('../services/assignmentServices');
const logger = require('../log/cloudwatch-log');
const statsdClient = require("../log/statsd-metric");

async function getAllAssignments(req, res) {
  statsdClient.increment("getAllAssignments.count");
  try {
    const assignments = await AssignmentService.getAllAssignments();
    logger.info("INFO: Fetched all assignments (HTTP Status: 200 OK)");
    res.status(200).json({ assignments });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    logger.error("ERROR: Failed to fetch all assignments (HTTP Status: 400 BAD REQUEST)");
    res.status(400).send();
  }
}

async function getAssignmentById(req, res) {
 
    statsdClient.increment("getAssignmentById.count");
    const assignmentId = req.params.id;
  
    if (!assignmentId) {
      console.log('ERROR: Invalid or missing Assignment ID in the request.');
      logger.error("ERROR: Invalid or missing Assignment ID in the request.(HTTP Status: 400 BAD REQUEST)");
      return res.status(400).send();
    }
  
    console.log(`Fetching assignment with ID: ${assignmentId}`);
  
    try {
      const assignment = await AssignmentService.getAssignmentById(assignmentId);
      const responseObj =  {
        id : assignment.id,
        name : assignment.name,
        points : assignment.points,
        num_of_attempts : assignment.num_of_attempts,
        deadline : assignment.deadline,
        assignment_created : assignment.assignment_created,
        assignment_updated : assignment.assignment_updated,
      } 

   
      if (!assignment) {
        console.log(`Assignment with ID: ${assignmentId} not found`);
        logger.error(`ERROR: Invalid or missing Assignment ID: ${assignmentId} in the request.(HTTP Status: 400 BAD REQUEST)`);

        return res.status(404).send();
      }
      logger.info(`INFO: Fetched assignment with with ID: ${assignmentId} (HTTP Status: 200 OK)`);
      res.status(200).json(responseObj);
    } catch (error) {
      console.log("in get('/:id' function");
      console.error('Error fetching assignment:', error);
      logger.error(`ERROR: Error Fetching assignment with with ID: ${assignmentId} (HTTP Status: 200 OK)`);
      res.status(400).send();
    }
  }

async function createAssignment(req, res) {
  statsdClient.increment("createAssignment.count");
  const user = req.user;

  try {
    const { name, points, num_of_attempts, deadline } = req.body;

    const newAssignment = await AssignmentService.createAssignment({
      name,
      points,
      num_of_attempts,
      deadline,
      user,
    });
    logger.info("INFO: Created assignment (HTTP Status: 201 CREATED)");
    res.status(201).json({
      id: newAssignment.id,
      name: newAssignment.name,
      points: newAssignment.points,
      num_of_attempts: newAssignment.num_of_attempts,
      deadline: newAssignment.deadline,
      assignment_created: newAssignment.assignment_created,
      assignment_updated: newAssignment.assignment_updated,
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    logger.error("ERROR: Failed to create assignment (HTTP Status: 400 BAD REQUEST)");
    res.status(400).send();
  }
}

async function updateAssignment(req, res) {
    statsdClient.increment("updateAssignment.count");
    const assignmentId = req.params.id;
    const user_Id = req.user.id;
    try {
      const assignment = await AssignmentService.getAssignmentById(assignmentId);
  
      if (!assignment) {
        logger.error("ERROR: Assignment not found (HTTP Status: 404 NOT FOUND)");
        return res.status(404).json({ error: 'Assignment not found' });
      }
  
      if (assignment.user_id !== user_Id) {
        logger.error("ERROR: User Forbidden access (HTTP Status: 403 FORBIDDEN)");
        return res.status(403).send();
      }
  
      assignment.name = req.body.name;
      assignment.points = req.body.points;
      assignment.num_of_attempts = req.body.num_of_attempts;
      assignment.deadline = req.body.deadline;
      assignment.assignment_updated = new Date().toISOString();
  
      await AssignmentService.updateAssignment(assignment);
      logger.info(`INFO: Updated assignment ID ${assignmentId} (HTTP Status: 204 NO CONTENT)`);
      res.status(204).send();
    } catch (error) {
      console.error('Error updating assignment:', error);
      logger.error("ERROR: Failed to update assignment (HTTP Status: 400 BAD REQUEST)");
      res.status(400).send();
    }
  }

async function deleteAssignment(req, res) {
  statsdClient.increment("deleteAssignment.count");
  const assignmentId = req.params.id;
  const user_Id = req.user.id;

  try {
    const assignment = await AssignmentService.getAssignmentById(assignmentId);

    if (!assignment) {
      logger.error("ERROR: Assignment not found (HTTP Status: 404 NOT FOUND)");
      return res.status(404).json({ error: 'Assignment not found' });
    }

    if (assignment.user_id !== user_Id) {
      logger.error("ERROR: User Forbidden access (HTTP Status: 403 FORBIDDEN)");
      return res.status(403).send();
    }

    await AssignmentService.deleteAssignment(assignment);
    logger.info(`INFO: Deleted assignment ID ${assignmentId}(HTTP Status: 204 NO CONTENT)`);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting assignment:', error);
    logger.error("ERROR: Failed to delete assignment (HTTP Status: 400 BAD REQUEST)");
    res.status(400).send();
  }
}  

module.exports = {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
};
