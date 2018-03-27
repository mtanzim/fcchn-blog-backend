import express from 'express';
import authController from '../controllers/auth.controller';

const router = express.Router(); // eslint-disable-line new-cap
router.route('/')
    /** GET /api/auth:id - Update a comment */
    .post(authController.auth);
    // /** PUT /api/auth:id - Update a comment */
    // .put(authController.update)
    // /** PUT /api/comments:id - Delete a comment */
    // .delete(authController.remove);

export default router;
