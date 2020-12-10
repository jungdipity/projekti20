'use strict';
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

const login = (req, res) => {

  passport.authenticate('local', {session: false}, (err, user, info) => {
    //console.log('user:', user);
    //console.log('login', info);
    if (err || !user) {
      return res.status(400).json({
        message: 'Something is not right',
        user: user,
      });
    }

    req.login(user, {session: false}, (err) => {
      if (err) {
        res.send(err);
      }
      else  
      {
        console.log("Login success!",user);
      }
      // generate a signed son web token with the contents of user object and return it in the response
      const token = jwt.sign(user, 'testi');
      return res.json({user, token});
    });

  })(req, res);
};

const user_create_post = async (req, res, next) => {
  console.log('req:' + req.body);
  console.log('res: ' + res.body);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log('user create error', errors);
    res.send(errors.array());
  } else {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const params = [
      req.body.username,
      req.body.email,
      hash,
    ];

    if (await userModel.addUser(params)) {
      //console.log(params);
      next();
    } else {
      res.status(400).json({error: 'register error'});
    }
  }
};

const logout = (req, res) => {
  req.logout();
  res.json({message: 'logout'});
};

module.exports = {
  login,
  user_create_post,
  logout,
};