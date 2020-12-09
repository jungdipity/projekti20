'use strict';
const userModel = require('../models/userModel');
const { validationResult } = require('express-validator');

const users = userModel.users;

const user_list_get = async (req, res) => {
  const users = await userModel.getAllUsers();
  res.json(users);
};

const user_get = async (req, res) => {
  const id = req.params.ID;
  const useri = await userModel.getUserById(id);
  delete useri.password;
  res.json(useri);
};


const user_extraInfo_update_put = async (req, res) => {
  console.log('User info updated: ', req.body);

  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const {BlogName, Description,  ID} = req.body;
  const {path} = req.file;
  var ProfileImage=path;

  const params = [BlogName, Description, ProfileImage, ID];
  const useri = await userModel.updateUser(params);
  res.json({message: 'modify ok'});
}

module.exports = {
  user_list_get,
  user_get,
  user_extraInfo_update_put,
};