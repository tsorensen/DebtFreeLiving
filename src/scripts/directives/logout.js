angular
.module('logoutDirective', [
  'blogApp.auth'
])
.directive('logout', [
  'auth',
  '$location',
  '$compile',
  function(auth, $location, $compile) {
    return {
      restrict: 'AE',
      scope: {},
      link: function(scope, elem, attrs) {

        scope.logoutClickHandler = function() {
          console.log('in logoutClickHandler');
          auth.logout().then(function() {
            $location.url('/login');
          });
        };

        //puts either "Signup|Login" in the menu OR
        //"Hello, <firstName>|Logout" of user that is signed in
        auth.isLoggedIn()
          .then(function(isLoggedIn) {
            if (isLoggedIn) {
              auth.getCurrentUser()
                .then(function(user) {
                  console.log('current user data: ');
                  console.log(user);
                  elem.html('<li class="border-right"><a href="/#/my_plan/account">Hello, '
                            + user.firstName
                            + '</a></li><li ng-click="logoutClickHandler()"><a href="">Logout</a></li>');
                });
            } else {
              elem.html('<li class="border-right"><a href="/#/login">Sign Up</a></li><li><a href="/#/login">Login</a></li>');
            }
            $compile(elem.contents())(scope);
          });

      },
    };
  }
]);
