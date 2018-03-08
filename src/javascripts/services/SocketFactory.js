// this is a wrapper service around socket.io on the client
// this enables it to be tested
// we use $rootScope.$apply() to force a template update after an event
// $rootScope not $scope because services don't have their own $scope, they're singletons
angular.module('TCModule').factory('socket', function SocketFactory($rootScope) {
	var socket;

	return {
		connect: function() {
			socket = io.connect();
		},
		disconnect: function() {
			socket.disconnect();
		},
		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},
		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					if(callback) {
						callback.apply(socket, args);
					}
				});
			});
		}
	};
});
