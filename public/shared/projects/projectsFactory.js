
angular.module('Projects')
  .factory('projects',['$http', '$window',  function($http, $window) {

    var o = {
      projectsArray:[]
    };

    var timeNow = Date.now();
    var testExperiment = {
   		status: "Активен",
   		name: "exp2",
      shortDescription: "Описание",
   		dateCreate: "Fri Jan 08 2016 00:00:00 GMT+0300 (MSK)",
   		dateActual: "Fri Jan 08 2016 00:00:00 GMT+0300 (MSK)",
   		filename: "xxx.xxx"
    }

    o.addExperiment = function(data){
      o.create(data);
    };

    o.getAll = function() {
      return $http.get('/posts').success(function(data){
        angular.copy(data, o.projectsArray);
      });
    };

    o.create = function(post) {
      return $http.post('/posts', post).success(function(data){
        o.projectsArray.push(data);
      });
    };

    o.delete = function(post) {
      return $http.delete('/posts/'+post._id+'/delete').success(function(){
        o.getAll();
      });
    };

    return o;
  }]);
