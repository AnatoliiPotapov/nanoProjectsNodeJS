function dropZone($log) {
    return function(scope, element, attrs) {
        element.dropzone({
            url: "/upload",
            maxFiles: 1,
            maxfilesexceeded: function(file) {
                this.removeAllFiles();
                this.addFile(file);
            },
            maxFilesize: 100,
            paramName: "uploadfile",
            maxThumbnailFilesize: 5,
            init: function() {
                //scope.files.push({file: 'added'});
                this.on('success', function(file, response) {

                  //$log.log(JSON.parse(response).files[0].name);
                  //$log.log("scope.successCallback: ... : ", scope.successCallback);
                  //$log.log("scope.data: ... :", scope.data);

                  scope.data.filename = JSON.parse(response).files[0].name;
                  $log.log("scope.data: ... :", scope.data);

                  /*
                    if (scope.successCallback != null) {
                        scope.successCallback(response, file);
                    }*/
                });
                this.on('addedfile', function(file) {
                    scope.$apply(function(){
                        //alert(file);
                        scope.files.push({file: 'added'});
                    });
                });
                this.on('drop', function(file) {
                    //alert(file);
                });
            }
        });
    }
}

angular.module('inspinia')

    //.directive('dropZone', dropZone)
    .controller('ProjectsFilesListCtrl',[
      '$scope',
      '$log',
      'projects',
      function ($scope, $log, projects) {
        projects.getAll();
        
        $scope.posts = projects.projectsArray;

        $scope.delete = function(post) {
          projects.delete(post);
        };

      }])

    .controller('ModalInstanceCtrl', [
      '$scope',
      '$log',
      '$modalInstance',
      'auth',
      'projects',
      function ($scope, $log, $modalInstance, auth, projects) {

        $scope.data = {};

        $scope.ok = function () {
          $log.log("fsdf");
            //$modalInstance.close();

        };

        $scope.cancel = function () {
          $log.log("fsdf");
          $modalInstance.dismiss('cancel');
        };

        $scope.submit = function() {

          var newProjects = {};
          newProjects.name = $scope.data.name;
          newProjects.status = false;
          newProjects.shortDescription  = $scope.data.shortDescription;
          newProjects.dateActual = $scope.data.dateActual;
          newProjects.dateCreate = new Date();
          newProjects.filename = $scope.data.filename;
          
          $log.log(newProjects);

          projects.addExperiment($scope.data);

          $modalInstance.dismiss('cancel');
        };

        $scope.dropzoneUploaded = function() {
            /*var filename = file.filename;
            var filepath = response.path;
            var object = {
                filename: filename,
                filepath: filepath
            };
            //var updated = DataFct.add(object);*/
              $log.log("Horay");
        }

    }])


    .controller('modalDemoCtrl', [
    '$scope',
    '$modal',
    function ($scope, $modal) {

      $scope.open = function (size) {

          var modalInstance = $modal.open({
              templateUrl: 'components/update/updateCreatePopupView.html',
              size: size,
              controller: 'ModalInstanceCtrl'
          });
      };

    }])

    .directive('dropZone', ['$log',dropZone])
