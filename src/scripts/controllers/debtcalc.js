angular
  .module('DebtCalcController', [

  ])
  .controller('DebtCalcController', [
    '$scope',
    function($scope) {

      $scope.initList = [];

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

      //Function to add loan objects to the loan list above
      $scope.calcLoans = function(){

        //Clear the loanList array
        $scope.loanList = [];

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

            //Calculate or recalculate term length of each object
            $scope.loanList[i].calcTerm = termCalc(
              $scope.loanList[i].calcBalance,
              $scope.loanList[i].calcIntRate,
              $scope.loanList[i].calcPayment,
              $scope.loanList[i].prevTerm,
              $scope.loanList[i].finishedPayment,
              $scope.loanList[i].thisIndex
            )
            console.log("hit 3: " + $scope.loanList[$scope.loanList.length -1].calcDesc);
          };
        }


        //Calculate the term of every object.
        function termCalc(newBal, newInt, newPymnt, previousTerm, finishedPymnt, itemIndex){
        var termLength = 0;
        var monthInt = newInt / 1200;
        var theBal = newBal;
        while(theBal > 0){
          //If the life of the current loan is lower than the life of the loan with the previous index, add the regular payment.
          if (termLength <= previousTerm || itemIndex === 0){
            var monthlyIntPmt = theBal * monthInt;
            var principal = newPymnt - monthlyIntPmt;
            if(principal <= 0) {
              $scope.errorAmount = monthlyIntPmt + 1;
              $scope.errorMessage = "ERROR: The interest collected on this debt is higher than the payment amount. To add this debt to your elimination plan, your monthly payment must be $" + $scope.errorAmount + " or higher.";
              $scope.loanList.splice(itemIndex, 1);
              theBal = 0;
            } else if(principal > 0){
            theBal -= principal;
            termLength++;
            $scope.errorMessage = null;
            $scope.errorAmount = null;
            }
          } else if (termLength > previousTerm){
            //If the life of the current loan is higher than the life of the loan with the previous index, add the second payment.
            var monthlyIntPmt = theBal * monthInt;
            var principal = finishedPymnt - monthlyIntPmt;
            theBal -= principal;
            termLength++;
            console.log("hit");
            $scope.errorMessage = null;
            $scope.errorAmount = null;
          }
        }
        console.log("Hit 2")
        return termLength;
    };
  };
}

  ]);
