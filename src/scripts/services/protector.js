angular
.module('blogApp.protector', [
  'blogApp',
  'blogApp.auth',
])
.factory("routeProtector", [
  "$firebaseAuth",
  'firebaseHost',
  "auth",
  "$q",
  function($firebaseAuth, host, auth, $q) {
    var ref = new Firebase(host);
    return {
      adminRoute: function() {
        return $firebaseAuth(ref).$waitForAuth()
          .then(function(authData) {
            if (authData) {
              return auth.isAdmin(authData.uid)
                .then(function(user) {
                  if(user.administrator !== undefined && user.administrator === true) {
                    return $q.resolve();
                  } else {
                    return $q.reject('NOT_ADMIN')
                  }
                });
            } else {
              return $q.reject('ADMIN_AUTH_REQUIRED')
            }
          });
      },
      accountRoute: function() {
        return $firebaseAuth(ref).$requireAuth();
      },
    } //end return
  }
]);
