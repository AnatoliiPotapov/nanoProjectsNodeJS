angular.module('vizModule')
  .factory('projectsData',['$http', '$window', '$log', function($http, $window, $log) {

    var o = {
      jsonContent:null,
      projectNames:[]
    };

    o.getData = function() {
      return $http.get('json.json').then(function(result){
        o.jsonContent = result.data;

        // getting names 
        o.jsonContent.forEach(function(project){
          o.projectNames.push(project.name);
        })

        return result.data;
      })
    }  

    return o;
  }]);
