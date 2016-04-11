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
          title: 'Debt Free Living | Home',
        })
        .when('/login', {
          templateUrl: '/partials/login-controller.html',
          controller: 'LoginController',
          controllerAs: 'login',
          title: 'Debt Free Living | Login',
        })
        .when('/blog', {
          templateUrl: '/partials/blog-controller.html',
          controller: 'BlogController',
          controllerAs: 'blog',
          title: 'Debt Free Living | Blog',
        })
        .when('/articles/:id', {
          templateUrl: '/partials/article-controller.html',
          controller: 'ArticleController',
          controllerAs: 'article',
          title: 'Debt Free Living | Blog',
        })
        .when('/terms_of_service', {
          templateUrl: '/partials/tos-controller.html',
          title: 'Debt Free Living | Terms of Service',
        })
        .when('/about', {
          templateUrl: '/partials/about-controller.html',
          controller: 'AboutController',
          controllerAs: 'about',
          title: 'Debt Free Living | About',
        })
        .when('/contact', {
          templateUrl: '/partials/contact-controller.html',
          controller: 'ContactController',
          controllerAs: 'contact',
          title: 'Debt Free Living | Contact',
        })
        .when('/privacy_policy', {
          templateUrl: '/partials/privacy-policy-controller.html',
          title: 'Debt Free Living | Privacy Policy',
        })
        .when('/my_plan', {
          templateUrl: '/partials/dashboard-controller.html',
          controller: 'DebtCalcController',
          controllerAs: 'dashboard',
          title: 'Debt Free Living | My Plan Dashboard',
          resolve: {
            "currentAuth": ["routeProtector", function(routeProtector) {
              return routeProtector.accountRoute();
            }]
          }
        })
        .when('/my_plan/calculator', {
          templateUrl: '/partials/calc-controller.html',
          controller: 'DebtManageController',
          title: 'Debt Free Living | My Plan Manager',
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
          title: 'Debt Free Living | Account',
          resolve: {
            "currentAuth": ["routeProtector", function(routeProtector) {
              return routeProtector.accountRoute();
            }]
          }
        })
        .when('/forgot', {
          templateUrl: '/partials/forgot-controller.html',
          controller: 'ForgotController',
          controllerAs: 'forgot',
          title: 'Debt Free Living | Forgot Password',
        })
        .when('/admin', {
          templateUrl: '/partials/admin-controller.html',
          controller: 'AdminController',
          controllerAs: 'admin',
          title: 'Debt Free Living | Admin',
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
          title: 'Debt Free Living | Add Article',
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
          title: 'Debt Free Living | Edit Article',
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
          title: 'Debt Free Living | Comments',
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
      $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
          // test for current route
          if(current.$$route) {
              // Set current page title
              $rootScope.title = current.$$route.title;
          }
      });
    }
  ]);
