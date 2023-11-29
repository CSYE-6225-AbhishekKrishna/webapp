const { Assignment, Assignmentsubmission } = require('../config/database'); // Import your Assignment model here

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
console.log("In - getAssignmentById");
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
  console.log("createdTimeDate in service :"+createdTimeDate)
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

async function submitAssignment(assignment_id, submission_url, user) {
  const submission_date = new Date();
  const submission_updated = new Date();
  const newSubmission = await Assignmentsubmission.create({
    assignment_id,
    submission_url,
    submission_date,
    submission_updated,
    user_id: user.id,
  })

  console.log("URL---------->"+newSubmission.submission_url)
  return newSubmission;
}

module.exports = {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment
};
