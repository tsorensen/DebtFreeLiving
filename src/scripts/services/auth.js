angular
.module('blogApp.auth', [
  'blogApp'
])
.factory('auth', [
  '$http',
  'blogAppHost',
  '$q',
  function($http, host, $q) {
    var currentUser;

    var auth = {

      login: function(user) {
        var fd = new FormData();

        for(var attr in user) {
          fd.append(attr, user[attr]);
        }

        return $http
          .post(host + '/session', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
          })
          .then(function(res) {
            console.log(res);
            return res.data;
          });
      },

      logout: function() {
        return $http
          .delete(host + '/session')
          .then(function(res) {
            currentUser = null;
            return res;
          });
      },

      isLoggedIn: function() {
        if (currentUser !== undefined) {
          console.log('current user exists!');
          console.log(currentUser);
          return $q.resolve(currentUser);
        }
        return $http
          .get(host + '/session')
          .then(function(res) {
            currentUser = res.data;
            return currentUser;
          })
          .catch(function(res) {
            currentUser = null;
            return currentUser;
          });
      },

    };

    return auth;
  },
]);
