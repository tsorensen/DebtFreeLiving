angular
  .module('AddController', [
    'blogApp.auth',
    'blogApp.articles',
    'textAngular',
    'imgPreviewDirective',
    'fileUploadDirective',
  ])
  .controller('AddController', [
    'auth',
    'articles',
    '$location',
    '$scope',
    '$timeout',
    function(auth, articles, $location, $scope, $timeout) {
      //if no one is logged in, redirect to login page
      if(!auth.isLoggedIn()) {
          $location.url('/login?page=admin');
      }

      var self = this;
      self.image = '';
      self.savingArticle = false;

      function resetAddForm() {
        self.create = {
          name: '',
          title: '',
          image: '',
          content: '',
        };
      }

      resetAddForm();

      self.submit = function (data) {
        self.savingArticle = true;
        self.saveArticleError = null;
        self.saveArticleSuccess = null;

        if(!data.title || !data.author || !data.content) {
          self.saveArticleError = 'The Title, Author, and Body fields are required.';
          self.savingArticle = false;
          return;
        }

        var image = $scope.myFile || '';
        data.category = data.category ? data.category.toLowerCase() : '';
        console.log('here is the image: ');
        console.log(image);
        console.log('article data: ');
        console.log(data);

        var article = {
          title: data.title,
          author: data.author,
          category: data.category,
          content: data.content
        };

        return articles.create(article, image)
          .then(function(res) {
            self.saveArticleSuccess = 'This article has been saved successfully.';
            $timeout(function() {
              self.savingArticle = false;
              $location.url('/admin');
            }, 3000);
          })
          .catch(function(error) {
            console.log('There was an error: ', error);
            console.log(error.code);
            self.saveArticleError = 'There was an error saving the article: ' + error;
            self.savingArticle = false;
          });
      };


    },
  ]);
