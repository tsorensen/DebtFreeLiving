angular
  .module('AdminController', [
    'blogApp.articles',
    'blogApp.contacts',
    'modalDirective',
  ])
  .controller('AdminController', [
    'articles',
    'contacts',
    '$scope',
    '$timeout',
    function(articles, contacts, $scope, $timeout) {
      var self = this;
      self.loadingArticles = true;
      self.loadingContacts = true;
      self.articles = [];
      self.contacts = [];
      self.readContacts = [];
      self.readSpinner = false;
      self.contactCount = null;
      self.showRead = false;

      self.deletingArticle = false;
      self.articleDeleteId = null;
      self.articleDeleteTitle = null;

      //code for the confirm and delete modal windows
      $scope.deleteArticleModal = false;
      $scope.toggleDeleteModal = function(id, title){
          self.deleteArticleError = null;
          self.deleteArticleSuccess = null;
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
        articles.readAllForAdmin()
          .then(function(items) {
            self.articles = items;
            self.loadingArticles = false;
          });
      }

      function getContacts() {
        //get unread contact requests (pass in false)
        contacts.getRequests(false)
          .then(function(contactRequests) {
            self.contacts = contactRequests;
            self.contactCount = contactRequests.length;
            self.loadingContacts = false;
          });
      }

      self.getReadContacts = function() {
        self.readSpinner = true;
        //get read contact requests (pass in true)
        contacts.getRequests(true)
          .then(function(contactRequests) {
            self.readContacts = contactRequests;
            self.readSpinner = false;
          });
      };

      self.markContactAsRead = function(id) {
        contacts.markAsRead(id)
          .catch(function(error) {
            console.log("Error marking contact request as read: ", error);
            console.log(error.code);
          });
      };

      self.deleteContact = function(id) {
        contacts.delete(id)
          .catch(function(error) {
            console.log("Error deleting contact request: ", error);
            console.log(error.code);
          });
      };

      self.contactCounter = function() {
        self.contactCount -= 1;
      };

      getArticles();
      getContacts();
    },

  ]);
