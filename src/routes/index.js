const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Course = require('../models/course');
const Review = require('../models/review');
const mid = require('../middleware');


/// USER ROUTES///

//GET /api/users 200 - Returns the currently authenticated user
//POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content

// GET /users
router.get('/users', mid.requiresLogin, function(req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user){
      if (error) {
        return next(error);
      } else {
        res.status = 200;
        res.send(user);
      }
    })
});

// POST /users
router.post('/users', (req, res, next) => {
  if (req.body.emailAddress && req.body.fullName && req.body.password) {
    console.log(req.body)
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
          return res.redirect('/')
        }
      });

    } else {
      const err = new Error('Email, Password, and Name are required!');
      err.status = 400;
      return next(err);
    }
});




// // GET /
// router.get('/', function(req, res, next) {
//   return res.render('index', { title: 'Home' });
// });
//
// //GET /login
// router.get('/login', mid.loggedOut, function(req, res, next) {
//   return res.render('login', { title: 'Login' });
// });
//
// //GET /logout
// router.get('/logout', function(req, res, next) {
//   if (req.session) {
//     req.session.destroy( (err) => {
//       if (err) {
//         return next(err);
//       } else {
//         res.redirect('/')
//       }
//     });
//   }
// });
//
// //POST /login
// router.post('/login', function(req, res, next) {
//   if (req.body.email && req.body.password) {
//     User.authenticate(req.body.email, req.body.password, (error, user) => {
//       if (error || !user) {
//         const err = new Error('Wrong email or password.');
//         err.status = 401;
//         return next(err);
//       } else {
//         req.session.userId = user._id;
//         return res.redirect('/profile');
//       }
//     });
//   } else {
//     const err = new Error('Email and Password are required.');
//     err.status = 400;
//     return next(err);
//   }
// });
//
// // GET /register
// router.get('/register', mid.loggedOut, (req, res, next) => {
//   return res.render('register', {title: 'Sign Up'});
// });
//
// // POST /register
// router.post('/register', (req, res, next) => {
//   if (req.body.email &&
//     req.body.name &&
//     req.body.favoriteBook &&
//     req.body.password &&
//     req.body.confirmPassword) {
//
//       //Confirm passwords match
//       if (req.body.password !== req.body.confirmPassword) {
//         const err = new Error('Passwords do not match!');
//         err.status = 400;
//         return next(err);
//       }
//
//       // Create object with form inputs
//       const userData = {
//         email: req.body.email,
//         password: req.body.password,
//         favoriteBook: req.body.favoriteBook,
//         name: req.body.name
//       };
//
//       //User schema's create method to insert into db
//       User.create(userData, (error, user) => {
//         if (error) {
//           return next(error);
//         } else {
//           req.session.userId = user._id;
//           return res.redirect('/profile')
//         }
//       });
//
//     } else {
//       const err = new Error('All fields are required!');
//       err.status = 400;
//       return next(err);
//     }
// });
//
// // GET /profile
// router.get('/profile', mid.requiresLogin, function(req, res, next) {
//   User.findById(req.session.userId)
//       .exec(function (error, user) {
//         if (error) {
//           return next(error);
//         } else {
//           return res.render('profile', { title: 'Profile', name: user.name, favorite: user.favoriteBook });
//         }
//       });
// });
//
// // GET /about
// router.get('/about', function(req, res, next) {
//   return res.render('about', { title: 'About' });
// });
//
// // GET /contact
// router.get('/contact', function(req, res, next) {
//   return res.render('contact', { title: 'Contact' });
// });

module.exports = router;
