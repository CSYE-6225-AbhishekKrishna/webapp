const AssignmentService = require('../services/assignmentServices');
const logger = require('../log/cloudwatch-log');
const statsdClient = require("../log/statsd-metric");
const { Assignmentsubmission } = require('../config/database');

const AWS = require('aws-sdk');
// Configure the AWS region
AWS.config.update({ region: 'us-east-1' });

AWS.config.update({
  accessKeyId: 'AKIAZIBGF732UQ3EDMPB',
  secretAccessKey: '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',
  region: 'us-east-1'
});
const sns = new AWS.SNS();

// console.log('AWS Config:', AWS.config);

const env = require("dotenv").config();

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
console.log("deadline ->" + deadline)
    const newAssignment = await AssignmentService.createAssignment({
      name,
      points,
      num_of_attempts,
      deadline,
      user,
    });
    console.log("newAssignment.assignment_created in controller" + newAssignment.assignment_created)

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

async function submitAssignment(req, res){

  const assignmentId = req.params.id
  try {
    const authheader = req.headers.authorization;
    const auth = new Buffer.from(authheader.split(' ')[1],
    'base64').toString().split(':');
    const email = auth[0];
    const password = auth[1];
    console.log("email --->"+email);
    console.log("password --->"+password);

    console.log("assignmentId---->"+assignmentId)
    const assignment = await AssignmentService.getAssignmentById(assignmentId);
    console.log("num_of_attempts---->"+assignment.num_of_attempts);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    const currentDate = Date.now();
    const dueDate = assignment.deadline;
    console.log("currentDate  ->", new Date(currentDate));
    console.log("dueDate  ->", new Date(dueDate));
    
    if (currentDate > dueDate) {
      return res.status(400).json({ error: 'Submission deadline has passed' });
    }
    
    // Retrieve all submissions for the given assignment ID
    const submissions = await Assignmentsubmission.findAll({
      where: { assignment_id: assignmentId },
    });
    console.log("submissions.length---->"+submissions.length)

    if (submissions.length >= assignment.num_of_attempts) {
      return res.status(400).json({ error: 'Exceeded maximum number of attempts' });
    }

    const { submission_url } = req.body;

    const newSubmission = await AssignmentService.submitAssignment(assignmentId, submission_url)
    
    console.log("URL---------->"+newSubmission.submission_url)
 
    // // Publish to SNS after successful submission
    const sns = new AWS.SNS();
    const snsMessage = {
      Message: JSON.stringify({
        userEmail: email,
        githubRepo: submission_url,
        releaseTag: "webapp-v1",
      }),
      TopicArn: process.env.TOPIC_ARN,
    };

    await sns.publish(snsMessage).promise();

    // Publish the message to the SNS topic
    // const params = {
    //   Message: JSON.stringify(snsMessage),
    //   TopicArn: process.env.TOPIC_ARN,
    // };

    // sns.publish(params, (err, data) => {
    //   if (err) {
    //     logger.info(err)
    //     console.error('Error publishing message to SNS:', err);
    //   } else {
    //     logger.info(data)
    //     console.log('Message published successfully:', data);
    //   }
    // });

    res.status(201).json({
      id: newSubmission.id,
      assignment_id:newSubmission.assignment_id,
      submission_url:newSubmission.submission_url, 
      submission_date:newSubmission.submission_date,
      submission_updated:newSubmission.submission_updated,
    });
  }
  catch (error) {
    logger.info(error)
  console.error('Error submitting assignment:', error);
  }
  res.status(400).send();
}

module.exports = {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment
};
