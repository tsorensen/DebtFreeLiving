angular
.module('blogApp.contacts', [
  'blogApp'
])
.factory('contacts', [
  '$http',
  'firebaseHost',
  'verifierUrl',
  '$q',
  '$firebaseArray',
  function($http, host, verifierUrl, $q, $firebaseArray) {
    var ref = new Firebase(host);

    var contacts = {

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
          read: false
        },
        priority,
        function(error) {
          if(error) {
            console.log('Error saving new contact request:', error);
            return $q.reject(error);
          } else {
            return $q.resolve();
          }
        });
      },//end createComment

      getRequests: function(getRead) {
        var contacts = $firebaseArray(ref.child('contacts').orderByChild('read').equalTo(getRead));

        return contacts.$loaded()
          .then(function(){
              angular.forEach(contacts, function(contact) {
                //format dates using moment
                contact.date = moment(contact.date).format('MMM DD, YYYY hh:mm a');
              });
              return contacts;
          })
          .catch(function(error) {
            console.log('There was an error getting contacts.');
            return $q.reject(error);
          });
      },

      markAsRead: function(id) {
        var contactRef = ref.child('contacts').child(id);

        return contactRef.update({
          read: true
        }, function(error) {
          if(error) {
            console.log('Error with marking contact as read:', error);
            return $q.reject(error);
          } else {
            return $q.resolve();
          }
        });
      },

      delete: function(id) {
        var contactRef = ref.child('contacts').child(id);

        return contactRef.remove(function(error) {
          if (error) {
            console.log('Error with deleting contact request:', error);
            return $q.reject(error);
          } else {
            return $q.resolve();
          }
        });
      },

    };

    return contacts;
  },
]);
