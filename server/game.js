/**
 * Game module that handles the game functionality. Creating/finding games, 
 * connecting players, handling socket.io communications etc.
 * @module server/game
 */
var gameServer = module.exports = {
	games: {},
	gameCount: 0
};

var uuid = require('uuid');


/**
 * Function that handles the in-game play messages. These messages 
 * are the category/score that a player has chosen to play. This is 
 * then sent onto the opposing player for comparison to see who wins the card.
 * @param {object} client - The client whose turn it was to play
 * @param {object} msg - Card object
 */
gameServer.onPlay = function(client, msg) {
	// get opposition player to send msg to
	var sender = client.userid;

	if(client.game.playerHost.userid === sender) {
		client.game.playerClient.emit('play', msg);
	} else {
		client.game.playerHost.emit('play', msg);
	}
};


/**
 * The "out-of-turn" player assesses the result because the 
 * player "in-turn" sends the score to them for comparison. This 
 * means that the player "out-of-turn" must inform the other player 
 * the result otherwise the result is only applied to 1 player. This 
 * function is for when the player "in-turn" has won a round.
 * @param {object} client - The client who lost the round
 * @param {object} msg - Card object
 */
gameServer.onVictorious = function(client, msg) {
	// get opposition player to send msg to
	var sender = client.userid;

	if(client.game.playerHost.userid === sender) {
		client.game.playerClient.emit('victorious', msg);
	} else {
		client.game.playerHost.emit('victorious', msg);
	}
};


/**
 * As onVictorious() but this function is for when the 
 * player "in-turn" has lost a round.
 * @param {object} client - The client who won the round
 */
gameServer.onDefeated = function(client) {
	// get opposition player to send msg to
	var sender = client.userid;

	if(client.game.playerHost.userid === sender) {
		client.game.playerClient.emit('defeated');
	} else {
		client.game.playerHost.emit('defeated');
	}
};


/**
 * As onVictorious() but this function is for when the 
 * round has been drawn.
 * @param {object} client - The client sending the draw result
 */
gameServer.onDraw = function(client) {
	// get opposition player to send msg to
	var sender = client.userid;

	if(client.game.playerHost.userid === sender) {
		client.game.playerClient.emit('draw');
	} else {
		client.game.playerHost.emit('draw');
	}
};


/**
 * Function that passes the player's score to the opponent 
 * to move the score slider and see the result.
 * @param {object} client - The client who sent the message
 * @param {string} result - Result object containing category and score
 */
gameServer.onOpponentScore = function(client, result) {
	// get opposition player to send result to
	var sender = client.userid;

	if(client.game.playerHost.userid === sender) {
		client.game.playerClient.emit('opponentScore', result);
	} else {
		client.game.playerHost.emit('opponentScore', result);
	}
};


/**
 * Function that records when a player is ready for the next round, 
 * i.e. when the slider has finished and the result is displayed.
 * We change the game nextRound property to true and if both are 
 * players are ready we send an event to start the next round.
 * @param {object} client - The client who is ready for the next round
 */
gameServer.onNextRound = function(client) {
	var sender = client.userid;

	if(client.game.playerHost.userid === sender) {
		client.game.playerHostNextRound = true;
	} else {
		client.game.playerClientNextRound = true;
	}

	// are both players ready?
	if(client.game.playerHostNextRound && client.game.playerClientNextRound) {
		client.game.playerHostNextRound = false;
		client.game.playerClientNextRound = false;

		client.game.playerHost.emit('nextRound');
		client.game.playerClient.emit('nextRound');
	}
};


/**
 * Function that handles a game abort when a 
 * player leaves in the middle of a game
 */
gameServer.onAbort = function(client) {
	// get opposition player to send result to
	var sender = client.userid;

	if(client.game.playerHost.userid === sender) {
		client.game.playerClient.emit('abort');
	} else {
		client.game.playerHost.emit('abort');
	}
};


/**
 * Function that informs the opponent that they've won the game
 * @param {object} client - The client who lost the game
 */
gameServer.onGameOver = function(client) {
	// get opposition player to send result to
	var sender = client.userid;

	if(client.game.playerHost.userid === sender) {
		client.game.playerClient.emit('gameOver');
	} else {
		client.game.playerHost.emit('gameOver');
	}
};


