angular
  .module('LoginController', [
    'ui.bootstrap',
    'ngAnimate',
    'blogApp.auth',
    'blogApp.users',
  ])
  .controller('LoginController', [
    'auth',
    'users',
    '$location',
    function(auth, users, $location) {
      var self = this;
      self.submitting = false;

      // auth.isLoggedIn().then(function(isLoggedIn) {
      //   if (isLoggedIn) {
      //     $location.url('/my_plan');
      //   }
      // });

      self.register = function(data) {
        self.submitting = true;
        self.registerError = null;
        self.registerSuccess = null;

        //validate register form
        if(data.password !== data.confirmPassword) {
          self.registerError = 'Passwords must match';
          self.submitting = false;
          return;
        } else if (data.terms !== true) {
          self.registerError = 'You must agree to the Terms of Service before registering';
          self.submitting = false;
          return;
        }

        //create new user account
        self.createUser(data.email, data.password, data.firstName, data.lastName)
          .then(function(res) {
              self.registerSuccess = 'Your account has been created successfully, you are now being logged in...';
              $location.url('/my_plan');
          })
          .catch(function(res) {
            //there was a problem creating a new user account
            var error;
            if(res.data === 'EMAIL_TAKEN') {
              //make the error more understandable
              error = 'Email is already in use';
            }
            self.submitting = false;
            self.registerError = 'There was an error creating your account: ' + error;
          });
      };

      self.createUser = function(email, password, firstName, lastName) {
        var user = {
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName
        };
        return users
          .create(user)
          .then(function(res) {
            console.log('Account has been created successfully');
            //account has been created successfully, log the new user in
            return auth.login(user);
          });
      };

    },

  ]);
