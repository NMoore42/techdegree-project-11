const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Validates proper email - borrowed from https://stackoverflow.com/questions/18022365/mongoose-validate-email-syntax
const validateEmail = function(email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const UserSchema = new mongoose.Schema({
  emailAddress: {
    type: String,
    required: true,
    unique: true,
    validate: [validateEmail, 'Please fill a valid email address']
  },
  fullName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});


//Authenticate input against database docs
UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({ emailAddress: email})
    .exec( (error, user) => {
      if (error) {
        return callback(error);
      } else if (!user) {
        const err = new Error("User not found");
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, (error, result) => {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    })
};

//Hash password before saving
UserSchema.pre('save', function(next) {
  const user = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
