angular
.module('blogApp.users', [
  'blogApp'
])
.factory('users', [
  'firebaseHost',
  '$q',
  '$firebaseAuth',
  function(host, $q, $firebaseAuth) {
    var ref = new Firebase(host);
    var fireAuth = $firebaseAuth(ref);

    var users = {
      resetPassword: function(email) {
        return fireAuth.$resetPassword({
          email: email
        })
        .then(function() {
          //
        })
        .catch(function(error) {
          return $q.reject(error);
        });
      },

      changeName: function(firstName, lastName, uid) {
        if(!uid) {
          //don't update the database without the uid
          return $q.reject('Missing user ID');
        }

        return ref.child('users/' + uid).update({
            "firstName": firstName,
            "lastName": lastName
        }, function(error) {
          if (error) {
            return $q.reject(error);
          } else {
            //
          }
        }); //end update
      },

      changeEmail: function(oldEmail, newEmail, password, uid) {
        if(!uid) {
          //don't update the database without the uid
          return $q.reject('Missing user ID');
        }

        return fireAuth.$changeEmail({
          password: password,
          oldEmail: oldEmail,
          newEmail: newEmail
        }).then(function() {
          //now update email in the DB
          return ref.child('users/' + uid).update({
              "email": newEmail
          }, function(error) {
            if (error) {
              return $q.reject(error);
            } else {
              //
            }
          }); //end update

        }).catch(function(error) {
          return $q.reject(error);
        });
      },

      changePassword: function(email, oldPassword, newPassword) {
        return fireAuth.$changePassword({
          email: email,
          oldPassword: oldPassword,
          newPassword: newPassword
        }).then(function() {
          //
        }).catch(function(error) {
          return $q.reject(error);
        });
      },

      deleteAccount: function(email, password, uid) {
        if(!uid) {
          //don't update the database without the uid
          return $q.reject('Missing user ID');
        }

        return fireAuth.$removeUser({
          email: email,
          password: password
        }).then(function() {
          //removes the users data from the DB
          ref.child('users/' + uid).remove();
        }).catch(function(error) {
          return $q.reject(error);
        });
      },

    };

    return users;
  },
]);
