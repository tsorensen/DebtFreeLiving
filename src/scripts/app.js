angular
  .module('BlogApp', [
    'ngRoute',
    'BlogController',
    'ArticleController',
    'HomeController',
    'AddController',
    'LoginController',
    'ezfb',
    'ngAnimate',
    'DebtCalc'
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
        .when('/add', {
          templateUrl: '/partials/add-article-controller.html',
          controller: 'AddController',
          controllerAs: 'adder',
        })
        .when('/terms_of_service', {
          templateUrl: '/partials/tos-controller.html',
        })
        .when('/privacy_policy', {
          templateUrl: '/partials/privacy-policy-controller.html',
        })
        .when('/my_plan', {
          templateUrl: '/partials/calc-controller.html'
          controller: 'DebtCalc',
          controllerAs: 'loan'
        })
        .otherwise('/');
    }
  ]);
