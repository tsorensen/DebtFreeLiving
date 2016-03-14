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
    function(auth, users, $scope, $location, $timeout) {

      //if no one is logged in, redirect to login page
      if(!auth.isLoggedIn()) {
          $location.url('/login');
      }

      //no need to change settings for oauth users
      if(auth.isOAuth()) {
          $location.url('/my_plan');
      }

      //triggers button spinner if set to true
      $scope.updating = false;
      $scope.deleting = false;

      //code for the delete confirmation modal window
      $scope.showModal = false;
      $scope.toggleModal = function(){
          $scope.showModal = !$scope.showModal;
      };

      //fill in account settings form with current data
      auth.getCurrentUser()
        .then(function(user) {
          $scope.accountInputs = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          };
          //have to use timeout to run a new scope digest
          $timeout(function() {
            $scope.$digest();
          });

        });

      //udpates the user's account information
      $scope.update = function() {

      };

      //deletes the user's account 
      $scope.delete = function() {

      };

    },

  ]);
