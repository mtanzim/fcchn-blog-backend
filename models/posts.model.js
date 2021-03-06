import Promise from 'bluebird';
import mongoose, { Schema } from 'mongoose';
import { isLength } from 'validator';
/**
 * Post Schema
 */
const PostSchema = new Schema({
  title: { 
    type: String, 
    required: true,
    validate: {
      validator: (v) => {
        return isLength(v, { min: undefined, max: 50 });
      },
      message: 'Content title too long!',
    },
   },
  content: { 
    type: String, 
    required: true,
    validate: {
      validator: (v) => {
        return isLength(v, { min: undefined, max: 5000 });
      },
      message: 'Content too long!',
    },
  
  },
  //have user as a string until authorization components are done
  //user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  username: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
  });

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
PostSchema.method({
});

/**
 * Statics
 */
PostSchema.statics = {
  /**
   * List posts in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of posts to be skipped.
   * @param {number} limit - Limit number of posts to be returned.
   * @returns {Promise<post[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec()
      .then((posts) => ({
        limit: parseInt(limit),
        skip: parseInt(skip),
        data: posts
      }));
  }
};

/**
 * @typedef post
 */
export default mongoose.model('Post', PostSchema);
