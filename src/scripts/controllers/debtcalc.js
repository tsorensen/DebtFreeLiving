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
              staticPayment: parseFloat($scope.initList[j].payment)
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
          var paidOff = false;

          for(k=0; k < loanList.length; k++){
            totalBalance += loanList[k].calcBalance;
          }

          while(!paidOff){
            //As long as the total balance is anything higher than 0, push a new object to the array that will contain
            //an array of additional objects including the description and the payment owed.

            if(totalBalance <= 0){
              paidOff = true;
            }

            $scope.finalOutput.push(
                [$scope.finalOutput.length + 1]
            )

            for(j=0; j < loanList.length; j++){

              var monthInt = loanList[j].calcIntRate / 1200;
              var monthlyIntPmt = loanList[j].calcBalance * monthInt;
              $scope.loanList[j].principal = loanList[j].calcPayment - monthlyIntPmt;
              var payment = loanList[j].calcPayment;
              var snowballPayment = 0;
              var tempSnowball = 0;


              //Determine how much is owed for the month
              if(loanList[j].calcBalance < $scope.loanList[j].principal && loanList[j].calcBalance > 0){
                tempSnowball = loanList[j].calcPayment - loanList[j].calcBalance;
                $scope.loanList[j].thisMonthsPayment = loanList[j].calcBalance;
                if(tempSnowball < 0) {
                  tempSnowball = 0;
                }
              } else if (loanList[j].calcBalance < $scope.loanList[j].principal && loanList[j].calcBalance <= 0) {
                $scope.loanList[j].thisMonthsPayment = 0;
                tempSnowball = payment;
                console.log("Hit!!!!!");
              } else {
                $scope.loanList[j].thisMonthsPayment = payment;
                tempSnowball = 0;
              };

              snowballPayment += tempSnowball;

              loanList[j].alreadySnowballed = false;

              for(n=0; n < loanList.length; n++){
                if(!loanList[j].alreadySnowballed && loanList[n].calcBalance > 0){
                  loanList[n].calcPayment = loanList[n].staticPayment + snowballPayment;
                  loanList[j].alreadySnowballed = true;
                  console.log(j + " Snowball: " + snowballPayment);
                }
              }
            }


            for(m=0; m < loanList.length; m++){
              //Make a payment
              $scope.finalOutput[$scope.finalOutput.length - 1].push(
                $scope.loanList[m].thisMonthsPayment
              );

              loanList[m].calcBalance -= $scope.loanList[m].principal;
              totalBalance -= $scope.loanList[m].principal;
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
