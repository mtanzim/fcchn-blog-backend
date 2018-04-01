import express from 'express';
import userRoutes from './users.route';
import postRoutes from './posts.route';
import commentRoutes from './comments.route';
// import authRoutes from './auth.route';

var errors = require('@feathersjs/errors');

module.exports = function (passport) {
  const router = express.Router(); // eslint-disable-line new-cap

  /** GET /health-check - Check service health */
  router.get('/health-check', (req, res) =>
    res.send('OK')
  );

  // mount user routes at /users
  router.use('/users', userRoutes);

  // mount post routes at /posts
  router.use('/posts', postRoutes);

  // mount post comments at /comments
  router.use('/comments', commentRoutes);

  //router.post('/login', authRoutes);
  //this is to avoid passing passport around
  router.post('/auth', function auth(req, res, next) {
    passport.authenticate('local-login', function (err, user, info) {
      console.log(info.message);
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(info);
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(info) 
        }
        return res.json(user);
      });
    })(req, res, next)
    });

  return router
}

// export default router;
//module.exports = router;