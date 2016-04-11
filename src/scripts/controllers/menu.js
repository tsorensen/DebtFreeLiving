angular
  .module('MenuController', [

  ])
  .controller('MenuController', [
    '$scope',
    '$location',
    function($scope, $location) {

      $scope.isActive = function (viewLocation) {
        if(viewLocation === '/blog' && $location.path().indexOf('articles') !== -1) {
          return true;
        } else if(viewLocation === '/my_plan' && $location.path().indexOf('calculator') !== -1) {
          return true;
        }
        return viewLocation === $location.path();
      };

    },

  ]);
