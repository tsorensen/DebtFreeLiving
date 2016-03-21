angular
  .module('AddController', [
    'blogApp.articles',
    'textAngular',
    'imgPreviewDirective',
    'fileUploadDirective',
  ])
  .controller('AddController', [
    'articles',
    '$location',
    '$scope',
    '$timeout',
    function(articles, $location, $scope, $timeout) {
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

        var image = $scope.myFile || '';
        console.log('here is the image: ');
        console.log(image);
        console.log('article data: ');
        console.log(data);

        var article = {
          title: data.title,
          author: data.author,
          category: data.category.toLowerCase(),
          content: data.content
        };

        return articles.create(article, image)
          .then(function(res) {
            console.log(res);
            self.saveArticleSuccess = 'This article has been saved successfully.';
            $timeout(function() {
              self.savingArticle = false;
              $location.url('/admin');
            }, 3000);
            console.log('success');
          })
          .catch(function(error) {
            console.log('There was an error: ');
            console.log(error);
            console.log(error.code);
            self.saveArticleError = 'There was an error saving the article: ' + error;
            self.savingArticle = false;
          });
      };


    },
  ]);
