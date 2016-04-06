angular
  .module('DebtCalcController', [
    'blogApp.auth'
  ])
  .controller('DebtCalcController', [
    '$scope',
    'auth',
    '$firebaseArray',
    function($scope, auth, $firebaseArray) {

      var ref = new Firebase("https://resplendent-fire-5282.firebaseio.com/");

      $scope.initList = [{},{}];

      auth.isLoggedIn()
        .then(function(user) {
            $scope.user = user;
            $scope.userData = $firebaseArray(ref.child("plans").child($scope.user.uid));

            $scope.userData.$loaded()
            .then(function(){
              if($scope.userData.length > 0){
                  $scope.initList = $scope.userData;
                  console.log($scope.initList);
              }
            });


        })
        .catch(function(error) {
          console.log('Error in retreiving logged in data: ', error);
        });

      //console.log($scope.initList[0].desc);

      var table;

      $scope.columns = [];

      //$scope.adjustedDate =
      //Hide table until values are entered

      var showTable = true;

      $scope.showRemoveBtn = false;

      $scope.showForm = true;

      $scope.showPlan = false;

      //Create an array to hold information from user inputs


      //Create an array for the final output
      $scope.finalOutput = [];

      //Create an array to hold information for each loan
      $scope.loanList = [];

      //A bucket for potential error messages
      $scope.errorMessage = null;
      $scope.errorAmount = null;

      //Function to add a loan to the list when the "add loan" button is clicked.
      $scope.addLoans = function(){
        $scope.initList.push(
          {}
        )

        if($scope.initList.length > 2){
          $scope.showRemoveBtn = true;
        }
      };

      $scope.removeLoan = function(k){
        $scope.initList.splice(k, 1);

        if($scope.initList.length < 3){
          $scope.showRemoveBtn = false;
        }
      };

      $scope.editPlan = function(){
        $scope.showForm = true;
      }

      $scope.resetPlan = function(){
        BootstrapDialog.show({
            type: BootstrapDialog.TYPE_DANGER,
            title: 'Reset Plan',
            label: 'small',
            message: 'Your Debt-Elimination Plan will be ERASED. This action cannot be undone.',
            buttons: [{
                label: 'Cancel',
                action: function(dialogItself){
                  dialogItself.close();
                }
            }, {
                label: 'Clear Plan and Reset',
                cssClass: 'btn-danger',
                action: function(dialogItself){
                  $scope.clearAll();
                  dialogItself.close();
                }
            }]
        });
      }

      $scope.clearAll = function(){
        $scope.initList = [{},{}];
        $scope.loanList = [];
        $scope.finalOutput = [];
        $scope.colums = [];
        $scope.showForm = true;
        if(table){ table.destroy(); }
        table.draw();
        $scope.showPlan = false;
      };

      //Function to add loan objects to the loan list above
      $scope.calcLoans = function(){

        for(i = 0; i < $scope.initList.length; i++){
          $scope.userData.$add($scope.initList[i]);
        }

        //$scope.userData.$add($scope.initList);

        $scope.showForm = false;

        //Clear the loanList array and the final output array
        $scope.loanList = [];
        $scope.finalOutput = [];
        $scope.columns = [];

        //Loop through the initList array
        for(j=0; j < $scope.initList.length; j++){

          //Function takes form info and pushes it into the loanList array
          $scope.loanList.push(
            {
              date: moment().format("MMMM YYYY"),
              calcDesc: $scope.initList[j].desc.toUpperCase(),
              calcBalance: parseFloat($scope.initList[j].balance),
              calcIntRate: parseFloat($scope.initList[j].intRate),
              calcPayment: parseFloat($scope.initList[j].payment),
              staticPayment: parseFloat($scope.initList[j].payment),
              paidOff: false
            })

          //Arrange all objects in loanList by interest rate by highest to lowest
          $scope.loanList.sort(sortInt);
          function sortInt(a, b) {
          return b.calcIntRate-a.calcIntRate;
          };
        }

        //Use the termCalc function to get the final output.
        termCalc($scope.loanList);
        createColumns($scope.loanList);

        if(table){ table.destroy(); }

        table = $('#outputTable').DataTable( {
            "searching": false,
            "ordering": false,
            data: $scope.finalOutput,
            columns: $scope.columns
        } );

        $scope.showPlan = true;

        //Calculate the term of every object.
        function termCalc(loanList){

          var totalBalance = 0;
          var totalSnowball = 0;
          var paidOff = false;
          var monthlyTotal = 0;
          var monthsToAdd = 1;
          var lastMonthsTotalBalance;

          for(i=0; i < loanList.length; i++){
            totalBalance += loanList[i].calcBalance;
          }

          for(i=0; i < loanList.length; i++){
            monthlyTotal += $scope.loanList[i].staticPayment;
          }

          while(totalBalance > 0){

            if(totalBalance == lastMonthsTotalBalance){
              totalBalance = 0;
              console.log("Hit!");
            }

            console.log(totalBalance);
            //Adds month as the first item in the array
            $scope.finalOutput.push(
              [moment($scope.loanList[0].date, "MMMM YYYY").add(monthsToAdd, 'months').format("YYYY MMM")]
            )

            monthsToAdd++;

            recalculatePayments();
            function recalculatePayments(){

              var newMonthContainer = 0;

              //Determine the default payment amount for every item in the current month
              for(i=0; i < loanList.length; i++){
                //If the payment is higher than the balance, this months payment is only equal to the balance.
                if(loanList[i].calcPayment > loanList[i].calcBalance){
                  loanList[i].calcPayment = loanList[i].calcBalance;
                  loanList[i].paidOff = true;
                }
              }

              //Determine what is left of the monthly total BEFORE snowball payments are applied
              for(i=0; i < loanList.length; i++){
                //Now that the initial monthly payments have been calculated, find the difference between
                //the "new total" and the original monthly total.
                newMonthContainer += loanList[i].calcPayment;
              }

              finalPayment = true;

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

            var placeholderArray = [];

            for(i=0; i < loanList.length; i++){
              //Make a payment

              lastMonthsTotalBalance = totalBalance;

              var monthInt = loanList[i].calcIntRate / 1200;
              var monthlyIntPmt = loanList[i].calcBalance * monthInt;
              var principal = loanList[i].calcPayment - monthlyIntPmt;

              if(loanList[i].calcPayment > loanList[i].calcBalance){
                loanList.calcBalance = 0;
              }

              if(loanList[i].calcPayment > totalBalance){
                totalBalance = 0;
              }

              $scope.finalOutput[$scope.finalOutput.length - 1].push(
                "$" + loanList[i].calcPayment.toFixed(2)
              )

              placeholderArray.push(
                "$" + loanList[i].calcPayment.toFixed(2)
              )

              loanList[i].calcBalance -= principal.toFixed(2);
              totalBalance -= principal.toFixed(2);

              if (loanList[i].calcBalance < 0.01){
                loanList[i].calcBalance = 0;
              }

              if (totalBalance < 0.01) {
                totalBalance = 0;
              }
            }

            for (i=0; i < placeholderArray.length; i++){

              var isCompleted = true;

              if(placeholderArray[i] != "$0.00"){
                isCompleted = false;
              }
            }            
            if(isCompleted){
              totalBalance = 0;
            }
          }
        };
      function createColumns(loanList){

        $scope.columns.push(
          { title: "MONTH" }
        );

        for(j=0; j < loanList.length; j++){
          $scope.columns.push(
            { title: loanList[j].calcDesc }
          );
        }
      };
    };
  }
]);
