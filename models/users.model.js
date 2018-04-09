import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { isEmail, isLength } from 'validator';
import bcrypt from 'bcrypt';
import errors from '@feathersjs/errors';

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  username: { type: String, required: [true, 'username can not be empty'], index: { unique: true } },
  password: {
    type: String,
    required: [true, 'password can not be empty'],
    validate: {
      validator: (v) => {
        return isLength(v, { min: 6, max: undefined });
      },
      message: 'password is too short',
    }
  },
  email: {
    type: String,
    required: [true, 'email can not be empty'],
    validate: [isEmail, 'email is invalid']
  },
  firstname: { type: String },
  lastname: { type: String },
  description: { type: String },
}, 
{
  timestamps: true,
  toObject: {
    transform: (doc, ret) => {
      delete ret.password;
    }
  }
});

UserSchema.pre('save', function(next) {
  const saltRounds = 10; // should be moved to config file later
  bcrypt.hash(this.password, saltRounds)
    .then(hash => {
      this.password = hash;
      next();
    });
});


//add password validation
UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};


    // return this.findOne({ 'email': email }, function (err, user) {
    //   if (err)
    //     return done(err);
    //   if (user) {
    //     //return done (null, false, {message:'User Exists!'});
    //     if (!user.validPassword(password)) {
    //       return done(null, false, { message: 'Please check password!' });
    //     } else {
    //       return done(null, user);
    //     }
    //   } else {
    //     return done(null, false, { message: 'User not found!' });

    //   }
    // });

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  authByEmail(email, password, done){
    return this.findOne({ 'email': email }, function (err, user){
      if (err) return err;
      if (user){
        if (!user.validPassword(password)) {
          return done(null, false, { name: 'authError', message: `Please check password for ${email}!` })
        }
        return done(null, user, { message: 'Welcome!' })
      }
      return done(null, false, { name: 'authError', message: `${email} not found!` })
    
    })
    // .exec()
    // .then ((user) => user)
    //.catch ( e => e)
  },
  read(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new errors.NotFound();
        return Promise.reject(err);
      })
  },

  create(user, done) {
    let {username, email} = user;
    this.findOne({ 'email': email, 'username':username }, function (err, user) {
      if (err) return err;
      if (user) {
          return done(null, false, { name: 'authError', message: `${email} or ${username} already exists!` })
      }
    })
    let newUser = new this(user);
    newUser.save( err => {
      if (err){
        return done(null, false, err)
      }
      return done(null, newUser, { message: 'Welcome!' });
    })
  },

  update(id, update) {
    return this.findByIdAndUpdate(id, update, { new: true })
      .exec()
      .then(updatedUser => updatedUser)
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec()
      .then(users => ({
        limit: parseInt(limit),
        skip: parseInt(skip),
        data: users
      }));
  }
};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);