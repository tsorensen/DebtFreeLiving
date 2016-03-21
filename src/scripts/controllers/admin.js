angular
  .module('AdminController', [
    'blogApp.auth',
    'blogApp.articles',
  ])
  .controller('AdminController', [
    'auth',
    'articles',
    '$location',
    function(auth, articles, $location) {

      //if no one is logged in, redirect to login page
      if(!auth.isLoggedIn()) {
          $location.url('/login?page=admin');
      }

      var self = this;
      self.articles = [];

      function getArticles() {
        articles.readAll()
          .then(function(items) {
            self.articles = items;
            console.log('hey');
            console.log(self.articles);
            for(var i = 0; i < self.articles.length; i++) {
              if(Object.keys(self.articles[i].comments).length > 0) {
                self.articles[i].commentCount = Object.keys(self.articles[i].comments).length;
              } else {
                self.articles[i].commentCount = 0;
              }
            }

          });
      }

      getArticles();
    },

  ]);
