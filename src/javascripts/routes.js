angular.module('TCModule').config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/');

	$stateProvider.state('root', {
		url: '/',
		templateUrl: '/templates/index.html'
	})
	.state('home', {
		url: '/home',
		templateUrl: '/templates/home.html',
		controller: 'UserController'
	})
	.state('home.collection', {
		url: '/collection',
		templateUrl: '/templates/collection.html',
		controller: 'UserController'
	})
	.state('home.play', {
		url: '/play',
		templateUrl: '/templates/game.html',
		controller: 'GameController',
		params : { email: null, }
	})
	.state('home.playSolo', {
		url: '/play',
		templateUrl: '/templates/solo-game.html',
		controller: 'SoloGameController'
	})
	.state('home.store', {
		url: '/store',
		templateUrl: '/templates/store.html',
		controller: 'StoreController'
	})
	.state('home.cms', {
		url: '/cms',
		templateUrl: '/templates/cms.html',
		controller: 'CmsController',
		resolve: {
			access: ["Auth", function(Auth) {
				return Auth.isAdmin();
			}]
		}
	})
	// this route is for testing the appearance of a card
	// by name (note the controller can be removed in production)
	.state('card', {
		url: '/card/:name',
		templateUrl: '/templates/card-admin.html',
		controller: 'CardController',
		resolve: {
			access: ["Auth", function(Auth) {
				return Auth.isAdmin();
			}]
		}
	})
	.state('login', {
		url: '/login',
		templateUrl: '/templates/login-test.html'
	});
});