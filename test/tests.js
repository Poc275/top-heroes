var chai = require('chai');
var expect = require('chai').expect;
var chaiHttp = require('chai-http');
var app = require('../server/app');
var game = require('../server/game');
var store = require('../server/store');
var bot = require('../server/bot');
var botResponses = require('../server/botResponses');
var builder = require('botbuilder');
var luisMock = require('../test/luis-mock');
var io = require('socket.io-client');
// require mongoose for objectId type tests
var mongoose = require('mongoose');
var mongodb = require('mongo-mock');
// mimic async db behaviour by setting max_delay
mongodb.max_delay = 0;

var MongoClient = mongodb.MongoClient;

chai.use(chaiHttp);

luisMock.setup();

describe('database card collection tests', function() {
	var url = 'mongodb://localhost:27017/tc';
	var collection;

	before(function(done) {	
		MongoClient.connect(url, {}, function(err, db) {
			// insert some dummy data into the mocked db
			collection = db.collection('cards');

			var cards = [{
				name: 'Donald Trump',
				unpalatibility: 97,
				up_their_own_arsemanship: 98,
				media_attention: 99,
				legacy: 75,
				special_ability: 68,
				ppc: 6800,
				cuntal_order: 'Gold',
				category: 'World Leaders',
				special_ability_description: 'Grabbin pussies',
				bio: 'Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro.',
				references: [
					'https://goo.gl/XTASMi',
					'https://goo.gl/P0KzJd'
				]
			},{
				name: 'Vladimir Putin',
				unpalatibility: 90,
				up_their_own_arsemanship: 95,
				media_attention: 99,
				legacy: 88,
				special_ability: 84,
				ppc: 20000,
				cuntal_order: 'Gold',
				category: 'World Leaders',
				special_ability_description: 'Election interference',
				bio: 'De carne animata corpora quaeritis. Summus sit​​, morbo vel maleficia?',
				references: [
					'https://goo.gl/W59LNx'
				]
			},{
				name: 'Sting',
				unpalatibility: 56,
				up_their_own_arsemanship: 66,
				media_attention: 24,
				legacy: 41,
				special_ability: 29,
				ppc: 300,
				cuntal_order: 'Bronze',
				category: 'Mouth Breathers',
				special_ability_description: 'Tantric tomfoolery',
				bio: 'De Apocalypsi undead dictum mauris.',
				references: []
			},{
				name: 'David Cameron',
				unpalatibility: 80,
				up_their_own_arsemanship: 75,
				media_attention: 59,
				legacy: 88,
				special_ability: 62,
				ppc: 10,
				cuntal_order: 'Brown Platinum',
				category: 'Tories',
				special_ability_description: 'Humming death warrants',
				bio: 'Hi mortuis soulless creaturas, imo monstra adventus vultus comedat cerebella viventium.',
				references: []
			},{
				name: 'George Bush Snr',
				unpalatibility: 35,
				up_their_own_arsemanship: 40,
				media_attention: 7,
				legacy: 23,
				special_ability: 35,
				ppc: 25,
				cuntal_order: 'Bronze',
				category: 'World Leaders',
				special_ability_description: 'OPEC parties',
				bio: 'Qui offenderit rapto, terribilem incessu.',
				references: []
			},{
				name: 'Chris Evans',
				unpalatibility: 56,
				up_their_own_arsemanship: 44,
				media_attention: 50,
				legacy: 29,
				special_ability: 66,
				ppc: 55,
				cuntal_order: 'Bronze',
				category: 'Mouth Breathers',
				special_ability_description: 'Annoying gingerness',
				bio: 'The voodoo sacerdos suscitat mortuos comedere carnem.',
				references: []
			},{
				name: 'Ben Bernanke',
				unpalatibility: 70,
				up_their_own_arsemanship: 78,
				media_attention: 12,
				legacy: 79,
				special_ability: 89,
				ppc: 2,
				cuntal_order: 'Silver',
				category: '1%er',
				special_ability_description: 'Tax dime misappropriation',
				bio: 'Sicut malus movie horror.',
				references: []
			}];

			collection.insert(cards, function(err, result) {
				if(err) {
					console.log(err);
					throw(err);
				}
				done();
			});
		});
	});


	it('db contains correct number of objects', function(done) {
		collection.find({}).toArray(function(err, docs) {
            expect(docs).to.have.length.of(7);
            done();
        });
	});


	it('card objects have correct properties and data types', function(done) {
		collection.find({}).toArray(function(err, docs) {
            expect(docs).to.be.a('array');
			expect(docs).to.have.length.of(7);

			expect(docs[0]).to.have.property('name');
			expect(docs[0]).to.have.property('unpalatibility');
			expect(docs[0]).to.have.property('up_their_own_arsemanship');
			expect(docs[0]).to.have.property('media_attention');
			expect(docs[0]).to.have.property('legacy');
			expect(docs[0]).to.have.property('special_ability');
			expect(docs[0]).to.have.property('ppc');
			expect(docs[0]).to.have.property('cuntal_order');
			expect(docs[0]).to.have.property('category');
			expect(docs[0]).to.have.property('special_ability_description');
			expect(docs[0]).to.have.property('bio');
			expect(docs[0]).to.have.property('references');

			expect(docs[0].name).to.be.a('string');
			expect(docs[0].unpalatibility).to.be.a('number');
			expect(docs[0].up_their_own_arsemanship).to.be.a('number');
			expect(docs[0].media_attention).to.be.a('number');
			expect(docs[0].legacy).to.be.a('number');
			expect(docs[0].special_ability).to.be.a('number');
			expect(docs[0].ppc).to.be.a('number');
			expect(docs[0].cuntal_order).to.be.a('string');
			expect(docs[0].category).to.be.a('string');
			expect(docs[0].special_ability_description).to.be.a('string');
			expect(docs[0].bio).to.be.a('string');
			expect(docs[0].references).to.be.a('array');
			expect(docs[0].references).to.have.length.of(2);

            done();
        });
	});

	
	it('card attributes can be compared numerically', function(done) {
		collection.find({}).toArray(function(err, docs) {
			var trump = docs[0];
			var putin = docs[1];

			expect(trump.unpalatibility).to.be.above(putin.unpalatibility);
			expect(trump.up_their_own_arsemanship).to.be.above(putin.up_their_own_arsemanship);
			expect(trump.media_attention).to.deep.equal(putin.media_attention);
			expect(trump.legacy).to.be.below(putin.legacy);
			expect(trump.special_ability).to.be.below(putin.special_ability);
			expect(trump.ppc).to.be.below(putin.ppc);

			done();
		});
	});


	it('findOne returns only a single result', function(done) {
		collection.findOne({ 'name': 'Donald Trump' }, function(err, result) {
			expect(result).to.be.an('object');
			expect(result.name).to.deep.equal('Donald Trump');
			expect(result.unpalatibility).to.deep.equal(97);
			expect(result.up_their_own_arsemanship).to.deep.equal(98);
			expect(result.media_attention).to.deep.equal(99);
			expect(result.legacy).to.deep.equal(75);
			expect(result.special_ability).to.deep.equal(68);
			expect(result.ppc).to.deep.equal(6800);
			expect(result.cuntal_order).to.deep.equal('Gold');
			expect(result.category).to.deep.equal('World Leaders');
			expect(result.special_ability_description).to.deep.equal('Grabbin pussies');
			expect(result.bio).to.deep.equal('Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro.');
			expect(result.references[0]).to.deep.equal('https://goo.gl/XTASMi');
			expect(result.references[1]).to.deep.equal('https://goo.gl/P0KzJd');

			done();
		});
	});


	it('missing search handled ok', function(done) {
		collection.findOne({ 'name': 'Ronald Reagan' }, function(err, result) {
			expect(result).to.be.null;

			done();
		});
	});
});


