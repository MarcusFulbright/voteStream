'use strict';

app.controller('SigninCtrl', function ($scope, $location, User, $routeParams, AllUsers) {


	$scope.badges = AllUsers

	//takes id from badgeId model in signin.html
	$scope.login = (id) => {

		// if no id is entered, return error variable for signin.html
		if (!id) { return $scope.error = 'Please enter a badge ID.'};

		let userBadge = id.toUpperCase();
		let badgeFound = false;
		
		// loop through all badges for the userBadge
		for (let badge in $scope.badges) {
			if (userBadge === badge) {
				badgeFound = true;
				break;
			} 
		}
		// check if badge has been found
		if (badgeFound === true) {
			// set the user and redirect
			User.setUser(userBadge); 
			$location.path('/sessions'); 
		} else {
			// display error in signin.html
			$scope.error = 'Invalid badge ID.';
		};
	};

	if($routeParams.badgeId) {
		$scope.login($routeParams.badgeId)
	}

});
