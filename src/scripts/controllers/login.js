angular
  .module('LoginController', [
    'blogApp.auth',
    'blogApp.users',
    'compareToDirective',
  ])
  .controller('LoginController', [
    'auth',
    'users',
    '$scope',
    '$location',
    '$route',
    '$window',
    '$timeout',
    '$rootScope',
    function(auth, users, $scope, $location, $route, $window, $timeout, $rootScope) {
      //auth check
      if(auth.isLoggedIn()) {
        if($location.search().page) {
          $location.url('/' + $location.search().page);
        } else {
          $location.url('/my_plan');
        }
      }

      var self = this;
      $scope.submitted = false;
      $scope.clickedLogin = false;
      self.submitting = false;
      self.loggingIn = false;

      self.login = function(data) {
        $scope.clickedLogin = true;
        self.loggingIn = true;
        self.loginError = null;
        self.loginSuccess = null;

        if($scope.loginForm.$invalid) {
          self.loggingIn = false;
          return;
        }

        self.loginUser(data.email, data.password, data.remember)
          .then(function(res) {
            $rootScope.$broadcast('auth-userLoginChange');
            $timeout(function(){ $route.reload() }, 3000);
          })
          .catch(function(error) {
            //there was an error logging the user in
            console.log('there was an error with login');
            console.log(error);
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

      self.oauth = function(provider) {
        self.loginError = null;
        self.loginSuccess = null;
        self.oauthUser(provider)
          .then(function(res) {
            self.loggingIn = true;
            $rootScope.$broadcast('auth-userLoginChange');
            $timeout(function(){ $route.reload() }, 3000);
          })
          .catch(function(error) {
            console.log('there was an error with oauth login');
            console.log(error);
            console.log(error.code);
            if(error.code === 'INVALID_CREDENTIALS') {
              self.loginError = "We couldn't log you in with the credentials you provided for " + provider + '.';
            } else if(error.code === 'USER_CANCELLED') {
              self.loginError = "You have cancelled your login with " + provider + '.';
            } else {
              self.loginError = 'There was an error logging you in with ' + provider + '.';
            }
          });
      };

      self.register = function(data) {
        $scope.submitted = true;
        self.submitting = true;
        self.registerError = null;
        self.registerSuccess = null;

        if($scope.registerForm.$invalid) {
          self.submitting = false;
          return;
        }

        //create new user account
        self.registerUser(data.email, data.password, data.firstName, data.lastName)
          .then(function(res) {
              $rootScope.$broadcast('auth-userLoginChange');
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

      //captcha variables and functions
      $scope.response = null;
      $scope.widgetId = null;
      $scope.setResponse = function (response) {
        //will implement later
        // contacts.captchaCheck(response)
        //   .then(function(res) {
        //     $scope.response = response;
        //   })
        //   .catch(function(error) {
        //
        //   });
      };

      $scope.setWidgetId = function (widgetId) {
          $scope.widgetId = widgetId;
      };

      $scope.cbExpiration = function() {
          grecaptcha.reset();
          $scope.response = null;
       };


      /**
       * Helper functions for logging in/registering users.
       *
       */
      self.loginUser = function(email, password, remember) {
        var user = {
          email: email,
          password: password,
          remember: remember
        };

        return auth.login(user)
          .then(function(res) {
            console.log('User has been successfully logged in');
            console.log(res);
            //successful login
            self.loginSuccess = 'Login successful...';
          });
      };

      self.oauthUser = function(provider) {
        return auth.oauth(provider)
          .then(function(res) {
            console.log('User has been successfully logged in');
            console.log(res);
            //successful login
            self.loginSuccess = 'Login with ' + provider + ' successful...';
          });
      };

      self.registerUser = function(email, password, firstName, lastName) {
        var user = {
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName
        };
        return auth.register(user)
          .then(function(res) {
            console.log('Account has been created successfully');
            //account has been created successfully, user has also been logged in
            self.registerSuccess = 'Your account has been created successfully, you are now being logged in...';
          });
      };

    },

  ]);
