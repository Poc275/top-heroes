angular.module('TCModule').controller('UserController', function($scope, $location, $state, $mdDialog, $window, Cards, Gravatar, Users, Auth) {
	$scope.showWorldLeaders = false;
	$scope.showAttSeekers = false;
	$scope.showWrongNs = false;
	$scope.showSports = false;
	$scope.showMouthBreathers = false;
	$scope.showTories = false;
	$scope.showFictional = false;
	$scope.showOnePercenters = false;
	$scope.showJokers = false;

	$scope.getToken = function() {
		// this method is called every home page visit
		// so make sure we only get a token if one doesn't already exists
		if(Auth.getToken() === null) {
			Users.getToken().then(function(response) {
				Auth.saveToken(response.data.token);
				// JWTs consist of 3 strings separated by a dot
				// [0] = Header (contains type and hash info)
				// [1] = Payload (JSON containing the data, Base64 encoded, use atob() to decode)
				// [2] = Signature (Encrypted hash using the server secret)
				var payload = response.data.token.split('.')[1];
				payload = $window.atob(payload);
				$scope.user = JSON.parse(payload);
			}, function(err) {
				// unauthorised, redirect to home
				$location.path('/');
			});
		} else {
			// user already has a token, is it valid?
			if(Auth.isTokenValid()) {
				var token = Auth.getToken();
				var payload = token.split('.')[1];
				payload = $window.atob(payload);
				$scope.user = JSON.parse(payload);
			} else {
				// token has expired
				// redirect to home so they can login again
				$location.path('/');
			}
		}
	};

	$scope.gravatarUrl = function(email, size) {
		return Gravatar(email, size);
	};

	$scope.logout = function() {
		Auth.logout();
		$location.path('/');
	};

	$scope.showTutorial = function() {
		$mdDialog.show({
			controller: TutorialDialogController,
			templateUrl: 'templates/tutorial-dialog.html',
			parent: angular.element(document.body),
			clickOutsideToClose: true,
			fullscreen: true
		});
	};

	$scope.getCards = function() {
		// object to store number of cards collected per category
		// placed in getCards() because otherwise view doesn't update, child scope?
		$scope.categoriesCollected = {
			worldLeaders: 0,
			attSeekers: 0,
			wrongNs: 0,
			sports: 0,
			mouthBreathers: 0,
			tories: 0,
			fictional: 0,
			onePercenters: 0,
			jokers: 0,
			total: 0
		};

		// get all cards and user's cards to see which are missing from the collection
		Cards.all().then(function(cards) {
			Cards.getCardCollection().then(function(myCards) {
				// compare arrays and append 'collected' property
				cards.data.forEach(function(card) {
					if(myCards.data.filter(function(el) { return el.name === card.name; }).length > 0) {
						card.collected = true;
						$scope.categoriesCollected.total++;
						// count categories for numerical output
						switch(card.category) {
							case 'World Leaders':
								$scope.categoriesCollected.worldLeaders++;
								break;
							case 'Attention Seekers':
								$scope.categoriesCollected.attSeekers++;
								break;
							case 'Wrong\'n':
								$scope.categoriesCollected.wrongNs++;
								break;
							case 'Sports':
								$scope.categoriesCollected.sports++;
								break;
							case 'Mouth Breathers':
								$scope.categoriesCollected.mouthBreathers++;
								break;
							case 'Tories':
								$scope.categoriesCollected.tories++;
								break;
							case 'Fictional':
								$scope.categoriesCollected.fictional++;
								break;
							case '1%er':
								$scope.categoriesCollected.onePercenters++;
								break;
							case 'Jokers':
								$scope.categoriesCollected.jokers++;
								break;
							default:
								break;
						}
					} else {
						card.collected = false;
					}
				});

				$scope.totalCollection = cards.data;
			});
		});
	};

	// md-dialog for when a collection item is clicked
	// to show the actual card
	$scope.showCard = function(ev, card) {
		$scope.cardClicked = card;

		$mdDialog.show({
			locals: { card: $scope.cardClicked },
			controller: DialogController,
			templateUrl: 'templates/card-dialog.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:true,
			fullscreen: true // Only for -xs, -sm breakpoints.
		})
		.then(function(answer) {
			
		}, function() {
			
		});
	};

	// card dialog controller
	function DialogController($scope, $mdDialog, card) {
		// convert to array for <tc-card> directive
		$scope.mdDialogData = [card];

		$scope.hide = function() {
			$mdDialog.hide();
		};

		$scope.cancel = function() {
			$mdDialog.cancel();
		};
	}

	// tutorial dialog controller
	function TutorialDialogController($scope, $mdDialog) {
		$scope.hide = function() {
		  $mdDialog.hide();
		};
	
		$scope.cancel = function() {
		  $mdDialog.cancel();
		};
	}

	$scope.getToken();
});
