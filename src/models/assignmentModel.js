const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Assignment = sequelize.define('Assignment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 100,
      },
    },
    num_of_attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 100,
      },
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    assignment_created: {
      type: DataTypes.DATE
    },
    assignment_updated: {
      type: DataTypes.DATE
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'Assignment',
    timestamps: false,
  });

  return Assignment;
};
