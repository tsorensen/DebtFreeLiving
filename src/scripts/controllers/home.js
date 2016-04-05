angular
  .module('HomeController', [
    'ui.bootstrap',
    'ngAnimate',
  ])
  .controller('HomeController', [
    '$scope',
    function($scope) {
      $scope.myInterval = 5000;
      $scope.noWrapSlides = false;
      var currIndex = 0;

      $scope.homeSlides = [];
      $scope.homeSlides.push(
        {
          title: 'Custom Planner',
          class: 'off-center',
          text: 'Are you ready to live debt free?',
          image: '/images/planner.jpg',
          button: 'Sign Up',
          link: '/#/login'
        },
        {
          title: 'Advice and Tips',
          class: 'off-center',
          text: 'Checkout our blog for advice from our experts',
          image: '/images/bussiness_man.jpg',
          button: 'Visit Blog',
          link: '/#/blog'
        },
        {
          title: 'Backed by Professionals',
          class: '',
          text: 'Learn more about us',
          image: '/images/macbook-tea-1.jpg',
          button: 'Learn More',
          link: '/#/about'
        }
      );


      $scope.testimonialsSlides = [];
      //this data could be made dynamic
      $scope.testimonialsSlides.push(
        {
          text: 'You need a financial plan for your debt obligations!  Our secure self-help debt elimination calculator can help you create a plan for all of your debt related accounts.  This will assist you in creating an effective budget and make your debt installments and payments as efficient as possible.  Would you like to get ahead of your outstanding debts and pay them off early, including your mortgage? There is no better time to get started than right now! Create a free, secure account to manage all of your debts and pay them off early. Debtfreeliving.com provides excellent debt management tools and education.',
          // name: 'John Doe',
          image: '/images/person2.jpg',
        },
        {
          text: 'Would you like to live providently? To us, this includes using common sense strategies to become completely debt free. We want to help you completely eliminate your mortgage payments, personal loans and other debt obligations. Find useful and effective debt elimination tips and solutions by reading our Debt Free Living Blog, and signing up for the Debt Elimination Calculator today!  It’s secure, free and customizable.',
          // name: 'Jane Doe',
          image: '/images/person3.jpg',
        },
        {
          text: 'There is nothing that secures your financial future more than being completely debt free.  Say goodbye to all of your debt related liabilities by eliminating your debts early. You have a guaranteed “return on investment” when you pay off your debts, equal to the interest rate being charged. Don’t be a slave to the banks any more.  Protect your cash, assets and lifestyle by becoming completely debt free. Eliminating debt will help you manage your income so that you can save and invest in your future. Our expert professional advice and tools will assist you in living within your means and protect your future.',
          // name: 'John Doe',
          image: '/images/person1.jpg',
        }
      );

      $scope.showNext = function(name){
          var index = ($('#' + name + '-carousel .active').index()+1)%($scope[name + 'Slides'].length);
          var modIndex = (((index)%($scope[name + 'Slides'].length))+($scope[name + 'Slides'].length))%($scope[name + 'Slides'].length);
          $scope[name + 'Slides'][modIndex].active=true;
      };

      $scope.showPrev = function(name){
          var index = ($('#' + name + '-carousel .active').index()-1)%($scope[name + 'Slides'].length);
          var modIndex = (((index)%($scope[name + 'Slides'].length))+($scope[name + 'Slides'].length))%($scope[name + 'Slides'].length);
          $scope[name + 'Slides'][modIndex].active=true;
      };
    },
  ]);
