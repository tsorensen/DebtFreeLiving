angular
  .module('blogApp.plans', [
    'blogApp'
  ])
  .factory('plans', [
    'firebaseHost',
    '$q',
    '$firebaseArray',
    function(host, $q, $firebaseArray) {
      var ref = new Firebase(host);
      var plansRef = ref.child('plans');

      return {

        createPlan: function(uid, loansArray) {

          //returns resolved promise (saved successfully) or rejected promise (error)
        },

        readPlan: function(uid) {

          //returns $firebaseArray of plan (array of loans)
        },

        updatePlan: function(uid) {
          //could actually do the savePlan on the
          //front-end using $firebaseArray.$.save()...probably
          //dont need this function
        },

        deletePlan: function(uid) {

          //returns resolved promise (deleted successfully) or rejected promise (error)
        },

      }; //end object return

    }, //end function
  ]); //end plans factory
