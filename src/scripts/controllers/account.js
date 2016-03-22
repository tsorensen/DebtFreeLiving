angular
  .module('AccountController', [
    'blogApp.auth',
    'blogApp.users',
    'modalDirective',
  ])
  .controller('AccountController', [
    'auth',
    'users',
    '$scope',
    '$location',
    '$timeout',
    '$window',
    '$route',
    function(auth, users, $scope, $location, $timeout, $window, $route) {

      //if no one is logged in, redirect to login page
      if(!auth.isLoggedIn()) {
          $location.url('/login');
      } else if(auth.isOAuth()) {
          $location.url('/my_plan');
      }

      var self = this;

      //triggers button spinner if set to true
      self.updatingName = false;
      self.updatingEmail = false;
      self.updatingPassword = false;
      self.deleting = false;

      //code for the confirm and delete modal windows
      $scope.deleteModal = false;
      $scope.toggleDeleteModal = function(){
          $scope.deleteModal = !$scope.deleteModal;
      };

      //fill in account settings form with current data
      self.user = {};
      auth.getCurrentUser()
        .then(function(user) {
          if(user) {
            self.user = user;
            self.nameInputs = {
              firstName: user.firstName,
              lastName: user.lastName,
            };
            self.emailInputs = {
              email: user.email,
            };
            self.passwordInputs = {
              email: user.email,
            };
            self.deleteInputs = {
              email: user.email,
            };

            auth.isLoggedIn()
              .then(function(user) {
                self.user.uid = user.uid;
                console.log(self.user.uid);
              });
          }
        });


      self.updateName = function(name) {
        self.updatingName = true;
        self.updateNameError = null;
        self.updateNameSuccess = null;

        if(self.user.firstName === name.firstName && self.user.lastName === name.lastName) {
          console.log('Name not updating');
          self.updatingName = false;
          self.updateNameError = "Name is not different.  No changes to make.";
          return;
        } else if(!name.firstName || !name.lastName) {
          self.updatingName = false;
          self.updateNameError = "First Name and Last Name fields are required.";
          return;
        }

        users.changeName(name.firstName, name.lastName, self.user.uid)
          .then(function(res) {
            //for some reason, a timeout was required here to update this scope variable
            $timeout(function(){
              self.updateNameSuccess = 'Your account name has been updated successfully.';
            });

            $timeout(function(){
              self.updatingName = false;
              $window.location.reload();
            }, 3000);
          })
          .catch(function(error) {
            console.log(error);
            console.log(error.code);
            self.updatingName = false;
            self.updateNameError = 'There was an error updating your name.  Please try again.';
          });
      };

      self.updateEmail = function(newEmail, password) {
        self.updatingEmail = true;
        self.updateEmailError = null;
        self.updateEmailSuccess = null;

        if(self.user.email === newEmail) {
          console.log('Email not updating');
          self.updatingEmail = false;
          self.updateEmailError = "Email is not different.  No changes to make.";
          return;
        } else if(!newEmail || !password) {
          self.updatingEmail = false;
          self.updateEmailError = "Email and Password are required fields.";
          return;
        }

        users.changeEmail(self.user.email, newEmail, password, self.user.uid)
          .then(function(res) {
              self.updateEmailSuccess = 'Your email has been updated successfully.';

            $timeout(function(){
              self.updatingName = false;
              $window.location.reload();
            }, 3000);
          })
          .catch(function(error) {
            console.log(error);
            console.log(error.code);
            if(error.code === 'INVALID_PASSWORD') {
              self.updateEmailError = 'The password you entered is not correct.  Please check your password and try again.';
            } else {
              self.updateEmailError = 'There was an error updating your email.  Please try again.';
            }
            self.updatingEmail = false;
          });
      };

      self.updatePassword = function(data) {
        console.log(data);
        self.updatingPassword = true;
        self.updatePasswordError = null;
        self.updatePasswordSuccess = null;

        if(data.newPassword !== data.confirmNewPassword) {
          console.log("New password fields don't match");
          self.updatingPassword = false;
          self.updatePasswordError = "New Password and Confirm New Password fields must match.";
          return;
        } else if(data.password === data.newPassword) {
          self.updatingPassword = false;
          self.updatePasswordError = "The new password you entered is the same as your current one.  No changes to make.";
          return;
        } else if(!data.password || !data.newPassword || !data.confirmNewPassword) {
          self.updatingPassword = false;
          self.updatePasswordError = "Old Password, New Password, and Confirm New Password fields are required.";
          return;
        }

        //email is required to change password. See AngularFire docs
        users.changePassword(data.email, data.password, data.newPassword)
          .then(function(res) {
              self.updatePasswordSuccess = 'Your password has been updated successfully.';

            $timeout(function(){
              self.updatingPassword = false;
              $route.reload();
            }, 3000);
          })
          .catch(function(error) {
            console.log(error);
            console.log(error.code);
            if(error.code === 'INVALID_PASSWORD') {
              self.updatePasswordError = 'The old password you entered is not correct.  Please check the Old Password field and try again.';
            } else {
              self.updatePasswordError = 'There was an error updating your password.  Please try again.';
            }
            self.updatingPassword = false;
          });
      };

      //deletes the user's account
      self.delete = function(email, password) {
        self.deleting = true;
        self.deleteError = null;
        self.deleteSuccess = null;

        if(!password) {
          console.log("Password is required to delete account");
          self.deleting = false;
          self.deleteError = "Entering your password is required to delete your account.";
          return;
        }

        //email is required to delete account. UID used for deleting data in DB
        users.deleteAccount(email, password, self.user.uid)
          .then(function(res) {
            self.deleteSuccess = 'Your account has been deleted successfully.';

            $timeout(function(){
              self.deleting = false;
              $window.location.reload();
            }, 3000);
          })
          .catch(function(error) {
            console.log(error);
            console.log(error.code);
            if(error.code === 'INVALID_PASSWORD') {
              self.deleteError = 'The old password you entered is not correct.  Please check your password and try again.';
            } else {
              self.deleteError = 'There was an error updating deleting your account.  Please try again.  If you are unable to delete your account, please contact us.';
            }
            self.deleting = false;
          });
      };

    },

  ]);
