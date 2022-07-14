const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const app = express();
const port = process.env.PORT || 1337;
const routes = require('./routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.use(function (req, res, next) {
    var err = new Error('404 Not Found');
    err.status = 404;
    next(err);
});
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(err.status || 500).send('Something broke! <br> ' + err.stack);
});


var http = require('http')
 var port = process.env.PORT || 1337;
 http.createServer(function(req, res) {
   res.writeHead(200, { 'Content-Type': 'text/plain' });
   res.end('Hello World\n');
 }).listen(port);
