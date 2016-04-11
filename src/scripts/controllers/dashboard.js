angular
  .module('DashboardController', [
    'chart.js',
  ])
  .controller('DashboardController', [
    '$scope',
    '$location',
    '$timeout',
    function($scope, $location, $timeout) {
      var self = this;

      $scope.labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
      $scope.series = ['Credit Card', 'Auto Loan', 'Student Loans', 'another', 'another', 'another', 'another', 'another', 'another', 'another'];
      $scope.barColors = [
        { //1
          "fillColor": "#97BBCD",
          "strokeColor": "#97BBCD",
        },
        { //2
          "fillColor": "#DCDCDC",
          "strokeColor": "#DCDCDC",
        },
        { //3
          "fillColor": "#F7464A",
          "strokeColor": "#F7464A",
        },
        { //4
          "fillColor": "#46BFBD",
          "strokeColor": "#46BFBD",
        },
        { //5
          "fillColor": "#FDB45C",
          "strokeColor": "#FDB45C",
        },
        { //6
          "fillColor": "#949FB1",
          "strokeColor": "#949FB1",
        },
        { //7
          "fillColor": "#4D5360",
          "strokeColor": "#4D5360",
        },
        { //8
          "fillColor": "#D4B89E",
          "strokeColor": "#D4B89E",
        },
        { //9
          "fillColor": "#E0B7D1",
          "strokeColor": "#E0B7D1",
        },
        { //10
          "fillColor": "#5487D4",
          "strokeColor": "#5487D4",
        }];
      $scope.data = [
        [65, 59, 80, 81, 56, 55],
        [45, 32, 56, 45, 50, 35],
        [28, 48, 40, 19, 86, 27],
        [65, 59, 80, 81, 56, 55],
        [45, 32, 56, 45, 50, 35],
        [28, 48, 40, 19, 86, 27],
        [65, 59, 80, 81, 56, 55],
        [45, 32, 56, 45, 50, 35],
        [28, 48, 40, 19, 86, 27],
        [65, 59, 80, 81, 56, 55]
      ];

      $scope.pieLabels = ["Credit Card", "Auto Loan", "Student Loans", 'another', 'another', 'another', 'another', 'another', 'another', 'another'];
      $scope.pieData = [300, 500, 100, 300, 500, 100, 300, 500, 100, 300];

      $scope.onClick = function (points, evt) {
        console.log(points, evt);
      };

      // Simulate async data update
      $timeout(function () {
        $scope.data = [
          [28, 48, 40, 19, 86, 27],
          [65, 59, 80, 81, 56, 55],
          [28, 48, 40, 19, 86, 27],
          [28, 48, 40, 19, 86, 27],
          [65, 59, 80, 81, 56, 55],
          [28, 48, 40, 19, 86, 27],
          [28, 48, 40, 19, 86, 27],
          [65, 59, 80, 81, 56, 55],
          [28, 48, 40, 19, 86, 27],
          [28, 48, 40, 19, 86, 27]
        ];
      }, 3000);

    },

  ]);
