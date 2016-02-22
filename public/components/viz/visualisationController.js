angular.module('vizModule')
  .controller('visualisationCtrl', [
    '$scope',
    '$window',
    '$log',
    'projectsData',

    function ($scope, $window, $log, projectsData) {
      
      var promise = projectsData.getData();
      promise.then(function(data) { 
          //$log.log(projectsData.projectNames);
          var dnit = $window.Init(data);
          var PM = new ProjectManager(dnit[0], dnit[1]);
          $window.ProjectManager = PM;
          
      });

  }])


