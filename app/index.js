const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const models = require('./models/index');
const routes = require('./routes/index.js');

app.set('views', path.join(__dirname, 'views'));

// get signuture
const privateKey = fs.readFileSync('./app/pem/server.key');
app.set('privateKey', privateKey);
const publicKey = fs.readFileSync('./app/pem/server.key.pub');
app.set('publicKey', publicKey);
app.set('passphrase', 'example');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', routes);

// error handle
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use( (err, req, res, next) => {
    return res.status(500).send(err);
});

app.listen(3000);
console.log('Server running at http://localhost:3000/');
module.exports = app;
