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
    var userData;

    var ref = new Firebase('https://resplendent-fire-5282.firebaseio.com/');
    var fireAuth = $firebaseAuth(ref);

    var auth = {

      login: function(user) {
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

      oauth: function(provider) {
        return fireAuth.$authWithOAuthPopup(provider)
          .then(function(authData) {
            console.log("OAuth successful with payload:", authData);
            currentUser = authData;
          })
          .then(function(res) {
            ref.child('users/' + currentUser.uid).once("value", function(snapshot) {
              var exists = snapshot.exists();
              if(exists) {
                $q.resolve(exists);
              }
            });
          })
          .then(function(res) {
            console.log('this is where i would create the user data in db');
            //save user data to DB
            var timestamp = new Date().getTime();
            ref.child('users').child(currentUser.uid).set({
                firstName: currentUser.facebook.cachedUserProfile.first_name,
                lastName: currentUser.facebook.cachedUserProfile.last_name,
                provider: currentUser.provider,
                joined: timestamp
            }, function(error) {
              if (error) {
                console.log("Error saving user to database:", error.code);
                return $q.reject(error);
              } else {
                console.log('Successfully saved user data');
              }
            }); //end set

            $rootScope.$broadcast('auth-userLoginChange');
          })
          .catch(function(error) {
            console.error("OAuth login failed:", error);
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
        return fireAuth.$createUser({
          email: user.email,
          password: user.password
        })
        .then(function(userData) {
          //log in newly registered user
          console.log("User " + userData.uid + " created successfully!");
          return fireAuth.$authWithPassword({
            email: user.email,
            password: user.password
          });
        })
        .then(function(authData) {
          //set currentUser
          console.log("Logged in as:", authData.uid);
          currentUser = authData;
        })
        .then(function(res) {
          //save user data to DB
          var timestamp = new Date().getTime();
          ref.child('users').child(currentUser.uid).set({
              firstName: user.firstName,
              lastName: user.lastName,
              provider: 'password',
              joined: timestamp
          }, function(error) {
            if (error) {
              console.log("Error saving user to database:", error.code);
              return $q.reject(error);
            } else {
              console.log('Successfully saved user data');
            }
          }); //end set

          $rootScope.$broadcast('auth-userLoginChange');
        })
        .catch(function(error) {
          console.log('in catch');
          console.error("Error: unable to register account");
          return $q.reject(error);
        });
      },

    };

    return auth;
  },
]);
