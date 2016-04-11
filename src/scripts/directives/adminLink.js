angular
.module('adminLinkDirective', [
  'blogApp.auth'
])
.directive('adminLink', [
  'auth',
  '$location',
  '$timeout',
  '$compile',
  function(auth, $location, $timeout, $compile) {
    return {
      restrict: 'AE',
      scope: {},
      link: function(scope, elem, attrs) {

        //puts either "Signup|Login" in the menu OR
        //"Hello, <firstName>|Logout" of user that is signed in
        scope.setAdminLink = function() {
          var loggedIn = auth.isLoggedIn();

          if(loggedIn) {
            auth.getCurrentUser()
              .then(function(user) {
                if(typeof user.administrator !== undefined && user.administrator === true) {

                  elem.html('<a href="/#/admin">Admin</a>');
                } else {
                  elem.html('');
                }
              });
            } else {
              elem.html('');
            }
          $compile(elem.contents())(scope);
        }

        //Load adminLink for first time
        scope.setAdminLink();

        //Listen to login/logout changes, update menu.
        scope.$on('auth-userLoginChange', scope.setAdminLink);
      },

    };
  }
]);
