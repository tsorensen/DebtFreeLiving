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
    function(articles, $location, $scope) {
      var self = this;
      self.image = '';

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
        var file = $scope.myFile || '';
        console.log('here is the file: ');
        console.log(file);
        console.log(self);

        var article = {
          title: data.title,
          author: data.author,
          category: data.category.toLowerCase(),
          content: data.content
        };

        articles.create(article, file)
          .then(function() {
            $location.url('/#/blog');
            console.log('success');
          })
          .catch(function(res) {
            console.log('There was an error: ');
            console.log(res.data);
          });
      };


    },
  ]);
