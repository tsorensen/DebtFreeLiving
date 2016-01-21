angular
.module('imgPreviewDirective', [
  'AddController',
])
.directive("imgPreview", [
  function(){
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
          var reader = new FileReader();
          reader.onload = function (e) {
              scope.adder.image = e.target.result;
              scope.$apply();
          };

          elem.on('change', function() {
            var name = elem[0].files[0].type;
            var regex = new RegExp("(.*?)\.(jpg|jpeg|JPG|JPEG|png|PNG|tiff|TIFF|gif|GIF)$");
              if(!(regex.test(name))) {
                scope.adder.error = 'Error: File type is not an image. Please select a valid image file.';
                scope.adder.image = '';
                scope.$apply();
              } else {
                reader.readAsDataURL(elem[0].files[0]);
              }
          });
      }
    };
  }
]);
