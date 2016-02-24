angular
  .module('DashboardController', [
    'blogApp.auth',
  ])
  .controller('DashboardController', [
    'auth',
    '$location',
    function(auth, $location) {

      //if no one is logged in, redirect to login page
      auth.isLoggedIn().then(function(isLoggedIn) {
        console.log('here is the auth stuff: ');
        console.log(isLoggedIn);
        if (!isLoggedIn) {
          $location.url('/login');
        }
      });

    },

  ]);
