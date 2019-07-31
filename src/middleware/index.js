const auth = require('basic-auth');
const User = require('../models/user');

const authenticateUser = (req, res, next) => {
  const credentials = auth(req);
  if (credentials) {
    User.authenticate(credentials.name, credentials.pass, (error, user) => {
      if (error || !user) {
        const err = new Error('Wrong password.');
        err.status = 401;
        return next(err);
      } else {
        req.currentUser = user;
        return next();
      }
    });
  } else {
    const err = new Error('Auth header not found');
		err.status = 401;
		return next(err);
  }
};


module.exports.authenticateUser = authenticateUser;
