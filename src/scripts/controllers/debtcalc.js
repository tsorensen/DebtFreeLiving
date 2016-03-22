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

        //Loop through the initList array
        for(j=0; j < $scope.initList.length; j++){

          //Function takes form info and pushes it into the loanList array
          $scope.loanList.push(
            {
              calcDesc: $scope.initList[j].desc.toUpperCase(),
              calcBalance: parseFloat($scope.initList[j].balance),
              calcIntRate: parseFloat($scope.initList[j].intRate),
              calcPayment: parseFloat($scope.initList[j].payment),
              staticPayment: parseFloat($scope.initList[j].payment)
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

          for(k=0; k < loanList.length; k++){
            totalBalance += loanList[k].calcBalance;
          }

          while(totalBalance > 0){
            //As long as the total balance is anything higher than 0, push a new object to the array that will contain
            //an array of additional objects including the description and the payment owed.
            $scope.finalOutput.push(
                [$scope.finalOutput.length + 1]
                    )

            for(j=0; j < loanList.length; j++){

              var monthInt = loanList[j].calcIntRate / 1200;
              var monthlyIntPmt = loanList[j].calcBalance * monthInt;
              var principal = loanList[j].calcPayment - monthlyIntPmt;
              var payment = loanList[j].calcPayment;

              //If the principal payment is less than or equal to 0, return an error

              //var principal = loanList[j].calcPayment;
              var thisMonthsPayment;
              var snowballPayment;

              //Determine how much is owed for the month
              if(loanList[j].calcBalance < principal && loanList[j].calcBalance > 0){
                snowballPayment = loanList[j].calcPayment - loanList[j].calcBalance;
                thisMonthsPayment = loanList[j].calcBalance;
                if(snowballPayment < 0) {
                  snowballPayment = 0;
                }
                console.log(j + "-" + $scope.finalOutput.length + "Snowball Collected: " + snowballPayment);
                console.log(thisMonthsPayment + " - " + loanList[j].calcBalance + " = " +  snowballPayment );
              } else if (loanList[j].calcBalance < principal && loanList[j].calcBalance <= 0) {
                thisMonthsPayment = 0;
                snowballPayment = payment;
              } else {
                thisMonthsPayment = payment;
                snowballPayment = 0;
              };

              //Make a payment
              $scope.finalOutput[$scope.finalOutput.length - 1].push(
                thisMonthsPayment
              );

              loanList[j].calcBalance -= principal;
              totalBalance -= principal;

              if(loanList[j+1] != undefined){
                loanList[j + 1].calcPayment = loanList[j+1].staticPayment + snowballPayment;
                console.log(j + " - " + $scope.finalOutput.length + "Snowball distributed :" + snowballPayment);
              }
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
