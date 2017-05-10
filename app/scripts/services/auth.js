angular.module('BarcampApp')
	.factory('AuthService', function ($http, $q, webStorage, $location, $rootScope, $firebase, User) {
		var user = webStorage.get('user'),
			ref = new Firebase('https://nashvillebarcamp.firebaseio.com/');

		if (user) {
			ref.authWithCustomToken(user.token, function (err) {
				if (!err) {
					$rootScope.user = new User(user.user);
					if (user.user.admin) {
						$location.path('/admin');
					} else {
						$location.path('/sessions');
					}
					$rootScope.$apply();
				}
			});
		}

		function onAuthResponse(response) {
			var user = response.data;
			webStorage.add('user', user);
			ref.authWithCustomToken(user.token, function (err, me) {
				if (!err) {
					$rootScope.user = new User(user.user);
					if (user.user.admin) {
						$location.path('/admin');
					} else {
						$location.path('/sessions');
					} 
					$rootScope.$apply();
				} 
			});
		}

		return {
			login: function (id) {
				return $http.post('/login', { id: id }).then(onAuthResponse);
			},

			logout: function () {
				ref.unauth();
				$rootScope.user = null;
				user = null;
				webStorage.remove('user');
				$location.path('/login');
			}
		};
	})
;
