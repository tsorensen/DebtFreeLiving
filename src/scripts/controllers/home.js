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
