//takes barcampUsername from ng-submit in sessionlist.html
// $scope.getFavorites = (userName) => {
// 	$scope.favoritesArray = []
//
// 	//returns specific user's favorites from list coming from sessions.js
// 	SessionListing.getFavoritesList(userName)
// 	.then(favoritesList => {
// 		$scope.favoriteSessions = favoritesList
// 		console.log("list from drupal:", $scope.favoriteSessions)
//
// 		//nested loop compares favorites from drupal site with all sessions
// 		for (let i = 0; i < $scope.sessions.length; i++) {
// 			for (let j = 0; j < $scope.favoriteSessions.length; j++) {
// 				if($scope.sessions[i].Nid.toString() === $scope.favoriteSessions[j].session.Nid) {
// 					$scope.favoritesArray.push($scope.sessions[i])
// 				}
// 			}
// 		}
// 		console.log("list after comparison:", $scope.favoritesArray)
// 	})
// }
