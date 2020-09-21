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

app.listen(port, () => console.log(`App listening on port ${port}!`));