import Post from '../models/posts.model';
import httpStatus from 'http-status';

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


//Was this happenning asynchronously?
/**
 * Get post by id
 */
function getPost(req, res) {
  console.log('Getting Post to set res.locals!')
  const { id } = req.params
  console.log(req.params);
  return Post.findById(id)
    .exec()
    .then((post) => {
      if (!post) {
        const err = {
          status: httpStatus.NOT_FOUND,
          message: 'Post not found'
        }
        return err;
      }
      console.log('post:');
      console.log(post);
      console.log('res.locals.post:');
      res.locals.post = post
      console.log(res.locals.post);
      // console.log(next);
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
  .then(() => {
    const { post } = res.locals
    res.json(post)
  })
}

/**
 * Update a post by id
 *
 */
function update(req, res, next) {
  // getPost(req, res, next);
  getPost(req, res)
  .then( () => {
    console.log('Updating Post!')
    const { post } = res.locals
    const { title, content, user_id } = req.body
    console.log(user_id);
    console.log(req.body);
    console.log(res.locals);
    post.set({ title, content, user: user_id })
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
  console.log('Deleting Post!')
  getPost(req, res)
  .then(() => {
    const { post } = res.locals

    post.remove()
      .then(post => res.json(post))
      .catch((e) => {
        e.status = httpStatus.UNPROCESSABLE_ENTITY
        next(e)
      })
    })
}

export default { index, create, getPost, read, update, remove };
