const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const passport = require('passport');
const User = require('../models/user');
const setUserInfo = require('../helpers').setUserInfo;
const config = require('../config/main');

// Generate JWT
function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 604800 // in seconds
  });
}

//= =======================================
// Login Route
//= =======================================
exports.login = function (req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return res.status(404).send(err);
    }

    if(user){
      const userInfo = setUserInfo(user);

      return res.status(201).json({
        token: `JWT ${generateToken(userInfo)}`,
        user: userInfo
      });
    } else {
      return res.status(422).send(info);
    }
  })(req, res);
};


//= =======================================
// Registration Route
//= =======================================
exports.register = function (req, res, next) {
  // Check for registration errors
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  // Return error if no email provided
  if (!email) {
    return res.status(422).send({ error: 'You must enter an email address.' });
  }

  // Return error if username not provided
  if (!username) {
    return res.status(422).send({ error: 'You must enter your username.' });
  }

  // Return error if no password provided
  if (!password) {
    return res.status(422).send({ error: 'You must enter a password.' });
  }

  User.findOne({$or: [{'email': email}, {'username': username}]}, (err, existingUser) => {
    if (err) { return next(err); }

    // If user is not unique, return error
    if (existingUser) {
      return res.status(422).send({ error: 'That email address or username is already in use.' });
    }

    // If email is unique and password was provided, create account
    const user = new User({
      email,
      username,
      password,
    });

    user.save((err, user) => {
      if (err) { return next(err); }
      // Respond with JWT if user was created
      const userInfo = setUserInfo(user);

      res.status(201).json({
        token: `JWT ${generateToken(userInfo)}`,
        user: userInfo
      });
    });
  });
};
