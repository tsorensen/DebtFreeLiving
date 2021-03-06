angular
  .module('EditController', [
    'blogApp.articles',
    'textAngular',
    'imgPreviewDirective',
    'fileUploadDirective',
  ])
  .controller('EditController', [
    'articles',
    '$routeParams',
    '$location',
    '$scope',
    '$timeout',
    '$route',
    function(articles, $routeParams, $location, $scope, $timeout, $route) {
      var self = this;
      self.id = $routeParams.id;
      self.content = {};
      self.image = '';
      self.savingArticle = false;

      function getArticle() {
        articles.read(self.id)
          .then(function(article) {
            self.content = article;
            self.content = article;
            self.inputs = {
              title: article.title,
              author: article.author,
              category: article.category,
              image: article.image,
              content: article.body
            };
          })
          .then(function() {
            articles.getComments(self.id)
              .then(function(comments) {
                self.comments = comments;
              })
              .catch(function(error) {
                console.log("Error in retrieving comments: ", error);
              });
          })
          .catch(function(error) {
            console.log('Error in retreiving article data: ', error);
          });
      }

      function resetAddForm() {
        self.create = {
          name: '',
          title: '',
          image: '',
          content: '',
        };
      }

      self.removeImage = function() {
        self.inputs.image = '';
      };

      self.submit = function (data) {
        self.savingArticle = true;
        self.saveArticleError = null;
        self.saveArticleSuccess = null;

        if(!data.title || !data.author || !data.content) {
          self.saveArticleError = 'The Title, Author, and Body fields are required.';
          self.savingArticle = false;
          return;
        }

        var image = $scope.myFile || self.inputs.image;
        data.category = data.category ? data.category.toLowerCase() : '';

        if(data.title === self.content.title && data.author === self.content.author && data.content === self.content.body && image === self.content.image && data.category === self.content.category) {
          self.saveArticleError = 'No changes to make.';
          self.savingArticle = false;
          return;
        }

        var article = {
          id: self.content.$id,
          title: data.title,
          author: data.author,
          category: data.category,
        };

        //only update content if it has changed
        if(typeof data.content === 'string') {
          article['body'] = data.content;
        }

        return articles.update(article, image)
          .then(function(res) {
            self.saveArticleSuccess = 'This article has been saved successfully.';
            $timeout(function() {
              self.savingArticle = false;
              $route.reload();
            }, 3000);
          })
          .catch(function(error) {
            console.log('There was an error: ', error);
            console.log(error.code);
            self.saveArticleError = 'There was an error saving the article: ' + error;
            self.savingArticle = false;
          });
      };

      resetAddForm();
      getArticle();
    },
  ]);
