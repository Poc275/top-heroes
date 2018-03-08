angular.module('TCModule').directive('tcCardNotCollected', function() {
	return {
		restrict: 'E',
        templateUrl: '/templates/card-not-collected.html',
        controller: function($scope) {
			$scope.showCategoryInfo = false;
		},
	};
});