describe('database user collection tests', function() {
	var url = 'mongodb://localhost:27017/tc';
	var collection;

	before(function(done) {	
		MongoClient.connect(url, {}, function(err, db) {
			// insert some dummy data into the mocked db
			collection = db.collection('users');

			var user = {
				username: 'harry123',
				name: 'Harry Belafonte',
				email: 'harry.b@emailme.com',
				provider: 'Google',
				id: '123456',
				cards: ['123', '456']
			};

			collection.insert(user, function(err, result) {
				if(err) {
					console.log(err);
					throw(err);
				}
				done();
			});
		});
	});


	it('db contains a user', function(done) {
		collection.find({}).toArray(function(err, docs) {
			expect(docs).to.be.a('array');
            expect(docs).to.have.length.of(1);
            done();
        });
	});


	it('user object has correct properties and data types', function(done) {
		collection.find({}).toArray(function(err, docs) {
			expect(docs[0]).to.have.property('username');
			expect(docs[0]).to.have.property('name');
			expect(docs[0]).to.have.property('email');
			expect(docs[0]).to.have.property('provider');
			expect(docs[0]).to.have.property('id');
			expect(docs[0]).to.have.property('cards');

			expect(docs[0].username).to.be.a('string');
			expect(docs[0].name).to.be.a('string');
			expect(docs[0].email).to.be.a('string');
			expect(docs[0].provider).to.be.a('string');
			expect(docs[0].id).to.be.a('string');
			expect(docs[0].cards).to.be.a('array');
			expect(docs[0].cards).have.length.of(2);

            done();
        });
	});


	it('find user works as expected', function(done) {
		collection.findOne({ 'email': 'harry.b@emailme.com' }, function(err, result) {
			expect(result).to.be.an('object');
			expect(result.username).to.deep.equal('harry123');
			expect(result.name).to.deep.equal('Harry Belafonte');
			expect(result.email).to.deep.equal('harry.b@emailme.com');
			expect(result.provider).to.deep.equal('Google');
			expect(result.id).to.deep.equal('123456');
			expect(result.cards[0]).to.deep.equal('123');
			expect(result.cards[1]).to.deep.equal('456');

			done();
		});
	});


	it('missing user search handled ok', function(done) {
		collection.findOne({ 'email': 'harry.b@emailme.co.uk' }, function(err, result) {
			expect(result).to.be.null;

			done();
		});
	});


	// aggregate not yet supported in mongo-mock
	// it('starter pack db query creates 2 bronze cards', function(done) {
	// 	collection.aggregate([
	// 		{ $match: { cuntal_order: 'Bronze' }},
	// 		{ $project: { _id: true, name: true, cuntal_order: true }},
	// 		{ $sample: { size: 2 }}
	// 	], function(err, docs) {
	// 		expect(docs).to.be.a('array');
	// 		expect(docs).to.have.length.of(2);
	// 		expect(docs[0].cuntal_order).to.deep.equal('Bronze');
	// 		expect(docs[1].cuntal_order).to.deep.equal('Bronze');
	// 		expect(docs[0]._id).to.not.equal(docs[1]._id);

	// 		done();
	// 	});
	// });

});


