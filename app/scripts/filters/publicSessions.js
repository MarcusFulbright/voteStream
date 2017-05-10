angular.module('BarcampApp')
	.filter('publicSessions', function ($rootScope) {
		var time = $rootScope.pollingSync.sessions;
		$rootScope.pollingSync.$watch(function () {
			time = $rootScope.pollingSync.sessions
		});
		return function (items) {
			return items.filter(function (item) {
				return item.availability.toLowerCase().indexOf(time) > -1 && !item.inSync.removed;
			});
		}
	})
;