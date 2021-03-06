"use strict";
const passport = require("passport");

module.exports.register = (req, res, next) => {
  // if (req.body.password === req.body.confirmation) { // move to client validation

  // first argument is name of the passport strategy we created in passport-strat.js
  passport.authenticate("local-signup", (err, user, msgObj) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // console.log("Error registering", msgObj.message);
      res.status(409); //Conflict.  This code is debatable. Seems best suited to me.
      res.json({ message: msgObj.message });
    }
    // Go ahead and login the new user once they are signed up
    req.logIn(user, err => {
      if (err) {
        return next(err);
      }
      let currentUser = { username: user.email, id: user.id };
      res.status(200).json(currentUser);
    });
  })(req, res, next);
};

module.exports.login = (req, res, next) => {
  // Note we're using different strategy, this time for logging in
  passport.authenticate("local-signin", (err, user, msgObj) => {
    // If login fails, the error is sent back by the passport strategy as { message: "some msg"}

    if (err) {
      return next(err);
    }
    if (!user) {
      // console.log("Error logging in, man", msgObj.message);
      res.status(401); //(Unauthorized) status code indicates that the request has not been applied because it lacks valid authentication credentials for the target resource.
      res.json({ message: msgObj.message });
    }
    req.logIn(user, err => {
      if (err) {
        return next(err);
      }
      res.status(200).json({ username: user.email, id: user.id });
    });
  })(req, res, next); // note that authenticate() is called from within the route handler, rather than being used as route middleware. This gives the callback access to the req and res objects through closure.
};

// logging out
module.exports.logout = (req, res, next) => {
  req.session.destroy(function(err) {
    if (err) return next(err);
    next();
    res.status(200).end();
  });
};

module.exports.afterLogout = (req, res, next) => {
  res.redirect("/");
};
