'use strict';

// admin login: WAFFFLES

// make new table
// once time and room have been set, that row will move to a 'completed' table
// once time is selected, get list of available rooms 
// save and reset button
// save populates morning schedule
// check for room and time collisions


app.controller('AdminCtrl', function ($scope, $filter, SessionList, Polling, RoomList) {

  $scope.unSortedSessions = SessionList;
  $scope.sessions = [];
  $scope.availability = Polling;
  $scope.sortByType = "rank";
  $scope.reverseSort = false;
  
  //filter sessions by total_votes
  $scope.addSessionRankingByVotes = () => {
    $scope.SessionListings = $filter('orderBy')($scope.unSortedSessions, 'total_votes', !$scope.reverse);
    let i = 0;
      angular.forEach($scope.SessionListings, function(value, key){
        $scope.SessionListings[i].Rank = i+1;
        i++;
      });
    $scope.sessions = $scope.SessionListings;

  }
  $scope.addSessionRankingByVotes();

  $scope.timeValue = (e) => {
    console.log("clicked", e); 
  }


  // display list of times
  $scope.times = ["8:30am", "9:00am", "9:30am", "10:30am", "11:00am", "11:30am"];
  $scope.rooms = RoomList; // array of rooms from FB

  // once time is selected, show available rooms

  // if the room contains a session for the selected time, do not show
  // does room contain time? 

  // once time and room have been set, that row will move to a 'completed' table
  // update to firebase

});
