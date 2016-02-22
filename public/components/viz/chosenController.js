angular.module('vizModule')
  .controller('chosenCtrl', [
    '$rootScope',
    '$scope',
    '$http',
    'projectsData',
    '$log',
    '$window',

    function ($rootScope, $scope, $http, projectsData, $log, $window) {

      var promise = projectsData.getData();
      promise.then(function(data) { 

        var names = projectsData.projectNames;
        var choices = [];
      
        for (var index = 0; index < names.length; index++) {
          choices.push({"id":index, "name":names[index]});
        };

        $scope.recipientsList = choices; 

        $scope.update = function() {
          name = $scope.recipients.name;
          $window.ProjectManager.GoToName(name);
          $log.log("Fucking update:  ", name);
        }

      });

    }
  ])


