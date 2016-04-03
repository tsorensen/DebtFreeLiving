angular
  .module('DebtCalcController', [
    'blogApp.auth'
  ])
  .controller('DebtCalcController', [
    '$scope',
    'auth',
    function($scope, auth) {
      if(!auth.isLoggedIn()) {
        $location.url('/login')
      }

      var table;
      $scope.columns = [];

      $scope.date = moment().month(3).format("MMMM YYYY");
      //$scope.adjustedDate =
      //Hide table until values are entered
      var showTable = true;

      //Create an array to hold information from user inputs
      $scope.initList = [];

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
      };

      $scope.removeLoan = function(k){
        $scope.initList.splice(k, 1);
      };

      //Function to add loan objects to the loan list above
      $scope.calcLoans = function(){

        //Clear the loanList array and the final output array
        $scope.loanList = [];
        $scope.finalOutput = [];
        $scope.columns = [];

        //Loop through the initList array
        for(j=0; j < $scope.initList.length; j++){

          //Function takes form info and pushes it into the loanList array
          $scope.loanList.push(
            {
              calcDesc: $scope.initList[j].desc.toUpperCase(),
              calcBalance: parseFloat($scope.initList[j].balance),
              calcIntRate: parseFloat($scope.initList[j].intRate),
              calcPayment: parseFloat($scope.initList[j].payment),
              staticPayment: parseFloat($scope.initList[j].payment),
              thisMonthsPayment: parseFloat($scope.initList[j].payment),
              snowballPayment: 0,
              currentSnowball: false,
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

        //Calculate the term of every object.
        function termCalc(loanList){

          var totalBalance = 0;
          var totalSnowball = 0;
          var paidOff = false;
          var monthlyTotal = 0;

          for(i=0; i < loanList.length; i++){
            totalBalance += loanList[i].calcBalance;
          }

          for(i=0; i < loanList.length; i++){
            monthlyTotal += $scope.loanList[i].staticPayment;
          }

          while(totalBalance > 0){

            //Adds month as the first item in the array
            $scope.finalOutput.push(
                [$scope.finalOutput.length + 1]
            )

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
              console.log("Hit");
              if(totalSnowball > 0 && !finalPayment){
                for(i=0; i < loanList.length; i++){
                  if(!loanList[i].paidOff){
                    loanList[i].calcPayment += totalSnowball;
                    recalculatePayments();
                  }
                }
              }
            };
;
            for(i=0; i < loanList.length; i++){
              //Make a payment

              $scope.finalOutput[$scope.finalOutput.length - 1].push(
                loanList[i].calcPayment
              )

              var monthInt = loanList[i].calcIntRate / 1200;
              var monthlyIntPmt = loanList[i].calcBalance * monthInt;
              var principal = loanList[i].calcPayment - monthlyIntPmt;

              loanList[i].calcBalance -= $scope.loanList[i].calcPayment;
              totalBalance -= $scope.loanList[i].calcPayment;
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
