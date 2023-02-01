import 'dotenv/config'; // library for variable environment 
import express from 'express';
import connection from 'mongoose';
import cors from 'cors';
import bodyparser from 'body-parser';
//Routes of app
import waiteroRoutes from './app/waiteroRoutes.js';

//Variable for connection with database - using mongoose
const { connect } = connection;


//Connection to mongo cloud using mongoose schema - path with user and passowrd and the database name with rules for connection
connect(`mongodb+srv://${process.env.ADMIN}:${process.env.PASSWORD}@cluster0.w7bqr.mongodb.net/Cluster0?retryWrites=true&w=majority`, // admin and password to access the database store in file locally - PRIVATE MODE
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('connected to database');
  }).catch((err) => {
    console.log('connection failed', err);
  });

//Variable for app using express functionalities
const app = express();

//Express functionality for cors (safe) connection and authentification
app.use(cors({origin: true, credentials: true}));

//Express functionality for increase the json data parsed via body request
app.use(bodyparser.json({limit: '500mb'}));

//Express functionality for increase the json data parsed via urlencoded request
app.use(bodyparser.urlencoded({limit: '500mb', extended: true}));

//Express functionality for parsing data as a json format
app.use(bodyparser.json());

//The route for api - the place from where app is starting 
app.use('/waitero/api', waiteroRoutes);

//Express functionality for port used on listening for requests
app.listen(5050, () => {console.log('portul este deschis 5050')});