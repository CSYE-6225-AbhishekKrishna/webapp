const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const csv = require('csv-parser');
const bcrypt = require('bcrypt');

require("dotenv").config();

// const sequelize = new Sequelize({
//     dialect: process.env.DB_DIALECT,
//     host: process.env.DB_HOST,
//     database: process.env.DB_DATABASE,
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PGPORT,
//     logging: (query) => {
//         console.log(query); // Log the query to the console
//       },
//     dialectOptions: {
//         ssl: {
//             require: true,
//             rejectUnauthorized: false,
//         },
//     }
// });

const sequelizeOptions = {
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PGPORT,
  logging: (query) => {
      console.log(query); // Log the query to the console
  },
};
let sequelize;

if (process.env.DB_HOST === 'localhost' || process.env.DB_HOST === '127.0.0.1') {
  sequelize = new Sequelize(sequelizeOptions);
} else {
  sequelize = new Sequelize({
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PGPORT,
    logging: (query) => {
        console.log(query); // Log the query to the console
    },
      dialectOptions: {
          ssl: {
              require: true,
              rejectUnauthorized: false,
          },
      },
  });
}

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
    // console.log("in synchronizeDatabase()");
    // const databaseExists = await checkDatabaseExists();

    // if (!databaseExists) {
    //   console.log("in synchronizeDatabase() - !databaseExists");
    //   // Create the database if it doesn't exist
    //   await createDatabase();
    // }
    await sequelize.sync();

    console.log('Database synchronized');
    const csvFilePath = 'users.csv' || '/opt/users.csv'; 
    fs.createReadStream(csvFilePath).pipe(csv()).on('data', async (row) => {
        try {

          // Check if a user with the same email already exists
              const existingUser = await Account.findOne({ where: { email: row.email } });

              if (!existingUser) {
                // Hash the password using bcrypt before saving it
                const hashedPassword = await bcrypt.hash(row.password, 10);
                // Create a new user if one doesn't exist
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

/*async function checkDatabaseExists() {

  console.log("in checkDatabaseExists()");
  const databaseName = process.env.DB_DATABASE;

  try {
    const query = `SELECT datname FROM pg_database WHERE datname = '${databaseName}'`;
    const result = await sequelize.query(query, { raw: true });
    return result[0].length > 0;
  } catch (error) {
    console.error('Error checking if the database exists:', error);
    console.log("in checkDatabaseExists() return false in catch block");
    return false;
  }
}

async function createDatabase() {
  console.log("in createDatabase()");
  const databaseName = process.env.DB_DATABASE;

  try {
    console.log("in createDatabase() TRY:");
    const query = `CREATE DATABASE ${databaseName}`;
    await sequelize.query(query);
    console.log(`Database '${databaseName}' created.`);
  } catch (error) {
    console.log("in createDatabase() CATCH:");
    console.error('Error creating the database:', error);
  }
}*/

module.exports = {
    Assignment,
    sequelize,
    checkDatabaseConnection, 
    synchronizeDatabase,
};