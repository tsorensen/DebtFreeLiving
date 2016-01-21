angular
.module('renderHtmlFilter', [])
.filter('renderHtml', [
  '$sce',
  function($sce) {
    return $sce.trustAsHtml;
  }
]);
