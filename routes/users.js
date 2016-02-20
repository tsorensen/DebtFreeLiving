var Firebase = require('firebase');
var ref = new Firebase('https://resplendent-fire-5282.firebaseio.com/');

exports.register = function(req, res) {
  ref.createUser({
    email    : req.body.email,
    password : req.body.password
  }, function(error, userData) {
    if (error) {
      console.log("Error creating user:", error.code);
      res.status(401);
      res.send(error.code);
    } else {
      console.log("Successfully created user account with uid:", userData.uid);
      res.send('Successfully created account');
    }
  });
};

exports.login = function(req, res) {
  ref.authWithPassword({
    email    : req.body.email,
    password : req.body.password
  }, function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
      res.status(401);
      res.send(error.code);
    } else {
      console.log("Authenticated successfully with payload:", authData);
      res.send('User logged in successfully');
    }
  });
};
