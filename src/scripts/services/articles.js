angular
  .module('blogApp.articles', [
    'blogApp'
  ])
  .factory('articles', [
    '$http',
    'firebaseHost',
    '$filter',
    '$q',
    '$firebaseArray',
    '$firebaseObject',
    function($http, host, $filter, $q, $firebaseArray, $firebaseObject) {
      var ref = new Firebase(host);
      var articlesRef = ref.child('articles');
      var commentsRef = ref.child('comments');

      return {

        create: function(article, image) {
          //saves new article + image to Firebase
          var deferred = $q.defer();

          if(image) {
            var FR = new FileReader();

            FR.onload = function(e) {
              var imageString = e.target.result;
              //have to do it this way to return a promise
              deferred.resolve(saveArticle(imageString, article));
            };
            FR.readAsDataURL(image);
          } else {
            deferred.resolve(saveArticle('', article));
          }


          //save the article using the passed in imagestring
          function saveArticle(imageString, article) {
            var timestamp = new Date().getTime();
            //makes articles sort from newest to oldest
            var priority = 0 - Date.now();

      	    //create URL that refers to a specific article and add images + article data as an array-like object
            var syncArray = $firebaseArray(articlesRef);

            return syncArray.$add({
                title:    article.title,
                author:   article.author,
                date:     timestamp,
                category: article.category,
                body:     article.content,
                image:    imageString,
                $priority: priority
      	    })
            .then(function(article) {
                return $q.resolve();
            })
            .catch(function(error) {
              console.log('Error with uploading article.', error);
              return $q.reject(error);
            });
          }

          //returns a promise
          return deferred.promise;
        },//end create

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

        readAllForAdmin: function() {
          //get all articles + their comments
          var articles = $firebaseArray(articlesRef);

          return articles.$loaded()
            .then(function(){
                angular.forEach(articles, function(article) {
                  //format dates using moment
                  article.date = moment(article.date).format('MMM DD, YYYY hh:mm a');
                  var comments = $firebaseArray(commentsRef.child(article.$id).orderByChild('approved').equalTo(false));
                  comments.$loaded()
                    .then(function() {
                      article.commentCount = typeof comments === undefined ? 0 : comments.length;
                    });
                });

                return articles;
            });
        },

        update: function(article, image) {
          //saves new article + image to Firebase
          var deferred = $q.defer();
          if(image && typeof image === 'object') {
            var FR = new FileReader();

            FR.onload = function(e) {
              var imageString = e.target.result;
              //have to do it this way to return a promise
              deferred.resolve(saveArticle(imageString, article));
            };

            FR.readAsDataURL(image);
          } else if(image && typeof image === 'string') {
            deferred.resolve(saveArticle(image, article));
          } else {
            deferred.resolve(saveArticle('', article));
          }


          //save the article using the passed in imagestring
          function saveArticle(imageString, article) {
            article.image = imageString;

            //create URL that refers to a specific article and add images + article data as an array-like object
            var oldArticle = articlesRef.child(article.id);

            return oldArticle.update(article, function(error) {
              if(error) {
                console.log('Error with updating article.', error);
                return $q.reject(error);
              } else {
                return $q.resolve();
              }
            });
          }

          //returns a promise
          return deferred.promise;
        }, //end update

        delete: function(articleId) {
          if(!articleId) {
            //don't update the database without the uid
            return $q.reject('Missing article ID.  Unable to delete article.');
          }

          var article = $firebaseObject(articlesRef.child(articleId));
          var commentsRef = $firebaseObject(ref.child('comments/' + articleId));
          var commentsExist = false;
          commentsRef.$loaded(function() {
             commentsExist = commentsRef.$value !== null;
          });

          return article.$remove()
            .then(function(ref) {

              //if the article has comments, delete those as well
              if(commentsExist) {
                commentsRef.$remove()
                  .then(function(ref) {
                  })
                  .catch(function(error) {
                    console.log("Article was deleted but error deleting comments:", error);
                    return $q.reject(error);
                  });
              }

            }, function(error) {
              console.log("Error deleting article:", error);
              return $q.reject(error);
          });
        }, //end delete

        createComment: function(comment) {
          var articleId = comment.id;
          //get timestamp to insert into comment date field
          var timestamp = new Date().getTime();
          //makes comments sort from newest to oldest
          var priority = 0 - Date.now();

          //create reference to comments object and article comments by id
          var comments = commentsRef.child(articleId);
          var newCommentRef = comments.push();

          //set with priority lets us prioritize comments based on date
          return newCommentRef.setWithPriority({
            name: comment.name,
            image: comment.userImage,
            date: timestamp,
            comment: comment.content,
            articleId: articleId,
            articleName: comment.articleName,
            commentId: newCommentRef.key(),
            approved: false,
            uid: comment.uid
          },
          priority,
          function(error) {
            if(error) {
              console.log('Error saving new comment:', error);
              return $q.reject(error);
            } else {
              return $q.resolve();
            }
          });
        },//end createComment

        getComments: function(articleId) {
          var query = commentsRef.child(articleId).orderByChild('approved').equalTo(true);
          var comments = $firebaseArray(query);

          return comments.$loaded()
            .then(function(){
                angular.forEach(comments, function(comment) {
                  //format dates using moment
                  comment.date = moment(comment.date).format('MMM DD, YYYY hh:mm a');
                });

                return comments;
            })
            .catch(function(error) {
              console.log('There was an error getting comments.');
              return $q.reject(error);
            });
        },

        getCommentsForAdmin: function(articleId, getApproved) {
          var comments = $firebaseArray(commentsRef.child(articleId).orderByChild('approved').equalTo(getApproved));

          return comments.$loaded()
            .then(function(){
                angular.forEach(comments, function(comment) {
                  //format dates using moment
                  comment.date = moment(comment.date).format('MMM DD, YYYY hh:mm a');
                });
                return comments;
            })
            .catch(function(error) {
              console.log('There was an error getting comments.');
              return $q.reject(error);
            });
        },

        approveComment: function(articleId, commentId) {
          var articleCommentRef = articlesRef.child(articleId).child('comments').child(commentId);

          return articleCommentRef.update({
            approved: true
          }, function(error) {
            if(error) {
              console.log('Error with approving comment on article ref:', error);
              return $q.reject(error);
            } else {
              return $q.resolve();
            }
          });
        },

        deleteComment: function(articleId, commentId) {
          var articleCommentRef = articlesRef.child(articleId).child('comments').child(commentId);

          return articleCommentRef.remove(function(error) {
            if (error) {
              console.log('Error with deleting comment:', error);
              return $q.reject(error);
            } else {
              return $q.resolve();
            }
          });
        },

      }; //end object return

    }, //end function
  ]); //end factory
