angular
  .module('ContactController', [
    'ngMessages',
    'blogApp.contacts',
  ])
  .controller('ContactController', [
    '$scope',
    'contacts',
    '$location',
    '$route',
    '$timeout',
    function($scope, contacts, $location, $route, $timeout) {
      var self = this;
      self.contactInputs = {};
      $scope.submitted = false;
      self.sending = false;

      $scope.response = null;
      $scope.widgetId = null;
      $scope.setResponse = function (response) {
        //will implement later
        // contacts.captchaCheck(response)
        //   .then(function(res) {
        //     $scope.response = response;
        //   })
        //   .catch(function(error) {
        //
        //   });
      };

      $scope.setWidgetId = function (widgetId) {
          $scope.widgetId = widgetId;
      };

      $scope.cbExpiration = function() {
          grecaptcha.reset();
          $scope.response = null;
       };

      self.submitForm = function(isValid) {
        $scope.submitted = true;
        self.sending = true;
        self.sendRequestSuccess = null;
        self.sendRequestError = null;

        if($scope.contactForm.$invalid) {
          self.sending = false;
          return;
        }

        var formData = {
          name: self.contactInputs.name,
          email: self.contactInputs.email,
          subject: self.contactInputs.subject,
          message: self.contactInputs.message
        };

        return contacts.saveRequest(formData)
          .then(function(res) {
            $timeout(function() {
              self.sendRequestSuccess = 'Your contact request has been sent successfully.';
            });
            $timeout(function() {
              self.sending = false;
              self.clearForm();
            }, 3000);
          })
          .catch(function(error) {
            console.log('There was an error: ', error);
            console.log(error.code);
            self.sendRequestError = 'There was an error sending your contact request.  Please try again.';
            self.sending = false;
          });
      };

      self.clearForm = function() {
        self.contactInputs = null;
        $scope.contactForm.$setUntouched();
        $scope.submitted = false;
        grecaptcha.reset();
        $scope.response = null;
      };

    },

  ]);
