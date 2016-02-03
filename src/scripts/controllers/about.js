angular
  .module('AboutController', [
    'ui.bootstrap',
    'ngAnimate',
  ])
  .controller('AboutController', [
    '$scope',
    function($scope) {
      $scope.myInterval = 5000;
      $scope.noWrapSlides = false;
      var currIndex = 0;

      $scope.slides = [];
      $scope.slides.push(
        {
          title: 'Live Debt Free',
          text: 'A possibility for everyone',
          image: '/images/macbook-tea-1.jpg',
          button: 'Learn More'
        },
        {
          title: 'Free Financial Resources',
          text: 'Checkout our blog for resources and tips',
          image: '/images/bussiness_man.jpg',
          button: 'Learn More'
        },
        {
          title: 'Your Custom Plan',
          text: 'Start your debt elimination plan today',
          image: '/images/planner.jpg',
          button: 'Learn More'
        }
      );


      $scope.testimonials = [];
      //this data could be made dynamic
      $scope.testimonials.push(
        {
          text: 'Ut auctor et lacinia. Nam felis lorem, ex nec, viverra malesuada ligula. Aenean lorem metus, ullamcorper ac magna at, luctus pulvinar ante. Vestibulum sit amet pharetra diam, nec placerat magna. Nullam pretium feugiat ex, id scelerisque quam rutrum ut. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris sodales gravida libero feugiat iaculis.',
          name: 'John Doe',
          image: '/images/person2.jpg',
        },
        {
          text: 'Ut auctor imperdiet erat et lacinia. Nam felis lorem, euismod laoreet ex nec, viverra malesuada ligula. Mauris sodales gravida libero feugiat iaculis.',
          name: 'Jane Doe',
          image: '/images/person3.jpg',
        },
        {
          text: 'Aenean lorem metus, ullamcorper ac magna at, luctus pulvinar ante. Vestibulum sit amet pharetra diam, nec placerat magna. Nullam pretium feugiat ex, id scelerisque quam rutrum ut. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris sodales gravida libero feugiat iaculis.',
          name: 'John Doe',
          image: '/images/person1.jpg',
        }
      );

      $scope.showNext = function(){
          var index = ($('#myCarousel .active').index()+1)%(slides.length);
          var modIndex = (((index)%(slides.length))+(slides.length))%(slides.length);
          $scope.slides[modIndex].active=true;
      };
      $scope.showPrev = function(){
          var index = ($('#myCarousel .active').index()-1)%(slides.length);
          var modIndex = (((index)%(slides.length))+(slides.length))%(slides.length);
          $scope.slides[modIndex].active=true;
      };
    },
  ]);
