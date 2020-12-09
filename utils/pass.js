"use strict";
const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const userModel = require("../models/userModel");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require("bcryptjs");

passport.use(
  new Strategy(async (username, password, done) => {
    const params = [username];
    try {
      const [user] = await userModel.getUserLogin(params);
      console.log("Local strategy", user);
      if (user === undefined) {
        return done(null, false, { message: "Incorrect email." });
      }
      if (!bcrypt.compareSync(password, user.Password)) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, { ...user }, { message: "Logged In Successfully" });
    } catch (err) {
      return done(err);
    }
  })
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "testi",
    },
    async (jwtPayload, done) => {
      console.log(jwtPayload);
      try {
        const [user] = await userModel.getUserById(jwtPayload.ID);
        if (user === undefined) {
          return done(null, false);
        }
        const plainUser = { ...user };
        return done(null, plainUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

module.exports = passport;
