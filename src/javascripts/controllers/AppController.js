angular.module('TCModule').controller('AppController', function($scope, $mdSidenav, $http, $location, $mdDialog, Users) {
	// it's good practice to bind ng-model properties
	// to an object rather than a string on the scope
	$scope.local = {};

	$scope.flipped = false;

	// toggle sidenav menu
	$scope.toggleMenu = function() {
		$mdSidenav('side-menu').toggle();
	};

	// THIS IS FOR TESTING PURPOSES ONLY!!!
	// Local signup to test 2 player games etc.
	$scope.localSignin = function() {
		$http.post('/auth/local', $scope.local).then(function() {
			// you can't redirect from an AJAX post request
			// so redirect using angular
			$location.path('/home');
		});
	};
});
