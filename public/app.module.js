/**
 * INSPINIA - Responsive Admin Theme
 *
 */


(function () {
    angular.module('inspinia', [
        'ui.router',
        'oc.lazyLoad',
        'ui.bootstrap',
        'Auth'
    ]);

    /**
     * MainCtrl - controller
     */
    function MainCtrl() {

        this.userName = 'Example user';
        this.helloText = 'Welcome in SeedProject';
        this.descriptionText = 'It is an application skeleton for a typical AngularJS web app. You can use it to quickly bootstrap your angular webapp projects and dev environment for these projects.';

    };



    angular
        .module('inspinia')
        .controller('MainCtrl', MainCtrl)
        .controller('NavCtrl', [
        '$scope',
        'auth',
        function($scope, auth){
          $scope.isLoggedIn = auth.isLoggedIn;
          $scope.currentUser = auth.currentUser;
          $scope.logOut = auth.logOut;
        }]);

})();
