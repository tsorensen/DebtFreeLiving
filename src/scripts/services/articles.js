angular
  .module('blogApp.articles', [
    'blogApp'
  ])
  .factory('articles', [
    '$http',
    'blogAppHost',
    '$filter',
    function($http, host, $filter) {
      return {

        create: function(data, file) {
          var fd = new FormData();

          for(var attr in data) {
            fd.append(attr, data[attr]);
          }

          if(file) {
            fd.append('file', file);
          }

          return $http
            .post(host + '/articles', fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            })
            .then(function(res) {
              return res.data;
            });
        }, //end create

        createComment: function(comment) {
          var fd = new FormData();

          for(var attr in comment) {
            fd.append(attr, comment[attr]);
          }

          return $http
            .post(host + '/comments', fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            })
            .then(function(res) {
              console.log('Comment submitted successfully');
              return res.data;
            });
        }, //end createComment

        read: function(articleId) {
          return $http
          .get(host + '/articles/' + articleId)
          .then(function(res) {
            console.log(res.data);
              //render html
              res.data.body = $filter('renderHtml')(res.data.body);

              //format dates
              res.data.date = moment(res.data.date).format('MMM DD, YYYY hh:mm a');
              res.data.comments.map(function(index) {
                index.date = moment(index.date).format('MMM DD, YYYY hh:mm a');
              });
            return res.data;
          });
        }, //end read

        readAll: function() {
          return $http
            .get(host + '/articles')
            .then(function(res) {
              res.data.map(function(index) {
                //render html
                index.body = $filter('renderHtml')(index.body);

                if(index.category) {
                  index.category = index.category.split(', ');
                }

                //format dates
                index.date = moment(index.date).format('MMM DD, YYYY hh:mm a');
              });
              return res.data;
            });
        }, //end readAll

        update: function(articleId, data) {
          return $http
            .put(host + '/articles/' + articleId, data)
            .then(function(res) {
              return res.data;
            });
        }, //end update

        delete: function(data) {
          return $http
            .delete(host + '/articles/' + data.id)
            .then(function(res) {
              return res.data;
            });
        }, //end delete

      }; //end object return

    }, //end function
  ]); //end factory
