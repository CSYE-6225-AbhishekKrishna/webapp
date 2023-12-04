const express = require('express');
const app = express();
const bodyParser = require('body-parser'); 

// const sequelize = require('./config/database');
// const { synchronizeDatabase } = require('./config/database');
const validateRequestMethod = require('./middleware/validateRequestMethod');
const validatePayload = require('./middleware/validatePayload');
const checkRequestParameters = require('./middleware/checkRequestParameters');
const healthzRouter = require('./routes/healthzRoute');
const authenticateRouter = require('./routes/authRoute');
const assignmentRoute = require('./routes/assignmentRoute');

require("dotenv").config();

// Use the middlewares
app.use(validateRequestMethod, checkRequestParameters, validatePayload);

// Mount the healthz router
app.use('/healthz', healthzRouter);
// Mount the authenticate router
app.use('/authenticate', authenticateRouter);

app.use(bodyParser.json());
// Mount the assignmentRouter
app.use('/v2/assignments', assignmentRoute);

app.use('/', (req, res, next) => {
  if(req.path === '/')
  {
    res.status(200).send(); // Sending 'OK' with a 200 status code
  }
  else{
    next();
  }
});

app.use('/*',(req, res) => {
  res.set('Cache-Control', 'no-cache');
  res.status(404).end();
});

module.exports = app;


