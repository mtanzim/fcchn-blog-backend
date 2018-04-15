import Post from '../models/posts.model';
import httpStatus from 'http-status';
import errors from '@feathersjs/errors';
import { resolve } from 'url';
import validateUserCommon from '../config/validateUser'
// import {isLoggedIn} from '../config/isLoggedIn'
/**
 * Get all posts
 * @return {json} Data of posts
 */
function index(req, res, next) {
  Post.list()
    .then(posts => res.json(posts))
    .catch(e => next(e))
}

/**
 * Create new post
 * @property {string} req.body.title - title of post
 * @property {string} req.body.content - content of post
 * @property {string} req.body.user_id - author's id of post
 * @return {Post}
 */
function create(req, res, next) {
  //console.log('Creating post with the following:')
  //console.log(req.body);
  // //console.log(req.session);
  const { title, content, user, username } = req.body

  const post = new Post({
      title, content,
      user: user,
      username:username

  })
  post.save()
    .then(post => res.status(httpStatus.CREATED).json(post))
    .catch((e) => {
      e.status = httpStatus.UNPROCESSABLE_ENTITY
      next(e)
    })
}


function validateUser(req, res, next) {

  //console.log('Validating Post for user access!')
  getPost(req, res, next)
  .then(post => {
    validateUserCommon(req,res,next, post.user);
  })
}


//Was this happenning asynchronously? Doesn't work with express all!
/**
 * Get post by id
 */
function getPost(req, res, next) {
  //console.log('In getPost!')
  const { id } = req.params
  // //console.log(req.params);
  return Post.findById(id)
    //this command turns the query into a full fleged promise
    .exec()
    .then((post) => {
      if (!post) {
        let err = {
          name: 'NotFound',
          status: httpStatus.NOT_FOUND,
          message: 'Post not found'
        }
        next (err)
      }
      //console.log('post:');
      //console.log(post);
      // //console.log('before storing post')
      // //console.log (req.user)
      // res.locals.post = post;
      return post;
      // //console.log('after storing post')
      // //console.log(req.user)
      // next();
    })
    .catch((e) => {
      e.status = httpStatus.UNPROCESSABLE_ENTITY
      next(err)
    })
}

/**
 * Read a post
 */
function read(req, res, next) {
  //console.log('Reading single Post!')
  //console.log('Checking isLogged in:')
  //console.log(req.isAuthenticated());
  getPost(req, res, next)
  .then (post => {
    //console.log(post);
    res.json(post)
  })

}

/**
 * Update a post by id
 *
 */
function update(req, res, next) {
  //console.log('Updating Post!')
  // const {post} = res.locals
  getPost(req, res, next)
  .then(post => {
    const { title, content } = req.body
    post.set({ title, content })
    post.save()
      .then(post => res.json(post))
      .catch((e) => {
        e.status = httpStatus.UNPROCESSABLE_ENTITY
        next(e)
      })
  })
}

/**
 * Remove a post by id
 *
 */
function remove(req, res, next) {
  //console.log('Deleting Post!')
  getPost(req, res, next)
  .then(post => {
    // const {post} = res.locals
    post.remove()
      .then(post => res.json(post))
      .catch((e) => {
        e.status = httpStatus.UNPROCESSABLE_ENTITY
        next(e)
      })
    })
}


export default { index, create, getPost, validateUser, read, update, remove };
