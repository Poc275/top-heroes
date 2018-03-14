angular.module('TCModule').directive('thCardNotCollected', function() {
	return {
		restrict: 'E',
        templateUrl: '/templates/card-not-collected.html',
        controller: function($scope) {
			$scope.showCategoryInfo = false;
		},
	};
});