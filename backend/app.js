const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');

const path = require('path');

const app = express();

app.use(cors());

app.use(helmet());

app.use((req, res, next) => { // We declare all the headers to allow :
    res.setHeader('Access-Control-Allow-Origin', '*'); // Connection from any origin
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Access to any of these routes
    next();
});

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

module.exports = app;

