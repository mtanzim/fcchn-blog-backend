import Post from '../models/posts.model';
import httpStatus from 'http-status';
import errors from '@feathersjs/errors';
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
  console.log('Creating post with the following:')
  console.log(req.body);
  // console.log(req.session);
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


function validateUser(post, req) {
  if (post.user.toString() !== req.user._id.toString()) {
    console.log('Comparing user of Post and Session!')
    let err = {
      name: 'authError',
      status: httpStatus.UNAUTHORIZED,
      message: 'User is not authorized to edit post!'
    }
    console.log('returning error:');
    return err
  }

}


//Was this happenning asynchronously?
/**
 * Get post by id
 */
function getPost(req, res) {
  console.log('In getPost!')
  const { id } = req.params
  // console.log(req.params);
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
        return err;
      }
      console.log('post:');
      console.log(post);

      return post;
    })
    .catch((e) => {
      e.status = httpStatus.UNPROCESSABLE_ENTITY
      return e;
    })
}

/**
 * Read a post
 */
function read(req, res, next) {
  console.log('Reading single Post!')
  getPost(req, res)
  .then((post) => {
    console.log('Back in read!')
    // console.log(err);
    console.log(post);
    // if (err){
    //   return next(err);
    // }
    res.json(post)
  })
}

/**
 * Update a post by id
 *
 */
function update(req, res, next) {
  // getPost(req, res, next);
  getPost(req, res, true)
  .then( (err, post) => {
    if (err) {
      return next(err);
    }
    // const { post } = res.locals
    // console.log(typeof(req.user._id));
    // console.log(typeof(post.user))
    // console.log(req.user._id.toString());
    // console.log(post.user.toString())

      
    // } else {
      //updates
      const { title, content, user_id } = req.body
      console.log(user_id);
      console.log(req.body);
      console.log(res.locals);
      post.set({ title, content, user: user_id })
      post.save()
        .then(post => res.json(post))
        .catch((e) => {
          e.status = httpStatus.UNPROCESSABLE_ENTITY
          return next(e)
        })

    // }

  })

}

/**
 * Remove a post by id
 *
 */
function remove(req, res, next) {
  console.log('Deleting Post!')
  getPost(req, res, true)
  .then((err,post) => {
    // const { post } = res.locals
    if (err) {
      return next(err);
    }
    post.remove()
      .then(post => res.json(post))
      .catch((e) => {
        e.status = httpStatus.UNPROCESSABLE_ENTITY
        return next(e)
      })
    })
}

export default { index, create, getPost, read, update, remove };
