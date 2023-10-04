const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const csv = require('csv-parser');
const bcrypt = require('bcrypt');

require("dotenv").config();

const sequelize = new Sequelize({
    dialect: process.env.DIALECT,
    host: process.env.HOST,
    database: process.env.DATABASE,
    username: process.env.USER,
    password: process.env.PASSWORD,
    port: process.env.PGPORT,
    logging: (query) => {
        console.log(query); // Log the query to the console
      }
});

async function checkDatabaseConnection() {
    let isDatabaseConnected = false;
    try {
        await sequelize.authenticate();
        isDatabaseConnected = true;
    } catch (error) {
        isDatabaseConnected = false;
        console.error('Database connection error:', error);
    }
    return isDatabaseConnected;
}
const Account = require('../models/userModel')(sequelize);
const Assignment = require('../models/assignmentModel')(sequelize);
  
  var createdTimeDate = new Date().toISOString();
  var updatedTimeDate = new Date().toISOString();

  
async function synchronizeDatabase() {
  try{
    await sequelize.sync();

    console.log('Database synchronized');
    const csvFilePath = 'users.csv' ||'/opt/users.csv'; 
    fs.createReadStream(csvFilePath).pipe(csv()).on('data', async (row) => {
        try {

          // Check if a user with the same email already exists
              const existingUser = await Account.findOne({ where: { email: row.email } });
              // console.log("existingUser -->"+existingUser);
              if (!existingUser) {
                  /* console.log("first_name -->"+row.first_name);
                  console.log("last_name -->"+row.last_name);
                  console.log("email -->"+row.email);
                  console.log("password -->"+row.password);*/
              // Hash the password using bcrypt before saving it
              const hashedPassword = await bcrypt.hash(row.password, 10);
              // Create a new user if one doesn't exist
              //   console.log("---------------existingUser--------------");
              await Account.create({
                  first_name: row.first_name,
                  last_name: row.last_name,
                  email: row.email,
                  password: hashedPassword,
                  account_created: createdTimeDate,
                  account_updated: updatedTimeDate
              });
              }
          else{
              console.log("User already exists")
          }
        } catch (error) {
          console.error('Error creating user:', error);
        }
      })
      .on('end', () => {
        console.log('CSV file processed.');
      });
}catch(error) {
    console.error('Error synchronizing database:', error);
  }

}

module.exports = {
    Assignment,
    sequelize,
    checkDatabaseConnection, 
    synchronizeDatabase,
};