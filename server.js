var express = require('express');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var taskRouter = require('./routes/tasks');

var app = express();

var port = 5000;

// middleware, which means it's going to do something to the request between req received and req fulfilled
// will attempt to parse body of every request
// this runs for ALL routes by being in the server file
app.use(bodyParser.urlencoded({ extended: true }));

// this serves all other client side files
// client.js, jquery, css
app.use(express.static('public'));

// Routes
app.use('/', indexRouter);
app.use('/tasks', taskRouter);

// Tell server to listen on specific port
app.listen(port, function () {
    console.log('listening on 5000');
});