angular
  .module('BlogApp', [
    'ngRoute',
    'BlogController',
    'ArticleController',
    'HomeController',
    'LoginController',
    'ForgotController',
    'DashboardController',
    'DebtCalcController',
    'MenuController',
    'AboutController',
    'ContactController',
    'AccountController',
    'AdminController',
    'AddController',
    'EditController',
    'CommentsController',
    'ezfb',
    'ngAnimate',
    'logoutDirective',
    'adminLinkDirective',
    'firebase',
    'blogApp.auth',
  ])
  .config([
    '$routeProvider',
    'ezfbProvider',
    function($routeProvider, ezfbProvider) {
      ezfbProvider.setInitParams({
        appId: '157210274636992',
        version: 'v2.5'
      });

      $routeProvider
        .when('/', {
          templateUrl: '/partials/home-controller.html',
          controller: 'HomeController',
          controllerAs: 'home',
        })
        .when('/login', {
          templateUrl: '/partials/login-controller.html',
          controller: 'LoginController',
          controllerAs: 'login',
        })
        .when('/blog', {
          templateUrl: '/partials/blog-controller.html',
          controller: 'BlogController',
          controllerAs: 'blog',
        })
        .when('/articles/:id', {
          templateUrl: '/partials/article-controller.html',
          controller: 'ArticleController',
          controllerAs: 'article',
        })
        .when('/terms_of_service', {
          templateUrl: '/partials/tos-controller.html',
        })
        .when('/about', {
          templateUrl: '/partials/about-controller.html',
          controller: 'AboutController',
          controllerAs: 'about',
        })
        .when('/contact', {
          templateUrl: '/partials/contact-controller.html',
          controller: 'ContactController',
          controllerAs: 'contact',
        })
        .when('/privacy_policy', {
          templateUrl: '/partials/privacy-policy-controller.html',
        })
        .when('/my_plan', {
          templateUrl: '/partials/dashboard-controller.html',
          controller: 'DashboardController',
          controllerAs: 'dashboard',
          resolve: {
            // controller will not be loaded until $requireAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            "currentAuth": ["Auth", function(Auth) {
              // $requireAuth returns a promise so the resolve waits for it to complete
              // If the promise is rejected, it will throw a $stateChangeError (see above)
              return Auth.$requireAuth();
            }]
          }
        })
        .when('/my_plan/calculator', {
          templateUrl: '/partials/calc-controller.html',
          controller: 'DebtCalcController',
          resolve: {
            "currentAuth": ["Auth", function(Auth) {
              return Auth.$requireAuth();
            }]
          }
        })
        .when('/account', {
          templateUrl: '/partials/account-controller.html',
          controller: 'AccountController',
          controllerAs: 'account',
          resolve: {
            "currentAuth": ["Auth", function(Auth) {
              return Auth.$requireAuth();
            }]
          }
        })
        .when('/forgot', {
          templateUrl: '/partials/forgot-controller.html',
          controller: 'ForgotController',
          controllerAs: 'forgot'
        })
        .when('/admin', {
          templateUrl: '/partials/admin-controller.html',
          controller: 'AdminController',
          controllerAs: 'admin',
          resolve: {
            "currentAuth": ["Auth", function(Auth) {
              return Auth.$requireAuth();
            }]
          }
        })
        .when('/admin/add', {
          templateUrl: '/partials/add-article-controller.html',
          controller: 'AddController',
          controllerAs: 'adder',
          resolve: {
            "currentAuth": ["Auth", function(Auth) {
              return Auth.$requireAuth();
            }]
          }
        })
        .when('/admin/edit/:id', {
          templateUrl: '/partials/edit-article-controller.html',
          controller: 'EditController',
          controllerAs: 'adder',
          resolve: {
            "currentAuth": ["Auth", function(Auth) {
              return Auth.$requireAuth();
            }]
          }
        })
        .when('/admin/comments/:id', {
          templateUrl: '/partials/comments-controller.html',
          controller: 'CommentsController',
          controllerAs: 'comments',
          resolve: {
            "currentAuth": ["Auth", function(Auth) {
              return Auth.$requireAuth();
            }]
          }
        })
        .otherwise('/');
    }
  ])
  .factory("Auth", ["$firebaseAuth",
    function($firebaseAuth) {
      var ref = new Firebase('https://resplendent-fire-5282.firebaseio.com/');
      return $firebaseAuth(ref);
    }
  ])
  .run([
    '$rootScope',
    '$location',
    'auth',
    function ($rootScope, $location, auth, $firebaseAuth) {
      $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
        // We can catch the error thrown when the $requireAuth promise is rejected
        // and redirect the user back to the home page
        if (error === "AUTH_REQUIRED") {
          $location.path("/login");
        }
      });

    }]);
