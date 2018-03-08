angular.module('TCModule').controller('SoloGameController', function($scope, $mdToast, $mdDialog, $interval, $q, $state, $timeout, Cards, Users) {
	// PPC_MAX + 1 because log(0) = NaN
	var PPC_MAX = Math.log(200001);

	// link GAME_SIZE to a UI option eventually
	// so user can choose own game length
	var GAME_LENGTH = 5;

	// game over rewards
	var GAME_WON_BOON = 100;
	var GAME_LOSE_BOON = 25;
	var GAME_WON_XP = 25;
	var XP_PER_HAND = 5;
	var COMPENSATION_BOON = 20;

    // user/computer packs/current cards
	$scope.collection;
    $scope.currentCard;
    $scope.opponentPack;
    $scope.opponentCard;

    // user goes first in 1 player game
	$scope.turn = true;

	// counter for players current card
	$scope.round = 0;
	$scope.opponentRound = 0;

	// tally hands won/lost/drawn for game stats and XP
	$scope.handsWon = 0;
	$scope.handsDrawn = 0;
	$scope.handsLost = 0;

	// opponent score variables
	$scope.showScore = false;
	$scope.showResult = false;

    $scope.result = {
		myScore: 0,
		opponentScore: 0,
		opponentCard: {},
		category: ''
    };
    
	// scoreSlider moves the opponent score slider bar
	$scope.result.scoreSlider = 0;
	// scoreSliderValue increments the opponent's score value
	// required as a separate value because scoreSlider is 
	// incremented in different steps depending on the values
	$scope.result.scoreSliderValue = 0;
	$scope.result.message = '';

	// overall game score
	$scope.myScore = GAME_LENGTH;
	$scope.opponentScore = GAME_LENGTH;


	// functions...
	$scope.init = function() {
        // get a pack for the opponent
        Cards.getComputerPack(GAME_LENGTH).then(function(computerPack) {
            console.log("Computer's pack: ", computerPack.data);
            $scope.opponentPack = computerPack.data;
            $scope.opponentCard = [$scope.opponentPack[$scope.opponentRound]];

            // now get user's game pack
			Cards.getGamePack(GAME_LENGTH).then(function(pack) {
				$scope.collection = pack.data;
				// force array creation for ng-repeat to work
				// otherwise the card object is at the "wrong level"
				// and we get a card for each property of a card 
				// instead of a single object
                $scope.currentCard = [$scope.collection[$scope.round]];
                
                // inform user that they go first
				$mdToast.show(
                    $mdToast.simple()
                    .textContent('Your turn!')
                    .position('top')
                    .hideDelay(3000)
                );
			})
			.catch(function(err) {
				console.log(err);
			});
        })
        .catch(function(err) {
            console.log(err);
        });
	};


	// user has selected a category to play
	$scope.play = function(category, score) {
		if($scope.turn) {
			var computerScore = $scope.opponentCard[0][category];

			$scope.result.myScore = score;
			$scope.result.opponentScore = computerScore;
			$scope.result.opponentCard = $scope.opponentCard;
			$scope.result.category = category;

            $scope.moveOpponentScoreSlider(category, computerScore, score).then(function() {
                $scope.resultCheck();
            });
		}
    };

	// computer has selected a category to play
	$scope.computerPlay = function(category, computerScore) {
		var myScore = $scope.currentCard[0][category];

		$scope.result.myScore = myScore;
		$scope.result.opponentScore = computerScore;
		$scope.result.opponentCard = $scope.opponentCard;
		$scope.result.category = category;

		$scope.moveOpponentScoreSlider(category, computerScore, myScore).then(function() {
			$scope.resultCheck();
		});
	};
	

	// move slider function to see opponent's score
	$scope.moveOpponentScoreSlider = function(category, opponentScore, myScore) {
		$scope.showScore = true;
		// this value stores the full slider value including decimal places
		// $scope.scoreSliderValue is for the Math.round() score
		$scope.totalSliderValue = 0;
		$scope.maskCategories(category);

		if(opponentScore > 0) {
			if(category === 'ppc') {
				var opponentLogScore = Math.round((Math.log(opponentScore + 1) / PPC_MAX) * 100, 0);
				var myLogScore = Math.round((Math.log(myScore + 1) / PPC_MAX) * 100, 0);
				
				if(opponentLogScore > 0) {
					return $q(function(resolve, reject) {
						$interval(function() {
							$scope.result.scoreSlider += (100 / myLogScore);
							$scope.totalSliderValue += opponentScore / opponentLogScore;
							$scope.result.scoreSliderValue = Math.floor($scope.totalSliderValue, 0);
						}, 100, opponentLogScore, true).then(function() {
							// update final score to account for any missing decimal places due to rounding
							$scope.result.scoreSliderValue = opponentScore;
							resolve();
						});
					});
				} else {
					// score slider doesn't need to move, just return a completed promise
					return $q(function(resolve, reject) {
						resolve();
					});
				}
			} else {
				return $q(function(resolve, reject) {
					$interval(function() {
						$scope.result.scoreSlider += (100 / myScore);
						$scope.result.scoreSliderValue += 1;
					}, 100, opponentScore, true).then(function() {
						resolve();
					});
				});
			}
		} else {
			// score slider doesn't need to move, just return a completed promise
			return $q(function(resolve, reject) {
				resolve();
			});
		}
	};


	// function that hides all other categories other than the selected one
	// ready for the result display
	$scope.maskCategories = function(category) {
		$scope.hideUnpalatibility = (category === 'unpalatibility') ? false : true;
		$scope.hideUpTheirOwnArsemanship = (category === 'up_their_own_arsemanship') ? false : true;
		$scope.hideMediaAttention = (category === 'media_attention') ? false : true;
		$scope.hideLegacy = (category === 'legacy') ? false : true;
		$scope.hidePpc = (category === 'ppc') ? false : true;
		$scope.hideSpecialAbility = (category === 'special_ability') ? false : true;
	};


	// check the result once sliders have finished moving
	$scope.resultCheck = function() {
		if($scope.result.myScore > $scope.result.opponentScore) {
			// win! opponent's card is added to collection :)
			$scope.collection.push($scope.result.opponentCard[0]);
			$scope.round++;
			$scope.turn = true;
			$scope.myScore++;
			$scope.opponentScore--;
			$scope.result.message = '🎉 So Much Win!';
			$scope.showResult = true;
			$scope.handsWon++;

			// tell opponent they have been defeated so their card is removed
			$scope.opponentResultNotification('defeated', null);

		} else if($scope.result.myScore < $scope.result.opponentScore) {
			// lost, card is removed from collection and sent to winner :(
			$scope.turn = false;
			$scope.myScore--;
			$scope.opponentScore++;
			$scope.result.message = '💩 What A Lose';
			$scope.showResult = true;
			$scope.handsLost++;

			// tell opponent they have won the round and send them their new card
			var lostCard = $scope.collection.splice($scope.round, 1);
			$scope.opponentResultNotification('victorious', lostCard);

		} else {
			$scope.round++;
			$scope.result.message = '😑 It\'s a Draw';
			$scope.showResult = true;
			$scope.handsDrawn++;

			$scope.opponentResultNotification('draw', null);
		}

		// minus 1 from collection length because $scope.round starts at zero
		if($scope.round > $scope.collection.length - 1) {
			// go back to beginning of pack
			$scope.round = 0;
		}

		// ready for next round
		$scope.nextRound();
	};


	// inform computer opponent of result
	$scope.opponentResultNotification = function(result, cardWon) {
		if(result === 'defeated') {
			// remove card and update current card
			$scope.opponentPack.splice($scope.opponentRound, 1);

			if($scope.opponentRound > $scope.opponentPack.length - 1) {
				// go back to the beginning of the pack
				$scope.opponentRound = 0;
			}

		} else if(result === 'victorious') {
			// add cardWon to opponent's pack and update current card
			$scope.opponentPack.push(cardWon[0]);
			$scope.opponentRound++;

			if($scope.opponentRound > $scope.opponentPack.length - 1) {
				// go back to the beginning of the pack
				$scope.opponentRound = 0;
			}

		} else if(result === 'draw') {
			// just move onto the next card
			$scope.opponentRound++;

			if($scope.opponentRound > $scope.opponentPack.length - 1) {
				// go back to the beginning of the pack
				$scope.opponentRound = 0;
			}
		}
	};


	// next round function
	$scope.nextRound = function() {
		$timeout(function() {
			// reset opponent score visibility and unhide card categories
			$scope.showScore = false;
			$scope.showResult = false;
			$scope.result.scoreSlider = 0;
			$scope.result.scoreSliderValue = 0;
			$scope.result.message = '';

			$scope.hideUnpalatibility = false;
			$scope.hideUpTheirOwnArsemanship = false;
			$scope.hideMediaAttention = false;
			$scope.hideLegacy = false;
			$scope.hidePpc = false;
			$scope.hideSpecialAbility = false;

			if($scope.collection.length === 0) {
				// Human has lost
				$scope.gameLost();
			} else if($scope.opponentPack.length === 0) {
				// Human has won
				$scope.gameWon();
			} else {
				// move onto next round
				$scope.currentCard = [$scope.collection[$scope.round]];
				$scope.opponentCard = [$scope.opponentPack[$scope.opponentRound]];

				// does computer need to play a card?
				if(!$scope.turn) {
					// wait a few seconds before selecting a random category
					$timeout(function() {
						var categories = ['unpalatibility', 'up_their_own_arsemanship', 'media_attention', 'legacy', 'ppc', 'special_ability'];
						var category = categories[Math.floor(Math.random() * categories.length)];
						$scope.computerPlay(category, $scope.opponentCard[0][category]);
					}, 2000);
				}
			}
		}, 3000);
	};


	// won game function
	$scope.gameWon = function() {
		// get user's stats (to update xp and boon)
		// and then load end of game summary dialog
		Users.getUsersStats().then(function(userStats) {
			$mdDialog.show({
				locals: { stats: {
					level: userStats.data.level,
					handsWon: $scope.handsWon,
					handsDrawn: $scope.handsDrawn,
					handsLost: $scope.handsLost,
					xp: userStats.data.xp,
					xpWon: ($scope.handsWon + $scope.handsDrawn + $scope.handsLost) * XP_PER_HAND + GAME_WON_XP,
					boon: userStats.data.boon,
					boonWon: GAME_WON_BOON
				} },
				controller: GameOverDialogController,
				templateUrl: 'templates/game-over-won-dialog.html',
				parent: angular.element(document.body),
				clickOutsideToClose: false,
				fullscreen: true
			})
			.then(function() {
				// update user's stats and go home
				var newStats = {
					won: true,
					xp: ($scope.handsWon + $scope.handsDrawn + $scope.handsLost) * XP_PER_HAND + GAME_WON_XP,
					boon: GAME_WON_BOON
				};
				
				Users.updateUsersStats(JSON.stringify(newStats)).then(function() {
					// go home
					$state.go("home");
				})
				.catch(function(err) {
					// handle error...
					// go home
					$state.go("home");
				});
			});
		})
		.catch(function(err) {
			// handle error
		});
	};


	// lost game function
	$scope.gameLost = function() {
		// get user's stats (to update xp and boon)
		// and then load end of game summary dialog
		Users.getUsersStats().then(function(userStats) {
			$mdDialog.show({
				locals: { stats: {
					level: userStats.data.level,
					handsWon: $scope.handsWon,
					handsDrawn: $scope.handsDrawn,
					handsLost: $scope.handsLost,
					xp: userStats.data.xp,
					xpWon: ($scope.handsWon + $scope.handsDrawn + $scope.handsLost) * XP_PER_HAND,
					boon: userStats.data.boon,
					boonWon: GAME_LOSE_BOON
				} },
				controller: GameOverDialogController,
				templateUrl: 'templates/game-over-lost-dialog.html',
				parent: angular.element(document.body),
				clickOutsideToClose: false,
				fullscreen: true
			})
			.then(function() {
				// update user's stats and go home
				var newStats = {
					won: false,
					xp: ($scope.handsWon + $scope.handsDrawn + $scope.handsLost) * XP_PER_HAND,
					boon: GAME_LOSE_BOON
				};

				Users.updateUsersStats(JSON.stringify(newStats)).then(function() {
					// go home
					$state.go("home");
				})
				.catch(function(err) {
					// handle error...
					// go home
					$state.go("home");
				});
			});
		})
		.catch(function(err) {
			// handle error
		});
	};


	// game over dialogs controller
	function GameOverDialogController($scope, $mdDialog, $filter, Users, stats) {
		$scope.stats = stats;
		$scope.levelUp = false;

		// add user's new xp to stats for display,
		// this allows us to dynamically update stats.xp in the slider
		// without it affecting the fixed value display
		$scope.stats.newXp = stats.xp + stats.xpWon;

		// filter starting slider position
		$scope.stats.xpSliderValue = $filter('xpFilter')(stats.xp, stats.level);
		// filter slider to position
		// (minus start as this is the number of $interval iterations)
		var toXp = $filter('xpFilter')(stats.xp + stats.xpWon, stats.level) - $filter('xpFilter')(stats.xp, stats.level);

		// move xp slider
		$interval(function() {
			$scope.stats.xpSliderValue += 1;
		}, 100, toXp, true).then(function() {
			// check for level up (xp bar >= 100)
			if($filter('xpFilter')(stats.xp + stats.xpWon, stats.level) >= 100) {
				$scope.levelUp = true;
				Users.levelUp();
			}
		});

		$scope.hide = function() {
			$mdDialog.hide();
		};
	}


	// call init() function
	$scope.init();

});