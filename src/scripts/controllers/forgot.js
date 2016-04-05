angular
  .module('ForgotController', [
    'blogApp.users',
    'blogApp.auth',
  ])
  .controller('ForgotController', [
    'users',
    'auth',
    '$scope',
    '$location',
    function(users, auth, $scope, $location) {
      //auth check
      if(auth.isLoggedIn()) {
          $location.url('/account');
      }

      var self = this;
      self.forgotError;
      self.forgotSuccess;
      $scope.submitted = false;
      self.sending = false;
      self.emailSent = false;

      self.reset = function(email) {
        $scope.submitted = true;
        self.sending = true;
        self.forgotError = null;
        self.forgotSuccess = null;

        //validate the form
        if($scope.forgotForm.$invalid) {
          self.sending = false;
          return;
        }

        users.resetPassword(email)
          .then(function(res) {
            self.forgotSuccess = 'Email sent.  Please login with the temporary password and then change your password in your account settings.';
            self.sending = false;
            self.emailSent = true;
          })
          .catch(function(error) {
            //there was an error logging the user in
            console.log('there was an error resetting your password');
            console.log(error);
            console.log(error.code);
            if(error.code === 'INVALID_USER') {
              self.forgotError = "We couldn't find an account registered with that email address.";
            } else {
              self.forgotError = 'There was an error resetting your password.';
            }
            self.sending = false;
          });
      };

    },

  ]);
