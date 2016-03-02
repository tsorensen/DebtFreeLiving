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
        console.log('in oauth');
        console.log('here is provider: ' + provider);
        return fireAuth.$authWithOAuthPopup(provider, {remember: "sessionOnly"})
          .then(function(authData) {
            console.log("OAuth successful with payload:", authData);
            currentUser = authData;
            currentUser.exists = false;
          })
          .then(function(res) {
            //If this oauth user has already logged in before, their user data
            //should already exist in the DB.  If so, resolve the promise.
            return ref.child('users/' + currentUser.uid).once("value", function(snapshot) {
              var exists = snapshot.exists();

              if(exists) {
                currentUser.exists = true;
              }
            });
          })
          .then(function(res) {
            //only save user data if they don't exist in DB yet
            if(!currentUser.exists) {
              //Facebook and Google have their name properties labeled differently. Use Facebook as default.
              var names = {};

              if(currentUser.provider === 'facebook') {
                names.first_name = 'first_name';
                names.last_name = 'last_name';
              } else if(currentUser.provider === 'google') {
                names.first_name = 'given_name';
                names.last_name = 'family_name';
              }

              //save user data to DB
              var timestamp = new Date().getTime();
              return ref.child('users').child(currentUser.uid).set({
                  firstName: currentUser[currentUser.provider].cachedUserProfile[names.first_name],
                  lastName: currentUser[currentUser.provider].cachedUserProfile[names.last_name],
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
            }//end if
          })
          .catch(function(error) {
            console.error("OAuth login failed:", error);
            return $q.reject(error);
          });
      },

      logout: function() {
        fireAuth.$unauth();
        currentUser = null;
        userData = null;
        $rootScope.$broadcast('auth-userLoginChange');
        return 'Successfully logged out';
      },

      getCurrentUser: function() {
          if(userData !== undefined && userData !== null) {
            console.log('User data is set already');
            console.log(userData);
            return $q.resolve(userData);
          } else {
          return ref.child('users/' + currentUser.uid).once('value')
            .then(function(snapshot) {
              userData = snapshot.val();
              console.log('Retrieved user data');
              console.log(userData);
              return userData;
            })
            .catch(function(error) {
              console.log("Couldn't get user data!", error);
              return userData;
            });
          }
      },

      isLoggedIn: function() {
        if (currentUser !== undefined && currentUser !== null) {
          console.log('current user data is set already');
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
