angular
.module('blogApp.contacts', [
  'blogApp'
])
.factory('contacts', [
  '$http',
  'firebaseHost',
  'verifierUrl',
  'verifierKey',
  '$q',
  function($http, host, verifierUrl, verifierKey, $q) {
    var ref = new Firebase(host);

    var contacts = {
      captchaCheck: function(response) {
        var data = {
          secret: verifierKey,
          response: response
        }
        return $http({
            method: 'POST',
            url: verifierUrl,
            data: data,
            headers: {'Access-Control-Allow-Origin': '*'}
        })
          .then(function (res) {
            console.log('res: ');
            console.log(res);
          });
      },

      saveRequest: function(contactData) {
        var newContactRef = ref.child('contacts').push();
        var timestamp = new Date().getTime();
        //makes contact requests sort from newest to oldest
        var priority = 0 - Date.now();

        //set with priority lets us prioritize contact requests based on date
        return newContactRef.setWithPriority({
          name: contactData.name,
          date: timestamp,
          email: contactData.email,
          subject: contactData.subject,
          message: contactData.message,
        },
        priority,
        function(error) {
          if(error) {
            console.log('Error saving new contact request:', error);
            return $q.reject(error);
          } else {
            console.log('Contact request saved successfully!');
            return $q.resolve();
          }
        });
      },//end createComment

    };

    return contacts;
  },
]);
