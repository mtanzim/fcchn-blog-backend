import express from 'express';
import userRoutes from './users.route';
import postRoutes from './posts.route';
import commentRoutes from './comments.route';
import isLoggedIn from '../config/isLoggedIn'
// import authRoutes from './auth.route';

var errors = require('@feathersjs/errors');

module.exports = function (passport) {
  const router = express.Router(); // eslint-disable-line new-cap

  /** GET /health-check - Check service health */
  router.get('/health-check', (req, res) =>
    res.send('OK')
  );
  //router.post('/login', authRoutes);
  //this is to avoid passing passport around
  router.post('/auth', function (req, res, next) {
    passport.authenticate('local-login', function (err, user, info) {
      console.log(info.message);
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(info);
      }
      req.login(user, function (err) {
        if (err) {
          return next(info)
        }
        return res.json(user);
      });
    })(req, res, next)
  });

  router.post('/signup', function auth(req, res, next) {
    passport.authenticate('local-signup', function (err, user, info) {
      console.log(info.message);
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(info);
      }
      req.login(user, function (err) {
        if (err) {
          return next(info)
        }
        return res.json(user);
      });
    })(req, res, next)
  });

  router.get('/readSession', isLoggedIn,  function (req, res, next) {
    // isLoggedIn()
    // if (req.isAuthenticated()) {
    //   console.log("User credentials:");
    //   console.log(req.user);
      res.send(req.user);
    // } else {
    //   let err = {
    //     name: 'authError',
    //     status: httpStatus.NOT_FOUND,
    //     message: 'Please log in'
    //   }
    //   return next(err)
    // }
  })

  router.get('/logout',  (req, res) => {
    req.logOut();
    req.session.destroy();
    console.log('Logged Out!')
    console.log('isAuthenticated after logout: ' +req.isAuthenticated())
    res.status(201).send('Logged out!');
  })
  // mount user routes at /users
  router.use('/users', userRoutes);

  // mount post routes at /posts
  
  

  // mount post comments at /comments
  router.use('/comments', commentRoutes);

  router.use('/posts', postRoutes);



  return router
}

// export default router;
//module.exports = router;