angular.module('TCModule').directive('tcPack', function() {
	return {
		restrict: 'E',
        templateUrl: '/templates/pack.html',
        scope: {
            cards: '='
        },
		controller: function($scope) {
            $scope.currentCounter = 0;

            // wrap current card in array for tc-card directive to work
            $scope.currentCard = [
                $scope.cards[$scope.currentCounter]
            ];

            $scope.previousCard = function() {
                if($scope.currentCounter === 0) {
                    $scope.currentCounter = $scope.cards.length - 1;
                } else {
                    $scope.currentCounter--;
                }

                $scope.currentCard = [
                    $scope.cards[$scope.currentCounter]
                ];
            };

            $scope.nextCard = function() {
                if($scope.currentCounter === $scope.cards.length - 1) {
                    $scope.currentCounter = 0;
                } else {
                    $scope.currentCounter++;
                }

                $scope.currentCard = [
                    $scope.cards[$scope.currentCounter]
                ];
            };
		},
		link: function(scope, element) {
			
		}
	};
});