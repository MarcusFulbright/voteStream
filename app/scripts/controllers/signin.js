'use strict';

app.controller('SigninCtrl', function ($scope, $location, AuthService) {

	AuthService.getAllUsers().then((userList)=>{
		$scope.badges = userList;
		console.log($scope.badges);
	});

  $scope.login = (id) => {
		if (!id) { return $scope.error = 'Please enter a badge ID.'};

  	Object.keys($scope.badges).forEach((badge)=>{
  		if ($scope.badgeId.toUpperCase() === badge){
  			$location.path('/#!/sessions');
  		} else {
				$scope.error = 'Invalid badge ID.';
			};
  	});
 	};

});
