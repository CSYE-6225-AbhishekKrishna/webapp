const createAccountModel = require('../models/userModel');
const { sequelize } = require('./database');
const bcrypt = require('bcrypt');

async function authentication(req, res, next) {
    console.log("in authentication")
    const authheader = req.headers.authorization;
    console.log("req.headers ---->"+req.headers);
 
    if (!authheader) {
        let err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err)
    }
 
    const auth = new Buffer.from(authheader.split(' ')[1],
        'base64').toString().split(':');
    const email = auth[0];
    const password = auth[1];
    console.log("email --->"+email);
    console.log("password --->"+password);
 
    try {

        const Account = createAccountModel(sequelize);
        // Check if a user with the same email exists in the Account table
        const existingUser = await Account.findOne({ where: { email } });

        if (!existingUser) {
            console.log("The "+email+ " DOSNT exist")
            // User with the entered email does not exist
            let err = new Error('User not found');
            err.status = 401;
            // return next(err);
            return res.status(401).send();
        }
        console.log("requested user first name  ->  " +existingUser.first_name);
        console.log("requested user last name  ->  " +existingUser.last_name);
        console.log("requested user id  ->  " +existingUser.id);

        // Compare the entered password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, existingUser.password);

        if (passwordMatch) {
            // Passwords match, proceed with authentication
            console.log("Password matched for -->>"+email)
            req.user = existingUser; // Store the user object in the request
            next();
        } else {
            // Passwords do not match
            // let err = new Error('Authentication failed');
            // err.status = 401;
            // return next(err);
            console.log("Password DONT matched for -->>"+email)
            return res.status(401).send();
        }
    } catch (error) {
        console.error('Authentication error:', error);
        let err = new Error('Authentication error');
        err.status = 400;
        return next(err);
    }
 
}

module.exports = {authentication};