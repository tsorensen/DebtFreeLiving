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
          auth.logout().then(function() {
            $location.url('/login');
          });
        };

        auth.isLoggedIn().then(function(isLoggedIn) {
          console.log('here is the logged in:');
          console.log(isLoggedIn);
          if (isLoggedIn) {
            elem.html('<li class="border-right"><a href="/#/my_plan">Hello, </a></li><li><a ng-click="logoutClickHandler()" href="">Logout</a></li>');
          } else {
            console.log('in else');
            elem.html('<li class="border-right"><a href="/#/login">Sign Up</a></li><li><a href="/#/login">Login</a></li>');
          }
          $compile(elem.contents())(scope);
        });

      },
    };
  }
]);
