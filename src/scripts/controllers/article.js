angular
  .module('ArticleController', [
    'blogApp.articles',
    'renderHtmlFilter',
    'blogApp.auth',
  ])
  .controller('ArticleController', [
    'articles',
    'auth',
    '$route',
    '$routeParams',
    '$filter',
    '$timeout',
    function(articles, auth, $route, $routeParams, $filter, $timeout) {
      var self = this;
      self.id = $routeParams.id;
      self.content = [];
      self.contentLoading = true;
      self.articles = [];
      self.categories = [];
      self.comments = [];
      self.savingComment = false;
      self.isLoggedIn = false;
      self.user = {};
      self.inputs = {};

      function getArticle() {
        articles.read(self.id)
          .then(function(article) {
            self.content = article;
            self.contentLoading = false;
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

      //get user data so we know if they are logged in and can comment or not
      function setupCommentSection() {
        auth.isLoggedIn()
          .then(function(user) {
              self.isLoggedIn = true;
              self.user = user;
          })
          .then(function(res) {
            auth.getCurrentUser()
              .then(function(userData) {
                  self.inputs.name = userData.firstName + ' ' + userData.lastName;
                  self.inputs.userImage = userData.image;
              })
              .catch(function(error) {
                console.log('Error in retreiving user data: ', error);
              });
          })
          .catch(function(error) {
            console.log('Error in retreiving logged in data: ', error);
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
        self.inputs.comment =  '';
        self.saveCommentError = null;
        self.saveCommentSuccess = null;
      }

      resetCommentForm();

      self.submit = function (data) {
        self.savingComment = true;
        self.saveCommentError = null;
        self.saveCommentSuccess = null;

        if(!data.comment) {
          self.savingComment = false;
          self.saveCommentError = 'Please fill in the comment field.';
          return;
        }

        var comment = {
          id: self.id,
          name: data.name,
          content: data.comment,
          articleName: self.content.title,
          userImage: data.userImage,
          uid: self.user.uid
        };

        return articles.createComment(comment)
          .then(function(res) {
            $timeout(function() {
              self.saveCommentSuccess = "Your comment has been submitted successfully.  It will appear here once approved by our moderators.";
            });

            $timeout(function() {
              self.savingComment = false;
              resetCommentForm();
            }, 5000);
            console.log('success');
          })
          .catch(function(error) {
            self.saveCommentError = 'There was an error submitting your comment.  Please try again.';
            console.log('There was an error: ', error);
            console.log(error.code);
            self.savingComment = false;
          });
      };

      getRecentArticles();
      getArticle();
      if(auth.isLoggedIn()) {
        setupCommentSection();
      }
    },
  ]);
