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
// var cookieSession = require('cookie-session');

// import isLoggedIn from '../config/isLoggedIn';
var isLoggedIn = require('./config/isLoggedIn')
var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "http://localhost:3000");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', true)
  next();
}


var app = express();

//allow cors
// app.use(cors()) // Use this after the variable declaration
app.use(allowCrossDomain);
//set port
//console.log(process.env.PORT)

app.use(cookieParser('secretFCCHanoi'));
app.use(session({
  secret: 'secretFCCHanoi',
  resave: false,
  saveUninitialized: true,
  // store: sessionStore,
  cookie: {
    expires: false,
    httpOnly: false,
    domain: '127.0.0.1:8080'
  }
}));

// app.use(cookieSession({
//   secret: 'fccHanoi',
//   cookie: {
//     maxAge: 3600000
//   }
// }));


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());




require('./config/passport')(passport); // pass passport for configuration

app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
  console.log('')
  console.log('Checking Session Information:')
  console.log("isAuthenticated: \n" + req.isAuthenticated())
  console.log(req.session);
  console.log(req.user);
  console.log('')
  next();
})


var routes = require('./routes');
app.use('/api', routes(passport));
// app.use(isLoggedIn);


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
