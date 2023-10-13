const { Assignment } = require('../config/database'); // Import your Assignment model here

async function getAllAssignments() {
  const attributesToInclude = [
    'id',
    'name',
    'points',
    'num_of_attempts',
    'deadline',
    'assignment_created',
    'assignment_updated',
  ];

  const assignments = await Assignment.findAll({
    attributes: attributesToInclude,
  });

  return assignments;
}

async function getAssignmentById(assignmentId) {

    const assignment = await Assignment.findOne({
      where: {
        id: assignmentId,
      },
    });

    return assignment;
  }

async function createAssignment({ name, points, num_of_attempts, deadline, user }) {
  const createdTimeDate = new Date();
  const updatedTimeDate = new Date();

  const newAssignment = await Assignment.create({
    name,
    points,
    num_of_attempts,
    deadline,
    assignment_created: createdTimeDate,
    assignment_updated: updatedTimeDate,
    user_id: user.id,
  });

  return newAssignment;
}

async function updateAssignment(assignment) {
    await assignment.save();
  }

async function deleteAssignment(assignment) {
  await assignment.destroy();
}

module.exports = {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
};
