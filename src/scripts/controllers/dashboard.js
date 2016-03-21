angular
  .module('DashboardController', [
    'blogApp.auth',
  ])
  .controller('DashboardController', [
    'auth',
    '$location',
    function(auth, $location) {

      //if no one is logged in, redirect to login page
      if(!auth.isLoggedIn()) {
          $location.url('/login');
      }

    },

  ]);
