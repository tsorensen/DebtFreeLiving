angular
  .module('ArticleController', [
    'blogApp.articles',
    'renderHtmlFilter',
  ])
  .controller('ArticleController', [
    'articles',
    '$route',
    '$routeParams',
    '$filter',
    function(articles, $route, $routeParams, $filter) {
      var self = this;
      self.id = $routeParams.id;
      self.content = [];
      self.articles = [];
      self.categories = [];

      function getArticle() {
        articles.read(self.id)
          .then(function(article) {
            self.content = article;
          });
      }

      function getRecentArticles() {
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

      function resetCommentForm() {
        self.create = {
          name: '',
          comment: ''
        };
      }

      resetCommentForm();

      self.submit = function (data) {
        var comment = {
          id: self.id,
          name: data.name,
          content: data.comment,
        };

        articles.createComment(comment)
          .then(function() {
            $route.reload();
            console.log('success');
          })
          .catch(function(res) {
            console.log('There was an error: ');
            console.log(res.data);
          });
      };

      getRecentArticles();
      getArticle();
    },
  ]);
