angular.module('TCModule').directive('filePicker', function(FileUploader, Auth) {
	return {
        restrict: 'E',
        scope: {
            // side = 0 for front and 1 for rear
            // card is the card object that we're editing/creating
            side: '=',
            card: '='
        },
		templateUrl: '/templates/file-picker.html',
		controller: function($scope) {
			$scope.uploader = new FileUploader({
                queueLimit: 1,
                url: '/images/upload',
                removeAfterUpload: true,
                headers: {
                    Authorization: 'Bearer ' + Auth.getToken()
                }
            });
            $scope.uploadProgress = 0;
            $scope.showProgress = false;
		},
		link: function(scope, element, attrs) {
            var button = element.find('button');
            var input = angular.element(element[0].querySelector('input#fileInput'));
            button.bind('click', function() {
                input[0].click();
            });

            input.bind('change', function(e) {
                scope.$apply(function() {
                    var files = e.target.files;

                    // image file name can't have spaces
                    if(!files[0] || files[0].name.includes(' ')) {
                        angular.element(element[0].querySelector('#upload-result')).html("Image file name cannot contain spaces");
                        scope.uploader.clearQueue();
                    } else {
                        // reset details in case we're submitting another image
                        scope.uploadProgress = 0;
                        angular.element(element[0].querySelector('#upload-result')).html("");
                        scope.card.images[scope.side] = files[0].name;
                        scope.showProgress = true;
                        scope.uploader.queue[0].formData[0] = files[0];
                        scope.uploader.queue[0].upload();

                        // upload event handlers
                        scope.uploader.queue[0].onProgress = function(progress) {
                            scope.uploadProgress = progress;
                        };
            
                        scope.uploader.queue[0].onSuccess = function(response, status, headers) {
                            angular.element(element[0].querySelector('#upload-result')).html("Upload complete");
                        };
            
                        scope.uploader.queue[0].onError = function(response, status, headers) {
                            angular.element(element[0].querySelector('#upload-result')).html("Upload error, see log for more details");
                            console.log("Status: ", status, " Response: ", response);
                            scope.uploader.clearQueue();
                        };
                    }
                });
            });
		}
	};
});