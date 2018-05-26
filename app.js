var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var logger = require('./config/logger');
var errors = require('@feathersjs/errors');
var cors = require('cors')
var passport = require('passport');
var session = require('express-session');

var routes = require('./routes');
var allowCrossDomain = require('./config/allowCrossDomain');
var logCredentials = require('./config/logCredentials')
// var isLoggedIn = require('./config/isLoggedIn')

var app = express();


require('dotenv').config();
require('./config/passport')(passport); // pass passport for configurationin /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//logger
app.use(morgan('dev'));
//for req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'secretFCCHanoi',
  resave: false,
  saveUninitialized: false,
}));

app.use(allowCrossDomain);
app.use(passport.initialize());
app.use(passport.session());
// app.use(logCredentials);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('./public/build'));
}

app.use('/api', routes(passport));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var error = new errors.NotFound();
  next(error);
});

// error handler
app.use(function (err, req, res, next) {
  // console.log('Coming to error handler!')
  // console.log(err.name)
  switch (err.name) {
    case 'CastError':
      err = new errors.BadRequest(`Invalid ${err.path} field`);
      break;
    case 'NotFound':
      err = new errors.NotFound();
      break;
    case 'ValidationError':
      err = new errors.BadRequest(`${err.message.split(':')[2].trim()}`);
      break;
    case 'authError':
      err = new errors.BadRequest(err.message)
      break;
    default: // Internal server error
      err = new errors.GeneralError();
  }

  logger.error(err);
  res.status(err.code);
  res.send(err);

});

// use ES6 native Promise instead of deprecated mongoose Promise
mongoose.Promise = Promise;

// connect to mongo db
//console.log(process.env.mongo_addr);
mongoose.connect(process.env.MONGO_ADDR).then(
  () => { logger.info('connect to mongo successfully'); },
  err => { logger.info('error on connect mongodb: ', err); }
);

module.exports = app;
