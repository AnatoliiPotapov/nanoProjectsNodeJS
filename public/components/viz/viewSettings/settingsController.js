angular.module('vizModule')
  .controller('settingsCtrl', [
      '$scope',
      '$modal',
      function ($scope, $modal) {

        $scope.open = function (size) {

            var modalInstance = $modal.open({
                templateUrl: 'components/viz/viewSettings/settingsModal.html',
                controller: 'settingsModalCtrl',
                backdrop: false,
                windowTopClass: 'my-modal-popup'
            });
        };

  }])

  .controller('settingsModalCtrl', [
      '$scope',
      '$modalInstance',
      function ($scope, $modalInstance) {

        $scope.close = function(result) {
          $modalInstance.dismiss('close');
        };

        $scope.submit = function() {
          $modalInstance.dismiss('close');
        };

        
  }])

  .directive('modalWindow', function(){
    return {
      restrict: 'EA',
      link: function(scope, element) {
        $(".modal-dialog").draggable();
      }
    }  
  })