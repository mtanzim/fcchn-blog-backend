'use strict';

var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users.model');

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
  //local signup
/*   passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
    function (req, email, password, done) {
      process.nextTick(function () {
        User.findOne({ 'email': email }, function (err, user) {
          if (err)
            return done(err);
          if (user) {
            return done(null, false, { message: 'User Exists!' });
          } else {

            var newUser = new User();
            newUser.local.email = email;
            newUser.local.password = newUser.generateHash(password);
            console.log(newUser);
            newUser.save(function (err) {
              if (err)
                throw err;
              return done(null, newUser);
            })
          }
        });
      });
    })); */
  //Local login
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
    function (req, email, password, done) {
      process.nextTick(function () {
        console.log(email);
        User.findOne({ 'email': email }, function (err, user) {
          if (err)
            return done(err);
          if (user) {
            //return done (null, false, {message:'User Exists!'});
            if (!user.validPassword(password)) {
              return done(null, false, { message: 'Please check password!' });
            } else {
              return done(null, user);
            }
          } else {
            return done(null, false, { message: 'User not found!' });

          }
        });
      });
    }));
};
