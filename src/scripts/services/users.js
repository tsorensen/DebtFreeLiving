angular
.module('blogApp.users', [
  'blogApp'
])
.factory('users', [
  '$http',
  'blogAppHost',
  function($http, host) {
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
      }
    };

    return users;
  },
]);
