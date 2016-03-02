angular
.module('logoutDirective', [
  'blogApp.auth'
])
.directive('logout', [
  'auth',
  '$route',
  '$timeout',
  '$compile',
  function(auth, $route, $timeout, $compile) {
    return {
      restrict: 'AE',
      scope: {},
      link: function(scope, elem, attrs) {

        scope.logoutClickHandler = function(e) {
          //Stop view from disappearing because of click event
          e.preventDefault();

          //Show "logging out.." for a few seconds so user
          //knows whats going on. Logout and reload the view.
          var logoutText = elem.children().contents()[1];
          logoutText.innerHTML = 'Logging out...';
          $timeout(function(){
            auth.logout();
            $route.reload();
          }, 3000);
        };

        //puts either "Signup|Login" in the menu OR
        //"Hello, <firstName>|Logout" of user that is signed in
        scope.setLoginMenu = function() {
          var loggedIn = auth.isLoggedIn();

          if(loggedIn) {
            auth.getCurrentUser()
              .then(function(user) {
                console.log('current user data: ');
                console.log(user);
                elem.html('<li class="border-right"><a href="/#/account">Hello, '
                          + user.firstName
                          + '</a></li><li class="logout"><a href="#">Logout</a></li>');
              })
              .then(function(res) {
                //attach logout event handler
                $('.logout').bind('click', scope.logoutClickHandler);
              });
            } else {
              elem.html('<li class="border-right"><a href="/#/login">Sign Up</a></li><li><a href="/#/login">Login</a></li>');
            }
          $compile(elem.contents())(scope);
        }

        //Load menu for first time
        scope.setLoginMenu();

        //Listen to login/logout changes, update menu.
        scope.$on('auth-userLoginChange', scope.setLoginMenu);
      },

    };
  }
]);
