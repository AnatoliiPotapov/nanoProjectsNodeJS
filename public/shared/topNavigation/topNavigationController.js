angular.module('inspinia')
  .controller('TopNavigationCtrl', [
    '$scope',
    '$state',
    'auth',
    function($scope, $state, auth){

      $scope.user = auth.currentUser();

      $scope.logOut = function() {
        auth.logOut();
        $state.go('login');
      };

  }]);
