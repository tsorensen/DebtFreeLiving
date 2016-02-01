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

            //loop through article objects, put categories into self.categories array if exists
            Object.keys(self.articles).map(function(id, index) {
              var article = self.articles[id];

              if(article.category) {
                //optimize for loop
                var i;
                var len = article.category.length;
                for (i=0; i < len; i+=1) {
                  //push into self.categories
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
