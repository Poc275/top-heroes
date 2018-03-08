angular.module('TCModule').factory('Users', function UsersFactory($http, Auth) {
	return {
		getToken: function() {
			return $http.get('/me/token');
		},
		getUsersStats: function() {
			return $http.get('/me/stats', {
				headers: {
					Authorization: 'Bearer ' + Auth.getToken()
				}
			});
		},
		updateUsersStats: function(newStats) {
			return $http.put('/me/stats', newStats, {
				headers: {
					Authorization: 'Bearer ' + Auth.getToken()
				}
			});
		},
		levelUp: function() {
			return $http.put('/me/levelup', '', {
				headers: {
					Authorization: 'Bearer ' + Auth.getToken()
				}
			});
		},
		updateUsersBoon: function(amount) {
			return $http.put('/me/boon', amount, {
				headers: {
					Authorization: 'Bearer ' + Auth.getToken()
				}
			});
		}
	};
});