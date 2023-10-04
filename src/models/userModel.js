const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Account = sequelize.define('Account', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      account_created: {
        type: DataTypes.DATE
      },
      account_updated: {
        type: DataTypes.DATE
      },
    }, {
      tableName: 'Account',
      timestamps: false,
    });

  return Account;
};
