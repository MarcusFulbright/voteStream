'use strict';

app.controller('SigninCtrl', function ($scope, $location, AuthService, User) {

	// calls getAllUsers from auth.js in services, then returns as userList
	AuthService.getAllUsers().then((userList)=>{
		$scope.badges = userList;
	});

	//takes id from badgeId model in signin.html
	$scope.login = (id) => {

		//if no id is entered, return error variable for signin.html
		if (!id) { return $scope.error = 'Please enter a badge ID.'};

		//Loops through and places keys from badges objects into an array
		Object.keys($scope.badges).forEach((badge)=>{

			//if badgeId from signin.html matches a badge, route to sessions
			if ($scope.badgeId.toUpperCase() === badge && $scope.badges[badge].admin === false){
		
				User.setUser(badge);
				$location.path('/sessions');

			//else return error variable for signin.html
			} else if ($scope.badgeId.toUpperCase() === badge && $scope.badges[badge].admin === true){
				User.setUser(badge)
				//todo
				//User.setAdmin(badge);
				$location.path('/admin');
			} else{
				$scope.error = 'Invalid badge ID.';
			};
		});
	};
});
