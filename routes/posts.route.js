import express from 'express';
import postController from '../controllers/posts.controller';
import isLoggedIn from '../config/isLoggedIn';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/posts - Get list posts */
  .get(postController.index)
  /** POST /api/posts - Create new post */
  .post(isLoggedIn,postController.create);

router.route('/:id')
  /** - Get post by id before doing action */
  //replaced with promise functionality as all was not working!!!
  // .all(postController.getPost)
  /** - Read a post with post's id */
  .get(postController.read)
  /** - Update new post with post's id */
  .put(isLoggedIn,postController.update)
  /** - Delete new post with post's id */
  .delete(isLoggedIn, postController.remove);

export default router;
