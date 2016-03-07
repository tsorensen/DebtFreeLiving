angular
.module('blogApp.users', [
  'blogApp'
])
.factory('users', [
  '$http',
  'blogAppHost',
  '$q',
  '$firebaseAuth',
  function($http, host, $q, $firebaseAuth) {
    var ref = new Firebase('https://resplendent-fire-5282.firebaseio.com/');
    var fireAuth = $firebaseAuth(ref);

    var users = {
      create: function(user) {
        var fd = new FormData();

        for(var attr in user) {
          fd.append(attr, user[attr]);
        }

        return $http
          .post(host + '/users', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
          })
          .then(function(res) {
            console.log(res);
            return res.data;
          });
      },

      resetPassword: function(email) {
        return fireAuth.$resetPassword({
          email: email
        })
        .then(function() {
          console.log("Password reset email sent successfully!");
        })
        .catch(function(error) {
          console.error("Error: ", error);
          return $q.reject(error);
        });
      },

    };

    return users;
  },
]);
