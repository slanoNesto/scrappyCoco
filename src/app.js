const express = require('express');
const app = express();
const routes = require('./routes/routes')(app);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongooseSlug = require('mongoose-slug-generator');

mongoose.plugin(mongooseSlug);
mongoose.Promise = global.Promise;

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

const PORT = 3000;

//connect to mongoose
mongoose.connect('mongodb://localhost/karakondzula');
const db = mongoose.connection;

app.get('/', function(req, res) {
    res.send('odjebi');
});

app.listen(PORT);
console.log(PORT + ' ti majki jebem');
