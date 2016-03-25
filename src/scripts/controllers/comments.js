angular
  .module('CommentsController', [
    'blogApp.articles',
    'blogApp.auth',
  ])
  .controller('CommentsController', [
    'auth',
    'articles',
    '$routeParams',
    '$location',
    '$scope',
    '$timeout',
    '$route',
    function(auth, articles, $routeParams, $location, $scope, $timeout, $route) {
      //if no one is logged in, redirect to login page
      if(!auth.isLoggedIn()) {
          $location.url('/login?page=admin');
      }

      var self = this;
      self.id = $routeParams.id;
      self.article;
      self.commentsArr = [];
      self.approvedComments = [];
      self.loadingComments = true;
      self.approvedSpinner = false;
      self.showApproved = false;


      function getArticle() {
        articles.read(self.id)
          .then(function(article) {
            console.log(article);
            self.article = article;
          })
          .catch(function(error) {
            console.log('Error in retreiving article data: ', error);
          });
      }

      function getComments() {
        articles.getCommentsForAdmin(self.id, false)
          .then(function(comments) {
            self.commentsArr = comments;
            self.unapprovedLength = comments.length;
            self.loadingComments = false;
          })
          .catch(function(error) {
            console.log("Error in retrieving unapproved comments: ", error);
            self.loadingComments = false;
          });
      }

      self.approveComment = function(comment, commentId) {
        console.log(comment);
        comment.approved = true;
        self.commentsArr.$save(comment);

        //also need to approve on article comments ref
        articles.approveComment(self.id, commentId)
          .catch(function(error) {
            console.log("Error approving comment: ", error);
            console.log(error.code);
          });
      };

      self.deleteComment = function(commentId) {
        articles.deleteComment(self.id, commentId)
          .catch(function(error) {
            console.log("Error deleting comment: ", error);
            console.log(error.code);
          });
      };

      self.showApprovedComments = function() {
        self.approvedSpinner = true;
        articles.getCommentsForAdmin(self.id, true)
          .then(function(comments) {
            self.approvedComments = comments;
            self.approvedSpinner = false;
            self.showApproved = true;
          })
          .catch(function(error) {
            console.log("Error in retrieving unapproved comments: ", error);
            self.approvedSpinner = false;
            self.showApproved = true;
          });
      };

      getArticle();
      getComments();
    },
  ]);