// will need to change the url depending on test environment
// look into testUtils.getRootUrl() for an environment agnostic url method
// source: http://beletsky.net/2014/03/testable-apis-with-node-dot-js.html
// Is the use of chaiHttp considered integration testing?
describe('user authentication tests', function() {
	it('unauthenticated user cannot get /me', function(done) {
		chai.request('http://localhost:3000').get('/me/token').end(function(err, res) {
			expect(err).to.not.be.null;
			expect(res).to.have.status(401);

			done();
		});
	});
});


describe('game lobby setup test', function() {
	var host;
	var guest;
	var interloper;
	var completeGameId;
	var partialGameId;

	var hostMessagesReceived = 0;
	var guestMessagesReceived = 0;
	var interloperMessagesReceived = 0;
	var gameStartedMessagesReceived = 0;

	var hostGameCreatedMessagesReceieved = 0;
	var guestGameCreatedMessagesReceieved = 0;
	var interloperGameCreatedMessagesReceieved = 0;


	before(function(done) {
		expect(game.gameCount).to.deep.equal(0);
		done();
	});


	it('Only a maximum of 2 players allowed per room', function(done) {
		host = io.connect('http://localhost:3000');

		host.on('onconnected', function(data) {
			expect(data.id).to.be.a('string');
			expect(game.gameCount).to.deep.equal(1);
			
			// 2nd player joins...
			guest = io.connect('http://localhost:3000');

			guest.on('onconnected', function(data) {
				expect(data.id).to.be.a('string');
				expect(game.gameCount).to.deep.equal(1);

				// now the game has started...
				// host goes first and plays a card
				host.emit('message', 'unpalatibility: 75');

				// 3rd player joins
				interloper = io.connect('http://localhost:3000');

				interloper.on('onconnected', function(data) {
					expect(data.id).to.be.a('string');
					expect(game.gameCount).to.deep.equal(2);

					// setTimeout function to make sure all messages are emitted
					// must be a better way of doing this?
					setTimeout(function() {
						done();
					}, 200);
				});

				interloper.on('status', function(data) {
					expect(data).to.contain('It\'s your turn first');
					interloperMessagesReceived++;
				});

				interloper.on('gameCreated', function(gameId) {
					expect(gameId).to.not.be.null;
					expect(gameId).to.be.a('string');
					interloperGameCreatedMessagesReceieved++;
					partialGameId = gameId;
				});

				// this shouldn't be called as the 3rd player
				// doesn't get a game to start
				interloper.on('start', function(gameId) {
					gameStartedMessagesReceived++;
				});

			});

			guest.on('status', function(data) {
				expect(data).to.contain('It\'s your opponent\'s turn first');
				guestMessagesReceived++;
			});

			guest.on('message', function(data) {
				expect(data).to.contain('unpalatibility: 75');
				guestMessagesReceived++;
			});

			guest.on('start', function(gameId) {
				gameStartedMessagesReceived++;
			});

			// this should never be called because the guest doesn't 
			// create a game, only joins it
			guest.on('gameCreated', function(gameId) {
				guestGameCreatedMessagesReceieved++;
			});
		});

		host.on('status', function(data) {
			expect(data).to.contain('It\'s your turn first');
			hostMessagesReceived++;
		});

		host.on('gameCreated', function(gameId) {
			expect(gameId).to.not.be.null;
			expect(gameId).to.be.a('string');
			hostGameCreatedMessagesReceieved++;
			completeGameId = gameId;
		});

		host.on('start', function(gameId) {
			gameStartedMessagesReceived++;
		});
	});


	after(function(done) {
		// disconnect and clean up
		// have to call endGame to kill connections from the server side
		// (we're using socket.io-client in the tests)
		host.disconnect();
		guest.disconnect();
		interloper.disconnect();

		game.endGame(completeGameId, host.userid);
		game.endGame(partialGameId, interloper.userid);

		// now we're cleaned up there shouldn't be any games left
		expect(game.gameCount).to.deep.equal(0);

		// Each player gets 1 connect message, and we emitted a 
		// message from host to guest, so the guest should see 2 messages
		// the interloper only sees 1 which tests that the lobby 
		// is working ok
		expect(hostMessagesReceived).to.deep.equal(1);
		expect(guestMessagesReceived).to.deep.equal(2);
		expect(interloperMessagesReceived).to.deep.equal(1);

		// we should have had 1 game that started and 
		// notified both players = 2 messages
		expect(gameStartedMessagesReceived).to.deep.equal(2);

		// we should have had 2 gameCreated events 
		// one for the host and one for the interloper
		expect(hostGameCreatedMessagesReceieved).to.deep.equal(1);
		expect(guestGameCreatedMessagesReceieved).to.deep.equal(0);
		expect(interloperGameCreatedMessagesReceieved).to.deep.equal(1);

		done();
	});
});


