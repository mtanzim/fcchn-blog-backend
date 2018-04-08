require('dotenv').config();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var logger = require('./config/logger');
var errors = require('@feathersjs/errors');
var cors = require('cors')
var passport = require('passport');
var session = require('express-session');


var app = express();

//allow cors
app.use(cors()) // Use this after the variable declaration

//set port
//console.log(process.env.PORT)

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: 'secretFCCHanoi',
  resave: false,
  saveUninitialized: true
}));

require('./config/passport')(passport); // pass passport for configuration

app.use(passport.initialize());
app.use(passport.session());


var routes = require('./routes');
app.use('/api', routes(passport));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var error = new errors.NotFound();
  next(error);
});
// error handler
app.use(function(err, req, res, next) {
  switch(err.name) {
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

// use ES6 native Promise instead of depricated mongoose Promise
mongoose.Promise = Promise;

// connect to mongo db
//console.log(process.env.mongo_addr);
mongoose.connect(process.env.MONGO_ADDR).then(
  () => { logger.info('connect to mongo successfully'); },
  err => { logger.info('error on connect mongodb: ', err); }
);

module.exports = app;
