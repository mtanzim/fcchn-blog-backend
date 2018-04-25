import Comments from '../models/comments.model';
import validateUserCommon from '../config/validateUser'
/**
 * Load all comments of a post in descending order of 'createdAt' timestamp.
 * @param {String} req.body.post_id
 */

function index(req, res, next) {
  Comments
    .find()
    .where('postID').equals(req.query.post_id)
    .sort({ createdAt: -1 })
    .exec(function (err, list_comments) {
      if (err) { return next(err); }
      // Successful, so return the JSON
      res.json(list_comments);
    })
}

/**
 * Create new comment for a post
 * @param {String} req.body.comment_content
 * @param {String} req.body.comment_authorID
 * @param {String} req.body.comment_postID
 */
function create(req, res, next) {

  const { comment_content, comment_authorID, comment_authorName, comment_postID } = req.body;
  console.log(req.body);
  const comment = new Comments({
    content: comment_content,
    authorID: comment_authorID,
    authorName: comment_authorName,
    postID: comment_postID
  });

  comment.save()
    .then(comment => res.status(201).json(comment))
    .catch(error => next(error));
}


function validateCommentUser(req, res, next) {
  const { id } = req.params;
  Comments.findById(id, function (err, comment) {
    if (err) return next(err);
    console.log(comment);
    validateUserCommon(req, res, next, comment.authorID)
  })
}

/**
 * Edit a comment
 */
function update(req, res, next) {
  console.log('updating comment!')
  const { id } = req.params;
  const update = req.body;
  Comments
    .findByIdAndUpdate(id, update, { new: true })
    .exec()
    .then(updatedComment => {
      res.json(updatedComment)
    }
    )
    .catch(error => next(error));

}

/**
 * Delete a comment
 */
function remove(req, res, next) {
  console.log('removing comment!')
  const { id } = req.params;
  const remove = req.body;
  Comments
    .findByIdAndRemove(id, remove)
    .exec()
    .then(deletedComment => res.json(deletedComment))
    .catch(e => next(e));
}

export default { index, create, update, remove, validateCommentUser };