describe('game event tests', function() {
	var host;
	var guest;
	var gameId;
	var defeatedCallbacks = 0;

	var dt = {
		_id: '12345',
		name: 'Donald Trump',
		unpalatibility: 87,
		up_their_own_arsemanship: 92,
		media_attention: 86,
		legacy: 77,
		special_ability: 96,
		ppc: 200000,
		cuntal_order: 'Gold',
		category: 'World Leaders',
		special_ability_description: 'General bad apple',
		bio: 'This guy is unbelievable...',
		references: ['see this here', 'and this as well'],
		images: ['front.jpg', 'rear.png']
	};

	var gk = {
		_id: '13579',
		name: 'Genghis Khan',
		unpalatibility: 79,
		up_their_own_arsemanship: 43,
		media_attention: 12,
		legacy: 86,
		special_ability: 73,
		ppc: 5,
		cuntal_order: 'Silver',
		category: 'World Leaders',
		special_ability_description: 'Trail blazer',
		bio: 'Wow!',
		references: ['novel'],
		images: ['front-pic.jpg', 'rear-pic.png']
	};


	before(function(done) {
		expect(game.gameCount).to.deep.equal(0);
		done();
	});


	it('onVictorious passes the card object to the other player', function(done) {
		host = io.connect('http://localhost:3000');

		host.on('onconnected', function(data) {
			expect(game.gameCount).to.deep.equal(1);

			// 2nd player joins...
			guest = io.connect('http://localhost:3000');

			guest.on('onconnected', function(data) {
				expect(game.gameCount).to.deep.equal(1);

				// now the game has started...
				// host goes first and plays a card
				host.emit('play', { card: dt, category: 'unpalatibility', score: 94 });
			});

			guest.on('status', function(data) {
				expect(data).to.contain('It\'s your opponent\'s turn first');
			});

			guest.on('play', function(data) {
				expect(data.card).to.deep.equal(dt);
				expect(data.category).to.deep.equal('unpalatibility');
				expect(data.score).to.deep.equal(94);

				// pretend guest lost, send victorious event to client
				guest.emit('victorious', gk);
			});
		});

		host.on('gameCreated', function(newGameId) {
			expect(newGameId).to.not.be.null;
			expect(newGameId).to.be.a('string');
			gameId = newGameId;
		});

		host.on('status', function(data) {
			expect(data).to.contain('It\'s your turn first');
		});

		host.on('victorious', function(card) {
			expect(card).to.deep.equal(gk);

			// next round - should both be false before we emit the events
			expect(game.games[gameId].playerHostNextRound).to.be.false;
			expect(game.games[gameId].playerClientNextRound).to.be.false;

			host.emit('nextRound', {});

			// wait for nextRound messages to be sent
			// must be a better way of doing this?
			setTimeout(function() {
				expect(game.games[gameId].playerHostNextRound).to.be.true;
				expect(game.games[gameId].playerClientNextRound).to.be.false;
				
				guest.emit('nextRound', {});

				setTimeout(function() {
					// both players are now ready for the next round
					// next round property resets to false
					expect(game.games[gameId].playerHostNextRound).to.be.false;
					expect(game.games[gameId].playerClientNextRound).to.be.false;

					done();
				}, 200);

			}, 200);
			
		});

	});


	it('onDefeated is called when player in-turn loses a round', function(done) {
		host = io.connect('http://localhost:3000');

		host.on('onconnected', function(data) {
			expect(game.gameCount).to.deep.equal(1);

			// 2nd player joins...
			guest = io.connect('http://localhost:3000');

			guest.on('onconnected', function(data) {
				expect(game.gameCount).to.deep.equal(1);

				// now the game has started...
				// host goes first and plays a card
				host.emit('play', { card: dt, category: 'unpalatibility', score: 94 });
			});

			guest.on('status', function(data) {
				expect(data).to.contain('It\'s your opponent\'s turn first');
			});

			guest.on('play', function(data) {
				expect(data.card).to.deep.equal(dt);
				expect(data.category).to.deep.equal('unpalatibility');
				expect(data.score).to.deep.equal(94);

				// pretend guest won
				// send score back to client so his slider moves
				guest.emit('opponentScore', 62);

				// now send defeated event to client
				guest.emit('defeated');
			});
		});

		host.on('gameCreated', function(newGameId) {
			expect(newGameId).to.not.be.null;
			expect(newGameId).to.be.a('string');
			gameId = newGameId;
		});

		host.on('status', function(data) {
			expect(data).to.contain('It\'s your turn first');
		});

		host.on('opponentScore', function(score) {
			expect(score).to.deep.equal(62);
		});

		host.on('defeated', function() {
			defeatedCallbacks++;
			expect(defeatedCallbacks).to.deep.equal(1);

			// setTimeout function to make sure all messages are emitted
			// must be a better way of doing this?
			setTimeout(function() {
				done();
			}, 200);
		});
	});


	afterEach(function(done) {
		// disconnect and clean up
		// have to call endGame to kill connections from the server side
		// (we're using socket.io-client in the tests)
		host.disconnect();
		guest.disconnect();
		game.endGame(gameId, host.userid);

		// now we're cleaned up there shouldn't be any games left
		expect(game.gameCount).to.deep.equal(0);

		done();
	});
});


