var mongoose = require('mongoose');
var Schema = mongoose.Schema;
import { isLength } from 'validator';
/**
 * Comment Schema
 */
var CommentSchema = new Schema({
  content: { 
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        return isLength(v, { min: undefined, max: 2 });
      },
      message: 'Content too long!',
    },
  },
  authorName: { type: String, required: true },
  authorID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  postID: { type: Schema.Types.ObjectId, ref: 'Post', required: true }
});

// Virtual for comment's url
CommentSchema
  .virtual('url')
  .get(function () {
    return '/' + this._id;
  })

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
CommentSchema.method({
});


/**
 * @typedef Comment
 */
export default mongoose.model('Comment', CommentSchema);
