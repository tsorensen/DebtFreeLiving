angular
  .module('DebtManageController', [
    'blogApp.auth'
  ])
  .controller('DebtManageController', [
    '$scope',
    'auth',
    '$firebaseArray',
    '$route',
    function($scope, auth, $firebaseArray, $route) {

      var ref = new Firebase("https://resplendent-fire-5282.firebaseio.com/");
​
      $scope.initList = [{},{}];
​      var initCopy = [];

      auth.isLoggedIn()
        .then(function(user) {
            $scope.user = user;
            $scope.userData = $firebaseArray(ref.child("plans").child($scope.user.uid));
            $scope.userData.$loaded()
            .then(function(){
              if($scope.userData.length > 0){
                  $scope.initList = $scope.userData.slice();
              }
​
              if($scope.userData.length > 2){
                $scope.showRemoveBtn = true;
              }
            });
        })
        .catch(function(error) {
          console.log('Error in retreiving logged in data: ', error);
        });
​
​
      $scope.columns = [];
      $scope.showRemoveBtn = false;
      $scope.showForm = true;
      $scope.showPlan = false;
      $scope.finalOutput = [];
      $scope.loanList = [];
      $scope.errorMessage = null;
      $scope.errorAmount = null;
      $scope.showAddBtn = false;

      if($scope.initList.length > 2){
        $scope.showRemoveBtn = true;
      }

      if($scope.initList.length < 8){
        $scope.showAddBtn = true;
      }
​
      $scope.addLoans = function(){
        $scope.initList.push(
          {}
        )
​
        if($scope.initList.length > 2 || $scope.userData > 2){
          $scope.showRemoveBtn = true;
        }

        if($scope.initList.length >= 8){
          $scope.showAddBtn = false;
        }
      };
​
      $scope.removeLoan = function(k){
        $scope.initList.splice(k, 1);
​
        if($scope.initList.length < 3){
          $scope.showRemoveBtn = false;
        }

        if($scope.initList.length < 8){
          $scope.showAddBtn = true;
        }
      };
​
      $scope.editPlan = function(){
        $scope.showForm = true;
      }

      $scope.resetPlan = function(){
        BootstrapDialog.show({
            type: BootstrapDialog.TYPE_DANGER,
            title: 'Reset Plan',
            label: 'small',
            message: 'Your Debt Elimination Plan will be erased. This action cannot be undone. Are you sure you would like to continue?',
            buttons: [{
                label: 'Cancel',
                action: function(dialogItself){
                  dialogItself.close();
                }
            }, {
                label: 'Clear Plan and Reset',
                cssClass: 'btn-danger',
                action: function(dialogItself){
                  $scope.erasePlan();
                  dialogItself.close();
                }
            }]
        });
      };
​
      $scope.clearAll = function(){
        $scope.initList = [{},{}];
        $scope.loanList = [];
        $scope.finalOutput = [];
        $scope.colums = [];
        $scope.showForm = true;
        $scope.showPlan = false;
        $scope.showRemoveBtn = false;
      };

      $scope.updatePlan = function(){

        for(i=0; i < $scope.initList.length; i++){
          if($scope.initList[i] && !$scope.userData[i]){
            $scope.userData.$add($scope.initList[i]);
          } else if ($scope.initList[i] && $scope.userData[i]){
            $scope.userData[i] = $scope.initList[i];
            $scope.userData.$save(i);
          }
        }

        for(i=0; i < $scope.userData.length; i++){
          if($scope.userData[i] && !$scope.initList[i]){
            $scope.userData.$remove(i);
          }
        }
      }

      $scope.erasePlan = function(){
        for(i=$scope.userData.length; i > -1 ; i--){
          console.log($scope.userData.length + " and " + i);
          $scope.userData.$remove(i);
        }

        $scope.clearAll();
        $route.reload();
      }


​
      $scope.calcLoans = function(){

        $scope.isError = false;
        $scope.errorMessage = [];
​
        //Clear the loanList array and the final output array
        $scope.loanList = [];
        $scope.finalOutput = [];
        $scope.columns = [];
​
        for(j=0; j < $scope.initList.length; j++){
          $scope.loanList.push(
            {
              date: moment().format("MMMM YYYY"),
              calcDesc: $scope.initList[j].desc.toUpperCase(),
              calcBalance: parseFloat(numeral().unformat($scope.initList[j].balance)),
              calcIntRate: parseFloat($scope.initList[j].intRate),
              calcPayment: parseFloat(numeral().unformat($scope.initList[j].payment)),
              staticPayment: parseFloat($scope.initList[j].payment),
              paidOff: false
            })
​
          //Arrange all objects in loanList by interest rate by highest to lowest
          $scope.loanList.sort(sortInt);
          function sortInt(a, b) {
          return b.calcIntRate-a.calcIntRate;
          };
        }
​
        termCalc($scope.loanList);

        if(!$scope.isError){
          $scope.updatePlan();
        }
        initCopy = $scope.initList.slice();

        createColumns($scope.loanList);
​
        $scope.showPlan = true;
        $scope.showForm = false;
​
        function termCalc(loanList){
​
          var totalBalance = 0;
          var totalSnowball = 0;
          var paidOff = false;
          var monthlyTotal = 0;
          var monthsToAdd = 1;
          var lastMonthsTotalBalance;
​
          for(i=0; i < loanList.length; i++){
            totalBalance += loanList[i].calcBalance;
          }
​
          for(i=0; i < loanList.length; i++){
            monthlyTotal += $scope.loanList[i].staticPayment;
          }
​
          while(totalBalance > 0){
​
            $scope.finalOutput.push(
              [moment($scope.loanList[0].date, "MMMM YYYY").add(monthsToAdd, 'months').format("YYYY MMM")]
            )
​
            monthsToAdd++;
​
            recalculatePayments();
            function recalculatePayments(){
​
              var newMonthContainer = 0;
​
              //Determine the default payment amount for every item in the current month
              for(i=0; i < loanList.length; i++){
                //If the payment is higher than the balance, this months payment is only equal to the balance.
                if(loanList[i].calcPayment > loanList[i].calcBalance){
                  loanList[i].calcPayment = loanList[i].calcBalance;
                  loanList[i].paidOff = true;
                }
              }
​
              //Determine what is left of the monthly total BEFORE snowball payments are applied
              for(i=0; i < loanList.length; i++){
                //Now that the initial monthly payments have been calculated, find the difference between
                //the "new total" and the original monthly total.
                newMonthContainer += loanList[i].calcPayment;
              }
​
              finalPayment = true;
​
              //Determine if this is the final payments
              for(i=0; i < loanList.length; i++){
                if(!loanList[i].paidOff){
                  finalPayment = false;
                }
              }
              //The total snowball payment equals whatever is left over
              totalSnowball = monthlyTotal - newMonthContainer;
              if(totalSnowball > 0 && !finalPayment){
                for(i=0; i < loanList.length; i++){
                  if(!loanList[i].paidOff){
                    loanList[i].calcPayment += totalSnowball;
                    recalculatePayments();
                  }
                }
              }
            };
​
            var placeholderArray = [];
​            var newMonthlyTotal = 0;

            for(i=0; i < loanList.length; i++){
              //Make a payment
            ​
              newMonthlyTotal += $scope.loanList[i].calcPayment;
              lastMonthsTotalBalance = totalBalance;
            ​
              var monthInt = loanList[i].calcIntRate / 1200;
              var monthlyIntPmt = loanList[i].calcBalance * monthInt;
              var principal = loanList[i].calcPayment - monthlyIntPmt;
            ​
              if(loanList[i].calcPayment > loanList[i].calcBalance){
                loanList.calcBalance = 0;
              }
            ​
              if(loanList[i].calcPayment > totalBalance){
                totalBalance = 0;
              }
            ​
              $scope.finalOutput[$scope.finalOutput.length - 1].push(
                "$" + loanList[i].calcPayment.toFixed(2)
              )
            ​
              placeholderArray.push(
                "$" + loanList[i].calcPayment.toFixed(2)
              )
            ​
              if(loanList[i].calcBalance > loanList[i].calcPayment){
                loanList[i].calcBalance -= principal.toFixed(2);
                totalBalance -= principal.toFixed(2);
              } else {
                loanList[i].calcBalance -= loanList[i].calcPayment;
                totalBalance -= loanList[i].calcPayment;
              }
            ​
              if (loanList[i].calcBalance < 0.01){
                loanList[i].calcBalance = 0;
              }
            ​
              if (totalBalance < 0.01) {
                totalBalance = 0;
              }
            }

            $scope.finalOutput[$scope.finalOutput.length - 1].push(
              "$" + numeral(newMonthlyTotal).format('0,0.00')
            )
            ​

            var isCompleted = true;

            for (i=0; i < placeholderArray.length; i++){
            ​

            ​
              if(placeholderArray[i] != "$0.00"){
                isCompleted = false;
              }
            }

            if(isCompleted){
              totalBalance = 0;
            }
            ​
            if(monthsToAdd > 600){
              $scope.errorMessage.push("With the current debt information provided, the number of months required to pay off " +
              "this debt has exceeded 600. Please consider increasing payments.");
              $scope.isError = true;
              totalBalance = 0;
              $scope.clearAll();
              $scope.showForm = true;
            }
          }
        };
      function createColumns(loanList){
​
        $scope.columns.push(
          { title: "MONTH" }
        );
​
        for(j=0; j < loanList.length; j++){
          $scope.columns.push(
            { title: loanList[j].calcDesc }
          );

          $scope.columns.push(
            { title: "TOTAL" }
          );
          console.log($scope.columns);
        }
      };
    };
  }
]);