describe('game abort test', function() {
	var host;
	var guest;
	var gameId;
	var abortMessagesReceived = 0;

	before(function(done) {
		expect(game.gameCount).to.deep.equal(0);
		done();
	});


	it('When the host aborts, the guest gets notified', function(done) {
		host = io.connect('http://localhost:3000');

		host.on('onconnected', function(data) {
			expect(data.id).to.be.a('string');
			expect(game.gameCount).to.deep.equal(1);
			
			// 2nd player joins...
			guest = io.connect('http://localhost:3000');

			guest.on('onconnected', function(data) {
				expect(data.id).to.be.a('string');
				expect(game.gameCount).to.deep.equal(1);

				// now the game has started...
				// host aborts
				host.emit('abort');
			});

			guest.on('abort', function() {
				abortMessagesReceived++;
				done();
			});
		});

		host.on('gameCreated', function(newGameId) {
			expect(newGameId).to.not.be.null;
			expect(newGameId).to.be.a('string');
			gameId = newGameId;
		});

		// shouldn't be called
		host.on('abort', function() {
			abortMessagesReceived++;
		});
	});


	after(function(done) {
		// disconnect and clean up
		// have to call endGame to kill connections from the server side
		// (we're using socket.io-client in the tests)
		host.disconnect();
		guest.disconnect();

		game.endGame(gameId, host.userid);

		// now we're cleaned up there shouldn't be any games left
		expect(game.gameCount).to.deep.equal(0);

		// client (guest) should have received an abort event
		expect(abortMessagesReceived).to.deep.equal(1);

		done();
	});
});


describe('game abort test 2', function() {
	var host;
	var guest;
	var gameId;
	var abortMessagesReceived = 0;

	before(function(done) {
		expect(game.gameCount).to.deep.equal(0);
		done();
	});


	it('When the guest aborts, the host gets notified', function(done) {
		host = io.connect('http://localhost:3000');

		host.on('onconnected', function(data) {
			expect(data.id).to.be.a('string');
			expect(game.gameCount).to.deep.equal(1);
			
			// 2nd player joins...
			guest = io.connect('http://localhost:3000');

			guest.on('onconnected', function(data) {
				expect(data.id).to.be.a('string');
				expect(game.gameCount).to.deep.equal(1);

				// now the game has started...
				// guest aborts
				guest.emit('abort');
			});

			// shouldn't be called
			guest.on('abort', function() {
				abortMessagesReceived++;
			});
		});

		host.on('gameCreated', function(newGameId) {
			expect(newGameId).to.not.be.null;
			expect(newGameId).to.be.a('string');
			gameId = newGameId;
		});

		host.on('abort', function() {
			abortMessagesReceived++;
			done();
		});
	});


	after(function(done) {
		// disconnect and clean up
		// have to call endGame to kill connections from the server side
		// (we're using socket.io-client in the tests)
		host.disconnect();
		guest.disconnect();

		game.endGame(gameId, host.userid);

		// now we're cleaned up there shouldn't be any games left
		expect(game.gameCount).to.deep.equal(0);

		// client (guest) should have received an abort event
		expect(abortMessagesReceived).to.deep.equal(1);

		done();
	});
});


