"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const { body } = require("express-validator");
const router = express.Router();
const blogController = require("../controllers/blogController");
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

router.get("/", blogController.blog_list_get);
router.get("/randomblogs", blogController.blog_list_getrandomblogs);
router.get("/popularblogs", blogController.blog_list_getpopularblogs);
router.get("/ByUser/:id", blogController.blog_list_getByUserId);

router.get("/:id", blogController.blog_get);
router.get("/search/:searchparam", blogController.blog_list_getbysearch);

router.get("/addlike/:id", blogController.blog_AddLike);
router.get("/removelike/:id", blogController.blog_RemoveLike);

router.post("/", upload.single('Image'), injectFile, [
  body('Title', 'vaadittu kenttä').isLength({min: 1}),
  body('Content', 'vaadittu kenttä').isLength({min: 1}),
  body('mimetype', 'ei ole kuva').contains('image'),
], blogController.blog_create_post);

router.put('/', upload.single('Image'), injectFile, [
  body('Title', 'vaadittu kenttä').isLength({min: 1}),
  body('Content', 'vaadittu kenttä').isLength({min: 1}),
  body('mimetype', 'ei ole kuva').contains('image'),
], blogController.blog_update_put);

router.get('/bloginfo/:ID', blogController.user_get_bloginfo);

router.delete('/:id', blogController.blog_delete);


module.exports = router;
