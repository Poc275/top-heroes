angular.module('TCModule').directive('tutorial', function() {
	return {
		restrict: 'E',
        templateUrl: '/templates/tutorial.html',
		controller: function($scope, Cards) {
            $scope.stepOne = true;
            $scope.stepTwo = false;
            $scope.stepThree = false;
            $scope.result = [];

            // retrieve a card to show in the tutorial
            Cards.findByName('The Makers').then(function(card) {
                $scope.result[0] = card.data;
            });

            $scope.showStep = function(step) {
                switch(step) {
                    case 1:
                        $scope.stepOne = true;
                        $scope.stepTwo = false;
                        $scope.stepThree = false;
                        break;
                    case 2:
                        $scope.stepOne = false;
                        $scope.stepTwo = true;
                        $scope.stepThree = false;
                        break;
                    case 3:
                        $scope.stepOne = false;
                        $scope.stepTwo = false;
                        $scope.stepThree = true;
                        break;
                    default:
                        $scope.stepOne = true;
                        $scope.stepTwo = false;
                        $scope.stepThree = false;
                }
            };

		}
	};
});