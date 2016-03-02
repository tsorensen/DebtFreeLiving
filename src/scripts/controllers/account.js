angular
  .module('AccountController', [
    'blogApp.auth',
  ])
  .controller('AccountController', [
    'auth',
    '$location',
    function(auth, $location) {

      //if no one is logged in, redirect to login page
      if(!auth.isLoggedIn()) {
          $location.url('/login');
      }

    },

  ]);