describe('store module tests', function() {
	var url = 'mongodb://localhost:27017/tc';
	var collection;
	var nBronze = 0;
	var nSilver = 0;
	var nGold = 0;
	var nBrownPlatinum = 0;

	it('cuntal order counts are initialised', function(done) {
		store.initialiseQuantities(function(err, res) {
			// assign counts to variables for later tests
			nBronze = store.nBronze;
			nSilver = store.nSilver;
			nGold = store.nGold;
			nBrownPlatinum = store.nBrownPlatinum;

			expect(store.nBronze).to.be.above(0);
			expect(store.nSilver).to.be.above(0);
			expect(store.nGold).to.be.above(0);
			expect(store.nBrownPlatinum).to.be.above(0);
	
			done();
		});
	});

	it('get all bronze cards returns correct amount', function(done) {
		store.getCards("Bronze", 100, function(err, results) {
			expect(results.length).to.deep.equal(nBronze);

			done();
		});
	});

	it('get 20% of bronze cards returns correct amount', function(done) {
		store.getCards("Bronze", 20, function(err, results) {
			expect(results.length).to.deep.equal(Math.ceil(nBronze * 20 / 100));

			done();
		});
	});

	it('get all silver cards returns correct amount', function(done) {
		store.getCards("Silver", 100, function(err, results) {
			expect(results.length).to.deep.equal(nSilver);

			done();
		});
	});

	it('get 20% of silver cards returns correct amount', function(done) {
		store.getCards("Silver", 20, function(err, results) {
			expect(results.length).to.deep.equal(Math.ceil(nSilver * 20 / 100));

			done();
		});
	});

	it('get all gold cards returns correct amount', function(done) {
		store.getCards("Gold", 100, function(err, results) {
			expect(results.length).to.deep.equal(nGold);

			done();
		});
	});

	it('get 20% of gold cards returns correct amount', function(done) {
		store.getCards("Gold", 20, function(err, results) {
			expect(results.length).to.deep.equal(Math.ceil(nGold * 20 / 100));

			done();
		});
	});

	it('get all brown platinum cards returns correct amount', function(done) {
		store.getCards("Brown Platinum", 100, function(err, results) {
			expect(results.length).to.deep.equal(nBrownPlatinum);

			done();
		});
	});

	it('get 5% of brown platinum cards returns correct amount', function(done) {
		store.getCards("Brown Platinum", 5, function(err, results) {
			expect(results.length).to.deep.equal(Math.ceil(nBrownPlatinum * 5 / 100));

			done();
		});
	});

	it('pick random cards returns correct values', function(done) {
		var testCardIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
		var testPack = store.pickRandomCards(testCardIds, 5);

		expect(testPack).to.have.lengthOf(5);
		testPack.forEach(function(card) {
			expect(testCardIds).to.include(card);
		});

		done();
	});

	it('add pack to user\'s collection functions as expected', function(done) {
		var pack = [
			mongoose.Types.ObjectId("5988ae1930b679186ca450e4"),
			mongoose.Types.ObjectId("59c28888cf65c31384143f2b"),
			mongoose.Types.ObjectId("5896327a45c58e2e78ae0140"),
			mongoose.Types.ObjectId("5896371245c58e2e78ae0150"),
			mongoose.Types.ObjectId("58963d2345c58e2e78ae0162")
		];
		var cardsGot = 0;
		var cardsNotGot = 0;
		
		store.addPackToUserCollection("thedonald@trump.com", pack, function(err, res) {
			res.forEach(function(card) {
				if(card.got) {
					cardsGot++;
				} else {
					cardsNotGot++;
				}
			});
			expect(res).to.have.lengthOf(5);
			expect(cardsGot).to.deep.equal(0);
			expect(cardsNotGot).to.deep.equal(5);

			done();
		});
	});

	it('add pack to user\'s collection ignores both kinds of duplicates', function(done) {
		var pack = [
			mongoose.Types.ObjectId("58963c0945c58e2e78ae015d"),
			mongoose.Types.ObjectId("58963ed645c58e2e78ae016c"),
			mongoose.Types.ObjectId("5896495f45c58e2e78ae01a5"),	// duplicate (user already has this card)
			mongoose.Types.ObjectId("5896468245c58e2e78ae0194"),
			mongoose.Types.ObjectId("58963c0945c58e2e78ae015d")		// duplicate within the pack itself
		];
		var cardsGot = 0;
		var cardsNotGot = 0;
		
		store.addPackToUserCollection("thedonald@trump.com", pack, function(err, res) {
			res.forEach(function(card) {
				if(card.got) {
					cardsGot++;
				} else {
					cardsNotGot++;
				}
			});
			expect(res).to.have.lengthOf(5);
			expect(cardsGot).to.deep.equal(2);
			expect(cardsNotGot).to.deep.equal(3);

			done();
		});
	});

	it('add pack to user\'s collection ignores a card duplicated multiple times', function(done) {
		var pack = [
			mongoose.Types.ObjectId("58962d1e45c58e2e78ae0127"),
			mongoose.Types.ObjectId("58963c8445c58e2e78ae015f"),	// duplicate (user already has this card)
			mongoose.Types.ObjectId("58962d1e45c58e2e78ae0127"),	// duplicate within the pack itself
			mongoose.Types.ObjectId("58962d8345c58e2e78ae0129"),
			mongoose.Types.ObjectId("58962d1e45c58e2e78ae0127")		// another duplicate within the pack itself
		];
		var cardsGot = 0;
		var cardsNotGot = 0;
		
		store.addPackToUserCollection("thedonald@trump.com", pack, function(err, res) {
			res.forEach(function(card) {
				if(card.got) {
					cardsGot++;
				} else {
					cardsNotGot++;
				}
			});
			expect(res).to.have.lengthOf(5);
			expect(cardsGot).to.deep.equal(3);
			expect(cardsNotGot).to.deep.equal(2);

			done();
		});
	});

	it('purchase bronze pack returns a pack of card object ids of correct length', function(done) {
		var objectId = mongoose.Types.ObjectId;

		store.purchaseBronze("thedonald@trump.com", function(err, pack) {
			expect(pack).to.have.lengthOf(5);
			pack.forEach(function(card) {
				expect(objectId.isValid(card)).to.be.true;
			});

			done();
		});
	});

	it('purchase bronze premium pack returns a pack of card object ids of correct length', function(done) {
		var objectId = mongoose.Types.ObjectId;

		store.purchaseBronzePremium("thedonald@trump.com", function(err, pack) {
			expect(pack).to.have.lengthOf(5);
			pack.forEach(function(card) {
				expect(objectId.isValid(card)).to.be.true;
			});

			done();
		});
	});

	it('purchase silver pack returns a pack of card object ids of correct length', function(done) {
		var objectId = mongoose.Types.ObjectId;

		store.purchaseSilver("thedonald@trump.com", function(err, pack) {
			expect(pack).to.have.lengthOf(5);
			pack.forEach(function(card) {
				expect(objectId.isValid(card)).to.be.true;
			});

			done();
		});
	});

	it('purchase silver premium pack returns a pack of card object ids of correct length', function(done) {
		var objectId = mongoose.Types.ObjectId;

		store.purchaseSilverPremium("thedonald@trump.com", function(err, pack) {
			expect(pack).to.have.lengthOf(5);
			pack.forEach(function(card) {
				expect(objectId.isValid(card)).to.be.true;
			});

			done();
		});
	});

	it('purchase gold pack returns a pack of card object ids of correct length', function(done) {
		var objectId = mongoose.Types.ObjectId;

		store.purchaseGold("thedonald@trump.com", function(err, pack) {
			expect(pack).to.have.lengthOf(5);
			pack.forEach(function(card) {
				expect(objectId.isValid(card)).to.be.true;
			});

			done();
		});
	});

	it('purchase gold premium pack returns a pack of card object ids of correct length', function(done) {
		var objectId = mongoose.Types.ObjectId;

		store.purchaseGoldPremium("thedonald@trump.com", function(err, pack) {
			expect(pack).to.have.lengthOf(5);
			pack.forEach(function(card) {
				expect(objectId.isValid(card)).to.be.true;
			});

			done();
		});
	});

	it('payment is taken when a pack is bought', function(done) {
		store.updateBoon("thedonald@trump.com", -500, function(err, updatedBoon) {
			expect(err).to.be.null;
			// once all of the previous purchases tests have been taken into account
			// (one of each pack) then his balance is 
			expect(updatedBoon).to.be.below(0);

			done();
		});
	});

	after(function(done) {
		// cleanup - remove non-duplicate cards from collection
		var pack = [
			mongoose.Types.ObjectId("58963c0945c58e2e78ae015d"),
			mongoose.Types.ObjectId("58963ed645c58e2e78ae016c"),
			mongoose.Types.ObjectId("5896468245c58e2e78ae0194"),
			mongoose.Types.ObjectId("58962d1e45c58e2e78ae0127"),
			mongoose.Types.ObjectId("58962d8345c58e2e78ae0129"),
			mongoose.Types.ObjectId("5988ae1930b679186ca450e4"),
			mongoose.Types.ObjectId("59c28888cf65c31384143f2b"),
			mongoose.Types.ObjectId("5896327a45c58e2e78ae0140"),
			mongoose.Types.ObjectId("5896371245c58e2e78ae0150"),
			mongoose.Types.ObjectId("58963d2345c58e2e78ae0162")
		];

		store.removeCardFromCollection("thedonald@trump.com", pack, function(err) {
			// refund
			store.updateBoon("thedonald@trump.com", 14750, function(err, updatedBoon) {
				done();
			});
		});
	});

});


