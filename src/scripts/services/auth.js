angular
.module('blogApp.auth', [
  'blogApp'
])
.factory('auth', [
  '$http',
  'blogAppHost',
  '$q',
  '$location',
  '$rootScope',
  '$firebaseAuth',
  function($http, host, $q, $location, $rootScope, $firebaseAuth) {
    var currentUser;
    var user;

    var userData;
    var ref = new Firebase('https://resplendent-fire-5282.firebaseio.com/');
    var fireAuth = $firebaseAuth(ref);

    var auth = {

      login: function(user) {
        var self = this;
        return fireAuth.$authWithPassword({
          email    : user.email,
          password : user.password
        })
        .then(function(authData) {
            console.log("Authenticated successfully with payload:", authData);
            currentUser = authData;
        })
        .catch(function(error) {
          console.log("Login Failed!", error);
          return $q.reject(error);
        });
      },

      logout: function() {
        console.log('in logout');
        fireAuth.$unauth();
        currentUser = null;
        userData = null;
        $rootScope.$broadcast('auth-userLoginChange');
        return 'Successfully logged out';
      },

      getCurrentUser: function() {
          if(userData !== undefined && userData !== null) {
            console.log('User data exists!');
            console.log(userData);
            return $q.resolve(userData);
          }
          return ref.child('users/' + currentUser.uid).once('value')
            .then(function(snapshot) {
              userData = snapshot.val();
              console.log(userData);
              return userData;
            })
            .catch(function(error) {
              console.log("Couldn't get user data!", error);
              return userData;
            });
      },

      isLoggedIn: function() {
        if (currentUser !== undefined && currentUser !== null) {
          console.log('current user exists!');
          console.log(currentUser);
          return $q.resolve(currentUser);
        }

        var authData = fireAuth.$getAuth()

        if(authData) {
          console.log("Logged in as:", authData.uid);
          currentUser = authData;
        } else {
          console.log("Logged out");
        }

        return currentUser;
      },

      register: function(user) {
        //create user
        ref.createUser({
          email    : user.email,
          password : user.password
        }, function(error, userData) {
          if (error) {
            console.log("Error creating user:", error.code);
          } else {
            console.log("Successfully created user account with uid:", userData.uid);
          }
        })
        .then(function(res) {
          login2(user.email, user.password)
        })
        .then(function(res) {
          console.log('stuff');
        }); //end createUser
      },

    };

    return auth;
  },
]);
