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

                  $log.log(file, response);


                    if (scope.successCallback != null) {
                        scope.successCallback(response, file);
                    }
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

    .controller('ModalInstanceCtrl', [
      '$scope',
      '$log',
      '$modalInstance',
      'auth',
      function ($scope, $log, $modalInstance, auth) {

        $scope.data = {};

        $scope.ok = function () {
          $log.log("fsdf");
            //$modalInstance.close();

        };

        $scope.cancel = function () {
          $log.log("fsdf");
          //  $modalInstance.dismiss('cancel');
        };

        $scope.submit = function() {
          //console.log(experiments.experiments);

          //experiments.addExperiment();
        };

        $scope.dropzoneUploaded = function(response, file) {
            var filename = file.filename;
            var filepath = response.path;
            var object = {
                filename: filename,
                filepath: filepath
            };
            //var updated = DataFct.add(object);
              $log.log(object);
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
