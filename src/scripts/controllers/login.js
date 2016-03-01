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
    '$route',
    '$window',
    '$timeout',
    '$rootScope',
    function(auth, users, $location, $route, $window, $timeout, $rootScope) {
      var self = this;
      self.submitting = false;
      self.loggingIn = false;

      if(auth.isLoggedIn()) {
          $location.url('/my_plan');
      }

      self.signin = function(data) {
        self.loggingIn = true;
        self.loginError = null;
        self.loginSuccess = null;

        self.loginUser(data.email, data.password, data.remember)
          .then(function(res) {
            //$location('/my_plan');
            $rootScope.$broadcast('auth-userLoginChange');
            $timeout(function(){ $route.reload() }, 3000);
            //$timeout(function(){ $window.location.reload() }, 3000);
          })
          .catch(function(error) {
            //there was an error logging the user in
            console.log('there was an error with login');
            console.log(error);
            var error;
            if(error.code === 'INVALID_PASSWORD') {
              self.loginError = 'Invalid email and password combination. Please try again.';
            } else if(error.code === 'INVALID_USER' || error.code === 'INVALID_EMAIL') {
              self.loginError = "We couldn't find an account with that email address.  Please check your email address above or register an account.";
            } else {
              self.loginError = 'There was an error logging you in.';
            }
            self.loggingIn = false;
          });
      };

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
          self.registerError = 'You must agree to the Terms of Service before registering.';
          self.submitting = false;
          return;
        }

        //create new user account
        self.createUser(data.email, data.password, data.firstName, data.lastName)
          .then(function(res) {
              //$location.url('/my_plan');
              //$timeout(function(){ $window.location.reload() }, 5000);
              $timeout(function(){ $route.reload() }, 5000);
          })
          .catch(function(err) {
            //there was a problem creating a new user account
            if(err.code === 'EMAIL_TAKEN') {
              //make the error more understandable
              self.registerError = 'That email is already in use. Unable to create account.';
            } else {
              self.registerError = 'There was an error creating your account';
            }
            self.submitting = false;

          });
      };

      self.loginUser = function(email, password, remember) {
        var user = {
          email: email,
          password: password,
          remember: remember
        };

        return auth
          .login(user)
          .then(function(res) {
            console.log('User has been successfully logged in');
            console.log(res);
            //successful login
            self.loginSuccess = 'Login successful...';
          });
      }

      self.createUser = function(email, password, firstName, lastName) {
        console.log('in create user');
        var user = {
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName
        };
        return auth
          .register(user)
          .then(function(res) {
            console.log('Account has been created successfully');
            //account has been created successfully, user has also been logged in
            self.registerSuccess = 'Your account has been created successfully, you are now being logged in...';
          });
      };

    },

  ]);
