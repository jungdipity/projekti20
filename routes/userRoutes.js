'use strict';
const express = require('express');
const bodyParser = require("body-parser");
const {body} = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');

const fileFilter = (req, file, cb) => {
    if (file.mimetype.includes("image")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({dest: './uploads/', fileFilter});
  
  const injectFile = (req, res, next) => {
    if (req.file) {
      req.body.mimetype = req.file.mimetype;
    }
    next();
  };

router.get('/', userController.user_list_get);

router.get('/:ID', userController.user_get);

router.put('/', upload.single('ProfileImage'), injectFile, [
    body('BlogName', 'vaadittu kenttä').isLength({min: 1}),
    body('Description', 'vaadittu kenttä').isLength({min: 1}),
    body('mimetype', 'ei ole kuva').contains('image'),
  ], userController.user_extraInfo_update_put);

module.exports = router;