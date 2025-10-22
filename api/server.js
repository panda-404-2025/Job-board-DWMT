require('dotenv').config();

const express = require('express');
const cors = require('cors');

const auth = require("./app/middlewares/auth.middleware");

const app = express();
app.use(cors());
app.use(express.json());

const port =  3000;

const connectDB = require('./app/connectDB');


console.log({path:__dirname})


app.use('/',require('./app/routes/login.routes'));
app.use('/users',require('./app/routes/user.routes'));
app.use('/companies',require('./app/routes/companies.routes'));
app.use('/ads',require('./app/routes/ads.routes'));
app.use('/job_applications',require('./app/routes/job_applications.routes'));

app.listen(port, () => {
    console.log('Server started on port ' + port);
})