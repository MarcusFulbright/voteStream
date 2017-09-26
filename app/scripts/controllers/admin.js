'use strict';
app.controller('AdminCtrl', function($scope, $filter, SessionList, Polling, Constants, $http){
  // This JS will execute on page load
  firebase.database().ref('/Sessions').on('value', (sessions) => {
      if (sessions.val()) {
          $scope.addRankingByVotes(sessions.val());
          // $scope.unSortedSessionsObject = sessions.val();
          // $scope.MakeUnSortedSessionsArray(sessions.val());
          // $scope.addSessionRankingByVotes();
      }

      //checks if $digest is in progress, if first time user visit or on refresh $scope.$apply, else simply let digest run
      if (!$scope.$$phase) {
          $scope.$apply();
      }
  });


  $scope.sessions = [];
  $scope.rooms = ["Alpha", "Zulu", "Whiskey", "Tango"];
  $scope.times = ["09:30", "10:30", "11:30", "1:30", "2:30", "3:30" ];
  //to add rank for the session (ie, 1, 2, 3, must first create a new unsorted array then sort the array by the total votes)

   $scope.setTime = (e, session) => {
    session.Time = e;
  }

  $scope.setRoom = (e, session) => {
    session.Room = e;
  }

  $scope.addRankingByVotes = (sessions) =>{
    let unSortedArray = []
    let i = 0;
    let SessionListings = $filter('orderBy')(sessions, 'total_votes', !$scope.reverse);
    angular.forEach(SessionListings, function (session){
      SessionListings[i].Rank = i+1;
      i++;
    });
    $scope.sessions = SessionListings;
  }

  $scope.prepareSchedule = (timeOfDay) => {
    let preparedSchedule = [];
    let conflictCheck = [];
    if(!timeOfDay){
      alert('Select Morning or Afternoon from the sessions dropdown');
    }
    timeOfDay = timeOfDay.split("")[0].toUpperCase() + timeOfDay.slice(1);    
    angular.forEach($scope.sessions, function(session){
      if (!session.Time && !session.Room){
        //
      } else {
        preparedSchedule.push(session);
      }
    });
    // console.log(preparedSchedule)
    // for (var i = 0; i < preparedSchedule.length; i++){
    //   conflictCheck.push([preparedSchedule[i].Time, preparedSchedule[i].Room])
    // }
    for (var i = 0; i < preparedSchedule.length; i++){
      var len = preparedSchedule.length;
      var current = preparedSchedule[i];
      var previous = preparedSchedule[(i+len-1)%len];
      var next = preparedSchedule[(i+1)%len];
      if(current.Time === next.Time && current.Room === next.Room){
        console.log('stop!')
        alert('There are scheduling conflicts with' + current.Title + ' and ' + next.Title)
      }
    }

    updateScheduleToFirebase(timeOfDay, preparedSchedule)
  }

  $scope.checkConflicts = (array) => {

  }

  const updateScheduleToFirebase = (timeOfDay, schedule) =>{
    console.log(schedule)
    return ($http.put(`${Constants.firebaseUrl}/Schedule/${timeOfDay}.json`, schedule))
    .then(() => {
      console.log('Schedule created')
    })
    .catch(console.error);
  }


})//end

