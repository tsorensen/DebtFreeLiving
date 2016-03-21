angular
  .module('DebtCalcController', [

  ])
  .controller('DebtCalcController', [
    '$scope',
    function($scope) {

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

        //Loop through the initList array
        for(j=0; j < $scope.initList.length; j++){

          //Function takes form info and pushes it into the loanList array
          $scope.loanList.push(
            {
              calcDesc: $scope.initList[j].desc,
              calcBalance: parseFloat($scope.initList[j].balance),
              calcIntRate: parseFloat($scope.initList[j].intRate),
              calcPayment: parseFloat($scope.initList[j].payment),
            })

          //Arrange all objects in loanList by interest rate by highest to lowest
          $scope.loanList.sort(sortInt);
          function sortInt(a, b) {
          return b.calcIntRate-a.calcIntRate;
          };

          //Add or recalculate the following for each object in loanList: 1) Each item's current index, 2) the payment amount as well as the term of the previous object, 3) Each object's "second payment" amount, equal to the payment plus the previous loan's payment.
          for(i = 0; i < $scope.loanList.length; i++){
            $scope.loanList[i].thisIndex = i;
            if(i === 0){
              $scope.loanList[i].prevPayment = 0;
              $scope.loanList[i].prevTerm = 0;
              $scope.loanList[i].finishedPayment = $scope.loanList[i].calcPayment;
            } else {
              $scope.loanList[i].finishedPayment = $scope.loanList[i-1].finishedPayment + $scope.loanList[i].calcPayment;
              $scope.loanList[i].prevPayment = $scope.loanList[i-1].finishedPayment;
              $scope.loanList[i].prevTerm = $scope.loanList[i-1].calcTerm;
            }
          };
        }

        termCalc($scope.loanList);

        //Calculate the term of every object.
        function termCalc(loanList){

          var totalBalance = 0;

          for(k=0; k < loanList.length; k++){
            totalBalance += loanList[k].calcBalance;
          }

          console.log("Total balance: " + totalBalance);

          while(totalBalance > 0){
            //As long as the total balance is anything higher than 0, push a new object to the array that will contain
            //an array of additional objects including the description and the payment owed.
            $scope.finalOutput.push(
                [$scope.finalOutput.length + 1]
                    )

            for(j=0; j < loanList.length; j++){

              var monthInt = loanList[j].calcIntRate / 1200;

              //If the life of the current loan is lower than the life of the loan with the previous index, add the regular payment.
              var monthlyIntPmt = loanList[j].calcBalance * monthInt;
              var principal = loanList[j].calcPayment - monthlyIntPmt;

              //If the principal payment is less than or equal to 0, return an error
              if(principal <= 0) {
                $scope.errorAmount = monthlyIntPmt + 1;
                $scope.errorMessage = "ERROR: The interest collected on \"" + $scope.loanList[i].calcDesc + "\" (Debt #"+[i + 1]+") is higher than the payment amount. To add this debt to your elimination plan, your monthly payment must be $" + $scope.errorAmount + " or higher.";
                $scope.loanList.splice(loanList[j].thisIndex, 1);
              }

              else if(principal > 0){
                loanList[j].calcBalance -= principal;
                $scope.errorMessage = null;
                $scope.errorAmount = null;

                var finalPayment = 0;
                var snowballPayment = 0;

                if(loanList[j].calcBalance < loanList[j].calcPayment){
                  finalPayment = loanList[j].calcPayment - loanList[j].calcBalance;
                  snowballPayment = loanList[j].calcPayment - finalPayment;
                  if(loanList[j+1]){
                    loanList[j + 1].calcPayment += snowballPayment;
                  }
                  loanList[j].calcPayment = 0;
                }

                $scope.finalOutput[$scope.finalOutput.length - 1].push(
                  loanList[j].calcPayment
                );
              }
            }
          }
        };
      };
    }
  ]);
