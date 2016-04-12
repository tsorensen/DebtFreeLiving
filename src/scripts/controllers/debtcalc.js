angular
  .module('DebtCalcController', [
    'blogApp.auth',
    'chart.js',
  ])
  .controller('DebtCalcController', [
    '$scope',
    'auth',
    '$firebaseArray',
    '$timeout',
    function($scope, auth, $firebaseArray, $timeout) {
      var ref = new Firebase("https://resplendent-fire-5282.firebaseio.com/");
      $scope.initList = [{},{}];
      $scope.loadingDash = true;
​
      auth.isLoggedIn()
        .then(function(user) {
            $scope.user = user;
            $scope.userData = $firebaseArray(ref.child("plans").child($scope.user.uid));
​
            $scope.userData.$loaded()
            .then(function(){
              if($scope.userData.length > 0){
                  $scope.initList = $scope.userData;
                  $scope.displayLoans();
              } else {
                $scope.loadingDash = false;
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
      var table;
​
      $scope.columns = [];
​
      var showTable = true;
​
      $scope.showRemoveBtn = false;
      $scope.showForm = true;
      $scope.showPlan = false;
      $scope.finalOutput = [];
      $scope.loanList = [];
      $scope.errorMessage = null;
      $scope.errorAmount = null;

      //graph variables
      $scope.graphLabels = [];
      $scope.data = [];
      $scope.graphData = [];
      $scope.graphSeries = [];
      $scope.graphPie = [];
      $scope.graphDonut = [];
​
      $scope.addLoans = function(){
        $scope.initList.push(
          {}
        )
​
        if($scope.initList.length > 2 || $scope.userData > 2){
          $scope.showRemoveBtn = true;
        }
      };
​
      $scope.removeLoan = function(k){
        $scope.initList.splice(k, 1);
​
        if($scope.initList.length < 3){
          $scope.showRemoveBtn = false;
        }
      };
​
      $scope.editPlan = function(){
        $scope.showForm = true;
      };
​
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
      };
​
      $scope.clearAll = function(){
        $scope.initList = [{},{}];
        $scope.loanList = [];
        $scope.finalOutput = [];
        $scope.colums = [];
        $scope.showForm = true;
        if(table){ table.destroy(); }
        //table.draw();
        $scope.showPlan = false;
      };
​
      $scope.displayLoans = function(){
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
          }
        }
​
        termCalc($scope.loanList);
        createColumns($scope.loanList);
​
        if(table){ table.destroy(); }
​
        $.fn.dataTable.ext.errMode = 'none';
        table = $('#outputTable').DataTable( {
            "searching": false,
            "ordering": false,
            "stripeClasses": [ 'strip1', 'strip2' ],
            data: $scope.finalOutput,
            columns: $scope.columns
        } );


        //get graph data from finalOutput, create data and labels arrays,
        //remove months from data array
        for(var i = 0; i < 6; i++) {
          $scope.data[i] = $scope.finalOutput[i];
          $scope.graphLabels.push($scope.data[i][0]);

          //don't need month for data array
          $scope.data[i].splice(0, 1);
          for(var j = 0; j < $scope.data[i].length; j++) {
            //remove $ sign
            $scope.data[i][j] = parseFloat($scope.data[i][j].substring(1));
          }
        }

        for(var i = 0; i < $scope.initList.length; i++) {
          //fill in series data
          $scope.graphSeries.push($scope.initList[i].desc);
          //get pie totals
          $scope.graphPie.push($scope.initList[i].balance);

          //get donut totals (calc interest)
          var monthlyRate = parseFloat($scope.initList[i].intRate) / 12;
          $scope.graphDonut.push((parseFloat($scope.initList[i].balance) * monthlyRate / 100).toFixed(2));

          $scope.graphData.push([]);
          for(var j = 0; j < $scope.data.length; j++) {
            $scope.graphData[i].push($scope.data[j][i]);
          }
        }

​         //done loading
        $scope.loadingDash = false;
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
            /*if(totalBalance == lastMonthsTotalBalance){
              totalBalance = 0;
            }*/
​
            $scope.finalOutput.push(
              [moment($scope.loanList[0].date, "MMMM YYYY").add(monthsToAdd, 'months').format("YYYY MMM")]
            );
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
            var newMonthlyTotal = 0;
​
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
            );
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
      }

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
        }

        $scope.columns.push(
          { title: "TOTAL" }
        );
      }
    };



    //graph options - temp donut data
    $scope.graphOptions = {
      tooltipTemplate: "<%=label%>: <%= '$' + value %>",
      multiTooltipTemplate: "<%=datasetLabel%>: <%= '$' + value %>",
    };
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


  }
]);
