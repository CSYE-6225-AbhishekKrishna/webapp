const AssignmentService = require('../services/assignmentServices');

async function getAllAssignments(req, res) {
  try {
    const assignments = await AssignmentService.getAllAssignments();
    res.status(200).json({ assignments });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(400).send();
  }
}

async function getAssignmentById(req, res) {
 

    const assignmentId = req.params.id;
  
    if (!assignmentId) {
      console.log('ERROR: Invalid or missing Assignment ID in the request.');
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
        return res.status(404).send();
      }
  
      res.status(200).json(responseObj);
    } catch (error) {
      console.log("in get('/:id' function");
      console.error('Error fetching assignment:', error);
      res.status(400).send();
    }
  }

async function createAssignment(req, res) {
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
    res.status(400).send();
  }
}

async function updateAssignment(req, res) {
    const assignmentId = req.params.id;
    const user_Id = req.user.id;
    try {
      const assignment = await AssignmentService.getAssignmentById(assignmentId);
  
      if (!assignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }
  
      if (assignment.user_id !== user_Id) {
        return res.status(403).send();
      }
  
      assignment.name = req.body.name;
      assignment.points = req.body.points;
      assignment.num_of_attempts = req.body.num_of_attempts;
      assignment.deadline = req.body.deadline;
      assignment.assignment_updated = new Date().toISOString();
  
      await AssignmentService.updateAssignment(assignment);
  
      res.status(204).send();
    } catch (error) {
      console.error('Error updating assignment:', error);
      res.status(400).send();
    }
  }

async function deleteAssignment(req, res) {
  const assignmentId = req.params.id;
  const user_Id = req.user.id;

  try {
    const assignment = await AssignmentService.getAssignmentById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    if (assignment.user_id !== user_Id) {
      return res.status(403).send();
    }

    await AssignmentService.deleteAssignment(assignment);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting assignment:', error);
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
