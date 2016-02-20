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

      //this is for the recent articles/categories widgets
      function getRecentArticles() {
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
