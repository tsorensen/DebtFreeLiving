angular
  .module('BlogController', [
    'blogApp.articles',
    'renderHtmlFilter',
    'limitHtmlFilter',
    'uniqueFilter',
    'ezfb',
  ])
  .controller('BlogController', [
    'articles',
    '$scope',
    '$filter',
    function(articles, $scope, $filter) {
      var self = this;
      self.articles = [];
      self.categories = [];

      function getArticles() {
        articles.readAll()
          .then(function(items) {
            self.articles = items;
            self.articles.map(function(article) {
              if(article.category) {
                for (var i=0; i < article.category.length; i++) {
                  self.categories.push(article.category[i]);
                }
              }
            });

            if(self.categories) {
              formatCategories();
            }
          });
      }

      function formatCategories() {
        self.categories = $filter('unique')(self.categories);

        self.categories = self.categories.map(function(index) {
          return toTitleCase(index);
        });
      }

      function toTitleCase(str)
      {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
      }

      getArticles();
    },
  ]);
