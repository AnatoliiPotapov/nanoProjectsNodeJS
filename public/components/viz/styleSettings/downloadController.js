  angular.module('vizModule')

    .controller('downloadCtrl', [
        '$scope',

        function ($scope) {

          $scope.downloadSVG = function() {
            saveSvgAsPng($("svg")[0], "NanoProjects.png");
          };

    }]);