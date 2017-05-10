angular.module('BarcampApp',[
	'ngRoute',
	'firebase',
	'webStorageModule'

])

.config([
		'$routeProvider',
        '$httpProvider',
		function ($routeProvider, $locationProvider) {

			$routeProvider
/*//adds home route
				.when('/', {
					templateUrl : '/templates/home.html',
					allowAnonymousAccess:false,
				})*/
				.when('/admin', {
					templateUrl : '/templates/admin.html',
					controller : 'AdminCtrl',
					allowAnonymousAccess:false,
					adminAccess: true,
					resolve: {
						Sessions: function (SessionListing) {
							return SessionListing();
						}
					}
				})
				.when('/fullschedule', {
					templateUrl : '/templates/fullschedule.html',
					controller : 'FullScheduleCtrl',
					allowAnonymousAccess:false
/*
					adminAccess: true,
					resolve: {
						Sessions: function (SessionListing) {
							return SessionListing();
						}
					}
*/
				})
				.when('/sessions', {
					templateUrl: '/templates/sessionlist.html',
					controller: 'SessionListingCtrl',
					allowAnonymousAccess:false,
					resolve: {
						Sessions: function (SessionListing) {
							return SessionListing();
						}
					}
				}).when('/login', {
					templateUrl : '/templates/signin.html',
					controller : 'SigninCtrl',
					allowAnonymousAccess:true
				})
				.when('/logout', {
					redirectTo:'/login',
					allowAnonymousAccess:true
				})
				.otherwise({
					redirectTo:'/sessions'
				});
		}
])
.run(function ($rootScope, $location, $firebase, AuthService, User) {
	var lastPath,
		pollingRef = new Firebase('https://nashvillebarcamp.firebaseio.com/PollingState'),
		scheduleUrlRef = new Firebase('https://nashvillebarcamp.firebaseio.com/ScheduleURL');

	scheduleUrlRef.once('value', function (snapshot) { $rootScope.scheduleUrl = snapshot.val(); });

	$rootScope.pollingSync = $firebase(pollingRef).$asObject();
	$rootScope.logout = AuthService.logout;

	$rootScope.$on("$routeChangeStart", function(evt, next) {
		// User navigating
		if (!$rootScope.user && !(next && next.$$route && next.$$route.allowAnonymousAccess)) {
			lastPath = next && next.path;
			evt.preventDefault();
			$location.path('/login');
		}
	});
});
