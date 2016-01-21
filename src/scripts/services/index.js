angular
  .module('blogApp', [
    'blogApp.articles'
  ])
  .value('blogAppHost', 'http://localhost:8000/api')
  .config([
    '$httpProvider',
    function($httpProvider) {
      $httpProvider.defaults.withCredentials = true;
    }
  ]);
