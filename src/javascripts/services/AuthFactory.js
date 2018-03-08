angular.module('TCModule').factory('Auth', function AuthFactory($http, $window, $q) {
    return {
        // store the JWT in session storage which
        // only lasts during the current browser session
        saveToken: function(token) {
            $window.sessionStorage.setItem('tcToken', token);
        },
        getToken: function() {
            return $window.sessionStorage.getItem('tcToken');
        },
        logout: function() {
            // call server logout to remove oauth token first
            $http.get('/logout');
            // then remove jwt from session storage
            $window.sessionStorage.removeItem('tcToken');
        },
        isTokenValid: function() {
            var token = this.getToken();
            if(token) {
                var payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);
                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        },
        isAdmin: function() {
            var token = this.getToken();
            var payload = token.split('.')[1];
            payload = $window.atob(payload);
            payload = JSON.parse(payload);
            return $q.when(payload.role === 'admin');
        }
    };
});