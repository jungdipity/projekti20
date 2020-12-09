"use strict";
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("./utils/pass");
const userit = require("./routes/userRoutes");
const blogs = require("./routes/blogRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();
const port = 3000;
var path = require("path");

app.use(cors());


app.use(bodyParser.urlencoded({ limit: '200mb', extended: false })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json({limit: '200mb'})); // for parsing application/json

app.use(express.static("public"));
app.use("/uploads",express.static('uploads'));

app.use("/auth", authRoutes);
app.use("/blogs", blogs);
app.use("/user", passport.authenticate("jwt", { session: false }), userit);
//app.use("/blogs/bloginfo", blogs);


app.post("/login", passport.authenticate("jwt"), function (req, res) {
  res.send(req.user);
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
