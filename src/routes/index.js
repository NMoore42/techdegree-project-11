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
  return res.send(req.currentUser)
});


// POST /users
router.post('/users', (req, res, next) => {
  const user = new User(req.body)
  user.save( err => {
    if (err) {
      err.status = 400
      return next(err)
    } else {
      res.status(201)
      res.location('/')
      res.end()
    }
  })
});


///////////////////////
/// COURSES ROUTES ///
/////////////////////

//GET /courses
router.get('/courses', (req, res, next) => {
  Course.find({}, {title: true}, (err, courses) => {
    if (err) {
      err.status = 400
      return next(err)
    } else {
      res.status(200)
      res.json(courses)
    }
  })
});

//GET /courses/:courseId
router.get('/courses/:courseId', (req, res, next) => {
  Course.findOne({ _id: req.params.courseId})
    .populate('reviews')
    .populate('user')
    .exec( (err, course) => {
      if (err) {
        err.status = 400
        return next(err)
      } else {
        res.status(200)
        res.json(course)
      }
    })
});

//POST /courses
router.post('/courses', mid.authenticateUser, (req, res, next) => {
  const course = new Course(req.body);
  course.save( err => {
    if (err) {
      err.status = 400
      return next(err)
    } else {
      res.status(201)
      res.location('/')
      res.end()
    }
  })
})

//PUT /courses/:courseId
router.put('/courses/:courseId', mid.authenticateUser, (req, res, next) => {
  Course.findOne({ _id: req.params.courseId})
    .update(req.body)
    .exec( (err, course) => {
      if (err) {
        err.status = 400
        return next(err)
      } else {
        res.status(204)
        res.end()
      }
    })
});


///////////////////////
/// REVIEWS ROUTES ///
/////////////////////

//POST /courses/:courseId/reviews
router.post('/courses/:courseId/reviews', mid.authenticateUser, (req, res, next) => {
  Course.findOne({ _id: req.params.courseId})
    .exec( (err, course) => {
      if (err) {
        err.status = 400
        return next(err)
      } else {
        const review = new Review(req.body);
        review.save( err => {
          if (err) {
            err.status = 400
            return next(err)
          } else {
            course.reviews.push(review)
            course.save( err => {
              if (err) {
                err.status = 400
                return next(err)
              } else {
                res.status(201)
                res.location('/')
                res.end()
              }
            })
          }
        })
      }
    })
})


module.exports = router;
