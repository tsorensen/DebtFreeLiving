angular
  .module('blogApp', [
    'blogApp.articles',
  ])
  .value('firebaseHost', 'https://resplendent-fire-5282.firebaseio.com/')
  .value('verifierUrl', 'https://www.google.com/recaptcha/api/siteverify')
  .config([
    '$httpProvider',
    function($httpProvider) {
      $httpProvider.defaults.withCredentials = true;
    }
  ]);
