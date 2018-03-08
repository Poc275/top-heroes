angular.module('TCModule').controller('GameController', function($scope, $mdToast, $mdDialog, $interval, $q, $timeout, $state, $stateParams, Cards, socket, Gravatar, Users) {
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

	$scope.gameId = null;
	$scope.collection;
	$scope.currentCard;
	$scope.host;
	$scope.gameInProgress;
	$scope.turn;

	// one player option flag
	$scope.onePlayerOption = false;

	// tally hands won/lost/drawn for game stats and XP
	$scope.handsWon = 0;
	$scope.handsDrawn = 0;
	$scope.handsLost = 0;

	// counter for the number of rounds played
	$scope.round;

	// result object to compare scores and 
	// calculate who wins a round
	$scope.result = {
		myScore: 0,
		opponentScore: 0,
		opponentCard: {},
		category: ''
	};

	// gravatar images for score bar and in-game chat
	$scope.myGravatarUrl;
	$scope.opponentGravatarUrl;

	// chat object sent during in-game chat
  	$scope.chat = {
  		messages: [],
		sendMessage: ''
	};

	// opponent score variables
	$scope.showScore = false;
	$scope.showResult = false;

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
		// get my gravatar
		$scope.myGravatarUrl = Gravatar($stateParams.email, 80);

		// create connection to socket.io
		socket.connect();

		// now listen for events
		socket.on('onconnected', function(data) {
			console.log('Connected to TC via socket.io. Player id is ' + data);
		});

		// game created event
		// user is waiting for an opponent, if too long
		// offer them a 1 player game option
		socket.on('gameCreated', function(id) {
			$scope.gameId = id;

			$timeout(function() {
				// show one player game option
				$scope.onePlayerOption = true;
			}, 5000);
		});

		// in-game chat message received
		socket.on('message', function(message) {
			message.me = false;
			$scope.chat.messages.push(message);
		});

		// status update sent
		socket.on('status', function(status) {
			// status messages are not player specific, so
			// add the TC logo as the avatar
			var statusMessage = {
				message: status,
				gravatarUrl: '/images/tc-avatar.png'
			};

			$scope.chat.messages.push(statusMessage);
		});

		// opponent's gravatar sent
		socket.on('opponentGravatar', function(data) {
			$scope.opponentGravatarUrl = data.gravatar;
		});

		// game has started
		socket.on('start', function(status) {
			$scope.gameInProgress = true;
			$scope.round = 0;

			// send avatar to opponent for score bar
			socket.emit('opponentGravatar', { gravatar: $scope.myGravatarUrl });

			if(status === 'host') {
				$scope.host = true;
				$scope.turn = true;
				
				// inform host they go first
				$mdToast.show(
		      		$mdToast.simple()
			        .textContent('Your turn!')
			        .position('top')
			        .hideDelay(3000)
			    );

			} else {
				$scope.host = false;
				$scope.turn = false;
			}

			// get user's game pack
			Cards.getGamePack(GAME_LENGTH).then(function(pack) {
				$scope.collection = pack.data;
				// force array creation for ng-repeat to work
				// otherwise the card object is at the "wrong level"
				// and we get a card for each property of a card 
				// instead of a single object
				$scope.currentCard = [$scope.collection[$scope.round]];
			})
			.catch(function(err) {
				console.log(err);
			});
		});

		// user has been sent a card they've won from an opponent
		// just add to end of collection
		socket.on('victorious', function(data) {
			$scope.collection.push(data[0]);
			$scope.round++;
			$scope.turn = true;
			$scope.handsWon++;

			// minus 1 from collection length because $scope.round starts at zero
			if($scope.round > $scope.collection.length - 1) {
				// go back to beginning of pack
				$scope.round = 0;
			}
		});

		// user has lost a round, remove their current card
		socket.on('defeated', function() {
			$scope.turn = false;
			$scope.collection.splice($scope.round, 1);
			$scope.handsLost++;

			// minus 1 from collection length because $scope.round starts at zero
			if($scope.round > $scope.collection.length - 1) {
				// go back to beginning of pack
				$scope.round = 0;
			}
		});

		// round was drawn, just move onto next card
		socket.on('draw', function() {
			$scope.round++;
			$scope.handsDrawn++;

			// minus 1 from collection length because $scope.round starts at zero
			if($scope.round > $scope.collection.length - 1) {
				// go back to beginning of pack
				$scope.round = 0;
			}
		});

		// opponentScore event
		// the player "out-of-turn" has sent his score back to
		// the player "in-turn" and the slider needs to move accordinly
		// so both players can visually see each other's scores
		socket.on('opponentScore', function(result) {
			// assign out-of-turn player's card to result object
			// so player-in-turn can see who their opponent
			$scope.result.opponentCard = result.card;

			$scope.moveOpponentScoreSlider(result.category, result.score, $scope.result.myScore).then(function() {
				// show result then emit nextRound event
				// to show you're ready to proceed
				if($scope.result.myScore > result.score) {
					// you've won
					$scope.myScore++;
					$scope.opponentScore--;
					$scope.result.message = '🎉 So Much Win!';
				} else if($scope.result.myScore < result.score) {
					// you've lost
					$scope.myScore--;
					$scope.opponentScore++;
					$scope.result.message = '💩 What A Lose';
				} else {
					// draw
					$scope.result.message = '😑 It\'s a Draw';
				}

				$scope.showResult = true;
				socket.emit('nextRound');
			});
		});

		// nextRound event - both players are ready for their next card
		socket.on('nextRound', function() {
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
					// I've lost, tell opponent they've won and show game over dialog
					socket.emit('gameOver');
					$scope.gameLost();
				} else {
					$scope.currentCard = [$scope.collection[$scope.round]];
				}
			}, 3000);
		});

		// in-game play events
		// this is where the result is calculated, this always happens for the 
		// player "out-of-turn" i.e. it isn't their turn to play a card.
		// the result is then passed back to the player "in-turn"
		socket.on('play', function(play) {
			$scope.result.myScore = $scope.currentCard[0][play.category];
			$scope.result.opponentScore = play.score;
			$scope.result.opponentCard = play.card;
			$scope.result.category = play.category;

			// send score to opponent to update their slider
			socket.emit('opponentScore', { category: $scope.result.category, score: $scope.result.myScore, card: $scope.currentCard });

			$scope.moveOpponentScoreSlider($scope.result.category, $scope.result.opponentScore, $scope.result.myScore).then(function() {
				$scope.resultCheck();
			});
		});

		// game aborted, opponent has left in-game
		socket.on('abort', function() {
			socket.disconnect();
			Users.updateUsersBoon(JSON.stringify({ amount: COMPENSATION_BOON }));

			$mdDialog.show(
				$mdDialog.alert()
					.parent(angular.element(document.body))
					.clickOutsideToClose(true)
					.title('Opponent quits!')
					.textContent('😠 Most heinous. Your opponent has left the game. Don\'t worry, we know who he is. Have some compensation (+' + 
						COMPENSATION_BOON + ' boon)')
					.ariaLabel('Opponent has left the game dialog')
					.ok('Ok')
			)
			.then(function() {
				// go back to home page
				$state.go("home");
			});
		});

		// game over event, player has won
		socket.on('gameOver', function() {
			$scope.gameWon();
		});
	};


	// in-game chat - send message
	$scope.send = function() {
		var message = {
			message: $scope.chat.sendMessage,
			gravatarUrl: $scope.myGravatarUrl,
			me: true
		};

		$scope.chat.messages.push(message);
		socket.emit('message', message);

		// clear input ready for a new message
		$scope.chat.sendMessage = null;
	};


	// user has selected a category to play
	$scope.play = function(category, score) {
		if($scope.turn) {
			// update result object
			$scope.result.myScore = score;
			$scope.result.category = category;

			socket.emit('play', { card: $scope.currentCard, category: category, score: score });
		}
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
						// $scope.result.scoreSlider += 1;
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
			socket.emit('defeated');

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
			socket.emit('victorious', lostCard);

		} else {
			$scope.round++;
			$scope.result.message = '😑 It\'s a Draw';
			$scope.showResult = true;
			$scope.handsDrawn++;

			socket.emit('draw');
		}

		// minus 1 from collection length because $scope.round starts at zero
		if($scope.round > $scope.collection.length - 1) {
			// go back to beginning of pack
			$scope.round = 0;
		}

		// ready for next round
		socket.emit('nextRound');
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


	// this method checks for the start of a route change
	// i.e. player is leaving the game, so disconnect them
	$scope.$on('$stateChangeStart', function(next, current) {
		// tell opponent game is over and disconnect
		// (note: need gameInProgress check because there is a route 
		// change between user waiting for a game and the game starting)
		if($scope.gameInProgress) {
			socket.emit('abort');
			socket.disconnect();
		} else if($scope.gameId !== null) {
			// user who created the game has decided not to wait or has chosen a 1 player game
			console.log("user has cancelled game, or chosen 1 player option");
			$scope.gameId = null;
			socket.disconnect();
		}
	});


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
		// filter slider position to move to
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