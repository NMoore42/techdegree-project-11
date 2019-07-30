const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Course = require('../models/course');
const Review = require('../models/review');
const mid = require('../middleware');

///////////////////
/// USER ROUTES///
/////////////////

// GET /users
router.get('/users', mid.authenticateUser, function(req, res, next) {
  res.status(200)
  return res.send(req.currentUser);
});


// POST /users
router.post('/users', (req, res, next) => {
  if (req.body.emailAddress && req.body.fullName && req.body.password) {
      // Create object with form inputs
      const userData = {
        emailAddress: req.body.emailAddress,
        password: req.body.password,
        fullName: req.body.fullName
      };

      //User schema's create method to insert into db
      User.create(userData, (error, user) => {
        if (error) {
          return next(error);
        } else {
          //req.session.userId = user._id;
          res.status(201);
          res.location("/");
          res.json({
              response: "Post Request Successful"
          });
        }
      });

    } else {
      const err = new Error('Email, Password, and Name are required!');
      err.status = 400;
      return next(err);
    }
});


///////////////////////
/// COURSES ROUTES ///
/////////////////////

//GET /courses
router.get('/courses', (req, res, next) => {
    Course.find({}, {title: true}, (err, courses) => {
      if (err) {
        return next(err);
      } else {
        res.json(courses)
      }
    })
});


module.exports = router;
