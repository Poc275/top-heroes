angular.module('TCModule').controller('CardController', function($scope, $stateParams, Cards) {
	$scope.result = [];

	Cards.findByName($stateParams.name).then(function(card) {
		$scope.result[0] = card.data;
	});
});
