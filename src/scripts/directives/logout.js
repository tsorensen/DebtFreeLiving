angular
.module('logoutDirective', [
  'blogApp.auth'
])
.directive('logout', [
  'auth',
  '$location',
  '$timeout',
  '$compile',
  function(auth, $location, $timeout, $compile) {
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
            $location.url('/login');
          }, 3000);
        };

        //puts either "Signup|Login" in the menu OR
        //"Hello, <firstName>|Logout" of user that is signed in
        scope.setLoginMenu = function() {
          var loggedIn = auth.isLoggedIn();

          if(loggedIn) {
            auth.getCurrentUser()
              .then(function(user) {
                if(user.provider === 'password') {
                  elem.html('<li class="border-right">'
                            +   '<a data-toggle="collapse" data-target=".navbar-collapse.in" href="/#/account">'
                            +     'Hello, ' + user.firstName
                            +     ' <i class="fa fa-gear"></i>'
                            +   '</a>'
                            + '</li>'
                            + '<li class="logout">'
                            +   '<a href="">Logout</a>'
                            + '</li>');
                } else {
                  elem.html('<li class="border-right">'
                            +   '<a data-toggle="collapse" data-target=".navbar-collapse.in" href="/#/my_plan">'
                            +     'Hello, ' + user.firstName
                            +   '</a>'
                            + '</li>'
                            + '<li class="logout">'
                            +   '<a href="">Logout</a>'
                            + '</li>');
                }
              })
              .then(function(res) {
                //attach logout event handler
                $('.logout').bind('click', scope.logoutClickHandler);
              });
            } else {
              elem.html('<li class="border-right">'
                          +   '<a data-toggle="collapse" data-target=".navbar-collapse.in" href="/#/login">Sign Up</a>'
                          + '</li>'
                          + '<li>'
                          +   '<a data-toggle="collapse" data-target=".navbar-collapse.in" href="/#/login">Login</a>'
                          + '</li>');
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
