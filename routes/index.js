import express from 'express';
import userRoutes from './users.route';
import postRoutes from './posts.route';
import commentRoutes from './comments.route';
import authRoutes from './auth.route';

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
  router.post('/auth', function auth(req, res, next) {
    passport.authenticate('local-login', function (err, user, info) {
      console.log(info);
      if (err) {
        return res.json(info)
        //return next(err); 
      }
      if (!user) {
        return res.json(info)
        //return next(err);  
      }
      req.logIn(user, function (err) {
        if (err) {
          //console.log(err); 
          //return next(err);
          return res.json(info) 
        }
        return res.json(user);
      });
    })(req, res, next)
    });

  return router
}

// export default router;
//module.exports = router;