describe('sentiment analysis tests', function() {
	it('getSentimentAnalysis function returns json response', function(done) {
		bot.getSentimentAnalysis("Great!", function(err, res) {
			expect(err).to.be.a('null');
			expect(res).to.be.an('object');
			expect(res.documents).to.be.an('array');
			expect(res.documents[0].score).to.be.a('number');
			expect(res.errors).to.be.an('array');
			expect(res.errors).to.be.empty;

			done();
		});
	});

	it('getSentimentAnalysis function handles errors', function(done) {
		bot.getSentimentAnalysis("This will cause an error", function(err, res) {
			expect(err).to.not.be.null;
			expect(res).to.be.a('null');

			done();
		});
	});
});


describe('bot tests', function() {
	// var connector = new builder.ConsoleConnector();
	// var botMock = bot.create(connector);

	it('Hello intent matches', function(done) {
		var connector = new builder.ConsoleConnector();
		var botMock = bot.create(connector);

		botMock.on('send', function(msg) {
			expect(msg).to.not.be.null;
			expect(botResponses.helloIntentResponses).to.include(msg.text);

			done();
		});

		connector.processMessage('Hello');
	});

	it('Age intent matches', function(done) {
		var connector = new builder.ConsoleConnector();
		var botMock = bot.create(connector);

		botMock.on('send', function(msg) {
			expect(msg).to.not.be.null;
			expect(botResponses.ageIntentResponses).to.include(msg.text);

			done();
		});

		connector.processMessage('Age');
	});

	// check appearance intent because it sends multiple responses...
	// it('Appearance intent matches', function(done) {
	// 	var connector = new builder.ConsoleConnector();
	// 	var botMock = bot.create(connector);

	// 	botMock.on('send', function(msg) {
	// 		console.log(msg);
	// 		expect(msg).to.not.be.null;
	// 		// expect(botResponses.appearanceIntentResponses).to.include(msg.text);

	// 		done();
	// 	});

	// 	connector.processMessage('Appearance');
	// });

	it('Create intent matches', function(done) {
		var connector = new builder.ConsoleConnector();
		var botMock = bot.create(connector);

		botMock.on('send', function(msg) {
			expect(msg).to.not.be.null;
			expect(botResponses.createIntentResponses).to.include(msg.text);

			done();
		});

		connector.processMessage('Create');
	});

	// check intent because it calls sentiment analysis function...
	// it('Feedback Donald intent matches', function(done) {
	// 	var connector = new builder.ConsoleConnector();
	// 	var botMock = bot.create(connector);

	// 	botMock.on('send', function(msg) {
	// 		console.log("Feedback: ", msg);
	// 		expect(msg).to.not.be.null;
	// 		expect(botResponses.donaldFeedbackNegativeResponses).to.include(msg.text);

	// 		done();
	// 	});

	// 	connector.processMessage('Feedback Donald');
	// });

	it('Find intent matches', function(done) {
		var connector = new builder.ConsoleConnector();
		var botMock = bot.create(connector);

		botMock.on('send', function(msg) {
			expect(msg).to.not.be.null;
			expect(botResponses.findIntentResponses).to.include(msg.text);

			done();
		});

		connector.processMessage('Find');
	});

	it('Help intent matches', function(done) {
		var connector = new builder.ConsoleConnector();
		var botMock = bot.create(connector);

		botMock.on('send', function(msg) {
			expect(msg).to.not.be.null;
			expect(botResponses.helpIntentResponses).to.include(msg.text);

			done();
		});

		connector.processMessage('Help');
	});

	it('Hobbies intent matches', function(done) {
		var connector = new builder.ConsoleConnector();
		var botMock = bot.create(connector);

		botMock.on('send', function(msg) {
			expect(msg).to.not.be.null;
			expect(botResponses.hobbiesIntentResponses).to.include(msg.text);

			done();
		});

		connector.processMessage('Hobbies');
	});

	it('Language intent matches', function(done) {
		var connector = new builder.ConsoleConnector();
		var botMock = bot.create(connector);

		botMock.on('send', function(msg) {
			expect(msg).to.not.be.null;
			expect(botResponses.languageIntentResponses).to.include(msg.text);

			done();
		});

		connector.processMessage('Language');
	});

	it('Location intent matches', function(done) {
		var connector = new builder.ConsoleConnector();
		var botMock = bot.create(connector);

		botMock.on('send', function(msg) {
			expect(msg).to.not.be.null;
			expect(botResponses.locationIntentResponses).to.include(msg.text);

			done();
		});

		connector.processMessage('Location');
	});

	it('Modify intent matches', function(done) {
		var connector = new builder.ConsoleConnector();
		var botMock = bot.create(connector);

		botMock.on('send', function(msg) {
			expect(msg).to.not.be.null;
			expect(botResponses.modifyIntentResponses).to.include(msg.text);

			done();
		});

		connector.processMessage('Modify');
	});

	it('None intent matches', function(done) {
		var connector = new builder.ConsoleConnector();
		var botMock = bot.create(connector);

		botMock.on('send', function(msg) {
			expect(msg).to.not.be.null;
			expect(botResponses.noneIntentResponses).to.include(msg.text);

			done();
		});

		connector.processMessage('None');
	});

	it('Reality intent matches', function(done) {
		var connector = new builder.ConsoleConnector();
		var botMock = bot.create(connector);

		botMock.on('send', function(msg) {
			expect(msg).to.not.be.null;
			expect(botResponses.realityIntentResponses).to.include(msg.text);

			done();
		});

		connector.processMessage('Reality');
	});

	it('State intent matches', function(done) {
		var connector = new builder.ConsoleConnector();
		var botMock = bot.create(connector);

		botMock.on('send', function(msg) {
			expect(msg).to.not.be.null;
			expect(botResponses.stateIntentResponses).to.include(msg.text);

			done();
		});

		connector.processMessage('State');
	});

	it('Time intent matches', function(done) {
		var connector = new builder.ConsoleConnector();
		var botMock = bot.create(connector);

		botMock.on('send', function(msg) {
			expect(msg).to.not.be.null;
			expect(botResponses.timeIntentResponses).to.include(msg.text);

			done();
		});

		connector.processMessage('Time');
	});

	it('What intent matches', function(done) {
		var connector = new builder.ConsoleConnector();
		var botMock = bot.create(connector);

		botMock.on('send', function(msg) {
			expect(msg).to.not.be.null;
			expect(botResponses.whatIntentResponses).to.include(msg.text);

			done();
		});

		connector.processMessage('What');
	});

	it('Who intent matches', function(done) {
		var connector = new builder.ConsoleConnector();
		var botMock = bot.create(connector);

		botMock.on('send', function(msg) {
			expect(msg).to.not.be.null;
			expect(botResponses.whoIntentResponses).to.include(msg.text);

			done();
		});

		connector.processMessage('Who');
	});
});


// this is an integration test and it requires the local passport strategy
// which I'd intended to eventually remove...
// describe('Purchase endpoint tests', function() {
// 	it('/purchase/bronze functions as expected', function(done) {
// 		var agent = chai.request.agent(app);

// 		agent.post('/auth/local')
// 			 .send({'email': 'thedonald@trump.com', 'password': '123'})
// 			 .then(function(res) {
// 				agent.get('/purchase/bronze').then(function (res) {
// 					expect(res).to.have.status(200);
// 					expect(res).to.be.json;

// 				   	done();
// 				})
// 				.catch(function(err) {
// 					console.log("Error: ", err);
// 					done();
// 				});
// 			 })
// 			 .catch(function(err) {
// 				console.log("Error: ", err);
// 				done();
// 			 });
// 	});
// });