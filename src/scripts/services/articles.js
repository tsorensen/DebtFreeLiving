angular
  .module('blogApp.articles', [
    'blogApp'
  ])
  .factory('articles', [
    '$http',
    'blogAppHost',
    '$filter',
    '$firebaseArray',
    '$firebaseObject',
    function($http, host, $filter, $firebaseArray, $firebaseObject) {
      var ref = new Firebase('https://resplendent-fire-5282.firebaseio.com/');
      var articlesRef = ref.child('articles');

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
              console.log('here is the return from the save:');
              console.log(res.data);
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
          var article = $firebaseObject(articlesRef.child(articleId));

          return article.$loaded(
            function(article) {
              //render html
              article.body = $filter('renderHtml')(article.body);

              //format dates
              article.date = moment(article.date).format('MMM DD, YYYY hh:mm a');

              //if there are comments, format comment dates as well
              if(article.comments) {
                //loop through object of comments objects
                Object.keys(article.comments).map(function(id, index) {
                  var comment = article.comments[id];
                  //set comment id
                  comment._id = id;
                  comment.date = moment(comment.date).format('MMM DD, YYYY hh:mm a');
                });
              }

              return article;
            },
            function(error) {
              console.error("Error retrieving article by ID:", error);
              return $q.reject(error);
            }
          );//end $loaded

        }, //end read

        readAll: function() {
          var query = articlesRef.orderByChild("date");
          var articles = $firebaseArray(articlesRef);

          return articles.$loaded()
            .then(function(){
                angular.forEach(articles, function(article) {
                  article._id = article.$id;

                  //render html using filter
                  article.body = $filter('renderHtml')(article.body);

                  //split categories into array
                  if(article.category) {
                    article.category = article.category.split(', ');
                  }

                  //format dates using moment
                  article.date = moment(article.date).format('MMM DD, YYYY hh:mm a');
                });

                return articles;
            });
        },

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
