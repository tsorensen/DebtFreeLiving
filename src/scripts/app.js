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
    'AccountController',
    'AdminController',
    'AddController',
    'EditController',
    'ezfb',
    'ngAnimate',
    'logoutDirective',
    'adminLinkDirective',
    'firebase',
    'autoNumericDirective'
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
        .when('/privacy_policy', {
          templateUrl: '/partials/privacy-policy-controller.html',
        })
        .when('/my_plan', {
          templateUrl: '/partials/dashboard-controller.html',
          controller: 'DashboardController',
          controllerAs: 'dashboard'
        })
        .when('/my_plan/calculator', {
          templateUrl: '/partials/calc-controller.html',
          controller: 'DebtCalcController',
        })
        .when('/account', {
          templateUrl: '/partials/account-controller.html',
          controller: 'AccountController',
          controllerAs: 'account'
        })
        .when('/forgot', {
          templateUrl: '/partials/forgot-controller.html',
          controller: 'ForgotController',
          controllerAs: 'forgot'
        })
        .when('/admin', {
          templateUrl: '/partials/admin-controller.html',
          controller: 'AdminController',
          controllerAs: 'admin'
        })
        .when('/admin/add', {
          templateUrl: '/partials/add-article-controller.html',
          controller: 'AddController',
          controllerAs: 'adder',
        })
        .when('/admin/edit/:id', {
          templateUrl: '/partials/edit-article-controller.html',
          controller: 'EditController',
          controllerAs: 'adder',
        })
        .otherwise('/');
    }
  ]);
