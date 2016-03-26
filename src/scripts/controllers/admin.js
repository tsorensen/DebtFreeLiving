angular
  .module('AdminController', [
    'blogApp.articles',
    'modalDirective',
  ])
  .controller('AdminController', [
    'articles',
    '$location',
    '$scope',
    '$route',
    '$timeout',
    function(articles, $location, $scope, $route, $timeout) {
      var self = this;
      self.loadingArticles = true;
      self.loadingComments = true;
      self.articles = [];
      self.comments = [];

      self.deletingArticle = false;
      self.articleDeleteId = null;
      self.articleDeleteTitle = null;

      //code for the confirm and delete modal windows
      $scope.deleteArticleModal = false;
      $scope.toggleDeleteModal = function(id, title){
          self.deleteArticleInputs = {
            title: title,
            id: id
          };
          $scope.deleteArticleModal = !$scope.deleteArticleModal;
      };

      //deletes the selected blog article
      self.deleteArticle = function(deleteText, articleId) {
        self.deletingArticle = true;
        self.deleteArticleError = null;
        self.deleteArticleSuccess = null;

        if(!deleteText || deleteText.toLowerCase() !== "delete") {
          console.log("Typing delete is required to confirm and delete article.");
          self.deleteArticleError = 'You must type "Delete" in the field above to delete this article.';
          self.deletingArticle = false;
          return;
        }

        //email is required to delete account. UID used for deleting data in DB
        articles.delete(articleId)
          .then(function(res) {
            self.deleteArticleSuccess = 'The article ' + self.deleteArticleInputs.title + ' has been deleted successfully.';

            $timeout(function(){
              self.deletingArticle = false;
              $scope.deleteArticleModal = false;
            }, 3000);
          })
          .catch(function(error) {
            console.log(error);
            console.log(error.code);
            self.deleteArticleError = 'There was an error deleting this article: ' + error;
            self.deletingArticle = false;
          });
      };

      function getArticles() {
        articles.readAll()
          .then(function(items) {
            for(var i = 0; i < items.length; i++) {
              items[i].commentCount = 0;
              var commentsObj = Object.keys(items[i].comments);
              if(commentsObj.length > 0) {
                for(var comment in items[i].comments) {
                  if(items[i].comments[comment].approved === false) {
                    items[i].commentCount++;
                  }
                }
              }
            }
            self.articles = items;
            self.loadingArticles = false;
          });
      }

      getArticles();
    },

  ]);
