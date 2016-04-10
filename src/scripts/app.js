angular
  .module('BlogApp', [
    'firebase',
    'ngRoute',
    'ngAnimate',
    'ngTouch',
    'HomeController',
    'MenuController',
    'BlogController',
    'ArticleController',
    'ezfb',
    'LoginController',
    'ForgotController',
    'DashboardController',
    'DebtCalcController',
    'AccountController',
    'AdminController',
    'DebtManageController',
    'AddController',
    'EditController',
    'CommentsController',
    'AboutController',
    'ContactController',
    'vcRecaptcha',
    'logoutDirective',
    'adminLinkDirective',
    'blogApp.protector',
    'autoNumericDirective',
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
          controller: 'DebtCalcController',
          controllerAs: 'dashboard',
          resolve: {
            "currentAuth": ["routeProtector", function(routeProtector) {
              return routeProtector.accountRoute();
            }]
          }
        })
        .when('/my_plan/calculator', {
          templateUrl: '/partials/calc-controller.html',
          controller: 'DebtManageController',
          resolve: {
            "currentAuth": ["routeProtector", function(routeProtector) {
              return routeProtector.accountRoute();
            }]
          }
        })
        .when('/account', {
          templateUrl: '/partials/account-controller.html',
          controller: 'AccountController',
          controllerAs: 'account',
          resolve: {
            "currentAuth": ["routeProtector", function(routeProtector) {
              return routeProtector.accountRoute();
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
            "currentAuth": ["routeProtector", function(routeProtector) {
              return routeProtector.adminRoute();
            }]
          },
        })
        .when('/admin/add', {
          templateUrl: '/partials/add-article-controller.html',
          controller: 'AddController',
          controllerAs: 'adder',
          resolve: {
            "currentAuth": ["routeProtector", function(routeProtector) {
              return routeProtector.adminRoute();
            }]
          }
        })
        .when('/admin/edit/:id', {
          templateUrl: '/partials/edit-article-controller.html',
          controller: 'EditController',
          controllerAs: 'adder',
          resolve: {
            "currentAuth": ["routeProtector", function(routeProtector) {
              return routeProtector.adminRoute();
            }]
          }
        })
        .when('/admin/comments/:id', {
          templateUrl: '/partials/comments-controller.html',
          controller: 'CommentsController',
          controllerAs: 'comments',
          resolve: {
            "currentAuth": ["routeProtector", function(routeProtector) {
              return routeProtector.adminRoute();
            }]
          }
        })
        .otherwise('/');
    }
  ])
  .run([
    '$rootScope',
    '$location',
    function ($rootScope, $location, auth, $firebaseAuth) {
      $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
        if (error === "AUTH_REQUIRED") {
          $location.path("/login");
        } else if(error === 'ADMIN_AUTH_REQUIRED') {
          $location.url("/login?page=admin");
        } else if(error === 'NOT_ADMIN') {
          $location.path("/");
        }
      });
    }
  ]);
