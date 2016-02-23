var Firebase = require('firebase');
var ref = new Firebase('https://resplendent-fire-5282.firebaseio.com/');

exports.register = function(req, res) {
  var usersRef = ref.child("users");

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

      //save user data to DB
      var timestamp = new Date().getTime();
      usersRef.child(userData.uid).set({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          provider: 'password',
          joined: timestamp
      }, function(error) {
        if (error) {
          console.log("Error saving user to database:", error.code);
          res.status(401);
          res.send(error.code);
        } else {
          res.send('Successfully created account');
        }
      });

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

exports.getUser = function(req, res) {
  var authData = ref.getAuth();

  if(authData) {
    console.log("User " + authData.uid + " is logged in with " + authData.provider);
    res.send(authData);
  } else {
    console.log("User is logged out");
    res.status(401);
    res.send("User is logged out");
  }
};

exports.logout = function(req, res) {

};

exports.changeEmail = function(req, res) {

};

exports.changePassword = function(req, res) {

};

exports.resetPassword = function(req, res) {

};