/**
 * Function that handles the passing of messages between players.
 * The 'message' event is for status updates (game found, game created, 
 * waiting for 2nd player etc.) and in-game chat.
 * @param {object} client - The client who sent the message
 * @param {string} msg - The content of the message
 */
gameServer.onMessage = function(client, msg) {
	// get opposition player to send msg to
	var sender = client.userid;

	if(client.game.playerHost.userid === sender) {
		client.game.playerClient.emit('message', msg);
	} else {
		client.game.playerHost.emit('message', msg);
	}
};


/**
 * Function that handles the passing of a user's gravatar url
 * to their opponent for display in the in-game score bar
 * @param {object} client - The client who sent the message
 * @param {string} msg - The content of the message
 */
gameServer.onOpponentGravatar = function(client, msg) {
	// get opposition player to send msg to
	var sender = client.userid;

	if(client.game.playerHost.userid === sender) {
		client.game.playerClient.emit('opponentGravatar', msg);
	} else {
		client.game.playerHost.emit('opponentGravatar', msg);
	}
};


/**
 * Function that starts the game once 2 players are connected.
 * @param {object} game - game object to start
 */
gameServer.startGame = function(game) {
	// game has 2 players so we can start
	// send a start game event to kick things off
	game.playerClient.emit('start', 'client');
	game.playerHost.emit('start', 'host');

	game.playerClient.game = game;
	game.active = true;
};


/**
 * Function that creates a new game instance.
 * @param {object} player - player creating the game, the host
 * @returns {object} newGame with properties:
 * @property {UUID} id - Game unique id
 * @property {object} playerHost - Host player object
 * @property {object} playerClient - Client player 2, set to null initally until findGame adds them
 * @property {number} playerCount - Number of players in the game, initially set to 1
 */
gameServer.createGame = function(player) {
	// create new game instance
	var newGame = {
		id: uuid(),
		playerHost: player,
		playerHostNextRound: false,
		playerClient: null,
		playerClientNextRound: false,
		playerCount: 1
	};

	// store it in the list of games
	gameServer.games[newGame.id] = newGame;
	gameServer.gameCount++;

	// emit a game created event with the id
	// (mainly for testing but could be used later for analysis?)
	player.emit('gameCreated', newGame.id);

	// tell the player it's their turn first (ready for when the game starts)
	player.emit('status', 'Game on. It\'s your turn first');

	player.game = newGame;
	player.hosting = true;

	console.log('player ' + player.userid + ' created game with id ' + player.game.id);

	return newGame;
};


/**
 * Function finds if a game is available by looping through all created 
 * games and seeing if there is only 1 player inside it. If a game is 
 * found then the user is added as the client to the game, if not, a new 
 * game is created and the user is added as the host.
 * @param {object} player - player trying to join the game
 */
gameServer.findGame = function(player) {
	console.log('looking for a game. We have: ' + gameServer.gameCount);

	if(gameServer.gameCount > 0) {
		// we have active games,
		// see if one needs another player
		var joined = false;

		for(var gameId in gameServer.games) {
			var gameInstance = gameServer.games[gameId];

			if(gameInstance.playerCount < 2) {
				// join game
				console.log('Joined game: ' + gameInstance.id);
				joined = true;
				gameInstance.playerClient = player;
				gameInstance.playerCount++;

				// tell the player it's not their turn first
				gameInstance.playerClient.emit('status', 'Game on. It\'s your opponent\'s turn first');

				gameServer.startGame(gameInstance);
			}
		}

		// no games available to join
		// create one instead
		if(!joined) {
			console.log('all games full, creating one instead...');
			gameServer.createGame(player);
		}
	} else {
		// no games exist
		// create one
		console.log('no games exist, creating one...');
		gameServer.createGame(player);
	}
};


/**
 * Function that deletes a game object if a player disconnects or
 * navigates away from the page.
 * @param {object} gameId - Game ID to find and delete from gameServer.games
 * @param {object} userid - User ID of player that left, from this we can tell the other player what happened
 */
gameServer.endGame = function(gameId, userid) {
	var game = gameServer.games[gameId];

	if(game) {
		// for now just kill the game, but will
		// need to handle this more gracefully
		delete gameServer.games[gameId];
		gameServer.gameCount--;

		console.log(gameId + ' removed. There are now ' + gameServer.gameCount + ' games left');
	}
};