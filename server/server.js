// const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const fs = require('fs');
const compression = require('compression');
const mongoose = require('mongoose');
const helmet = require('helmet');
// const multer = require('multer');
// const exp = require('constants');


const app = express();

// Get database connection
const url = `mongodb://localhost:27017/nextflick`; //mongo server url

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser());
app.use(helmet());
app.use(compression());


// Cors policy and setting up headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

//Routes to be hit
const authRoutes = require('./routes/auth');

// API END points
app.use('/auth', authRoutes);

//Error Handling
// app.use((error, req, res, next) => {
//     console.log(error);
//     const status = error.statusCode || 500;
//     const message = error.message;
//     const data = error.data;
//     res.status(status).json({ message: message, data: data });
// });

mongoose.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true
},).then(result => {
    // Port of server with env file
    console.log("databaseconnected");
    app.listen(process.env.PORT || 8081);
}).catch((err) => {
    console.log(err);
});