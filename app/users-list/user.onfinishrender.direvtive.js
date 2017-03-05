angular.
module('usersList')
  .directive('onFinishRender', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attributes) {
      console.log(scope.$last);
      if (scope.$last === true) {
        $timeout(function () {
          alert('All users were successfully downloaded!');
        });
      }
    }
  }
});
