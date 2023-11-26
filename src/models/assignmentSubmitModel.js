const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Assignmentsubmission = sequelize.define('Assignmentsubmission', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    assignment_id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
    submission_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    submission_date: {
        type: DataTypes.DATE
      },
    submission_updated: {
        type: DataTypes.DATE
      },
    },  {
      tableName: 'AssignmentSubmission',
      timestamps: false,
      });
  
    return Assignmentsubmission;
  };