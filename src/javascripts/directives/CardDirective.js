angular.module('TCModule').directive('tcCard', function($sce) {
	return {
		restrict: 'E',
		templateUrl: '/templates/card.html',
		controller: function($scope) {
			$scope.flipped = false;
			$scope.showCategoryInfo = false;

			// doing the references in the same way as the bio
			// inside an array doesn't return a string, but a trustedHelperObject
			// so instead use a function in the controller that is called from
			// the template in an ng-repeat directive
			$scope.displayLink = function(link) {
				var converter = new showdown.Converter();
				var mdLink = converter.makeHtml(link);

				return $sce.trustAsHtml(mdLink);
			};
		},
		// isolate scope prevents <card> from accessing GameController, i.e. it can't access parent scope
		// so a new GameController instance is created which breaks ng-click etc.
		// Why did I add an isolate scope in the first place? It doesn't seem to break anything...
		// scope: {
		// 	card: '='
		// },
		link: function(scope, element) {
			var converter = new showdown.Converter();
			scope.card.bio = $sce.trustAsHtml(converter.makeHtml(scope.card.bio));
		}
	};
});