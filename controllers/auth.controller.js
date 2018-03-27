import User from '../models/users.model';
import bcrypt from 'bcrypt';
import errors from '@feathersjs/errors';
//var passport = require('passport');
import passport from 'passport'
/**
 * Find user data via id
 */
function auth(req, res, next) {
  const { username, password, email } = req.body;
  //console.log('coming here!');
  console.log(req.body);
  passport.authenticate('local-login'),
    function (req, res) {
      console.log(req.user);
      res.json(req.user)
      // If this function gets called, authentication was successful.
      // `req.user` contains the authenticated user.
      //res.redirect('/users/' + req.user.username);
    };

/*   passport.authenticate('local-login',
  function (err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      console.log(info);
      return res.send(403, { error: info.message });
    }
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      var fullUser = Object.assign({}, user.toJSON({ virtuals: true }));
      delete fullUser['password'];
      res.json(fullUser);
    });
  })(req, res, next); */
}

function read(req, res, next) {
  User.read(req.params.id)
    .then(user => res.json(user))
    .catch(e => next(e));
}

export default { auth };