import express from 'express';
import commentsController from '../controllers/comments.controller';
import isLoggedIn from '../config/isLoggedIn';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/comments	 - Get list of comments */
  .get(commentsController.index)

  /** POST /api/comments - Create new comment */
  .post(isLoggedIn, commentsController.create);

router.route('/:id')

  /** PUT /api/comments:id - Update a comment */
  .put(isLoggedIn, commentsController.validateCommentUser, commentsController.update)

  /** PUT /api/comments:id - Delete a comment */
  .delete(isLoggedIn, commentsController.validateCommentUser, commentsController.remove);

export default router;
