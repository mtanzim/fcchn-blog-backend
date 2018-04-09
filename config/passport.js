'use strict';

var LocalStrategy = require('passport-local').Strategy;
//var User = require('../models/users.model');

import User from '../models/users.model';

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    console.log(user.id);
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    console.log('deserializaing')
    console.log(user.id)
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
  //local signup
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
    function (req, email, password, done) {
      process.nextTick(function () {
        console.log(req.body)
        User.create(req.body, done)
      });
    }));
  //Local login
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
    function (req, email, password, done) {
      process.nextTick(function () {
        User.authByEmail(email, password, done)            
      });
    }));
};
