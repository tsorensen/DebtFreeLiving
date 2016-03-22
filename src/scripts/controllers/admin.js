angular
  .module('AdminController', [
    'blogApp.auth',
    'blogApp.articles',
    'modalDirective',
  ])
  .controller('AdminController', [
    'auth',
    'articles',
    '$location',
    '$scope',
    '$route',
    '$timeout',
    function(auth, articles, $location, $scope, $route, $timeout) {

      //if no one is logged in, redirect to login page
      if(!auth.isLoggedIn()) {
          $location.url('/login?page=admin');
      }

      var self = this;
      self.loadingArticles = true;
      self.articles = [];

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
          console.log("id: " + id);
          console.log("title: " + title);
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
              // $route.reload();
              //$window.location.reload();
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

            self.loadingArticles = false;
          });
      }

      getArticles();
    },

  ]);
