'use strict';
app.controller('AdminCtrl', function($scope, $filter, SessionList, Polling, Constants, Admin, $http){
  // This JS will execute on page load

  $scope.rooms = ["Alpha", "Zulu", "Whiskey", "Tango"];
  $scope.times = ["09:30", "10:30", "11:30", "1:30", "2:30", "3:30" ];
  
  //to add rank for the session (ie, 1, 2, 3, must first create a new unsorted array then sort the array by the total votes)
   $scope.setTime = (time, session) => {
    session.Time = time;
  }

  $scope.setRoom = (room, session) => {
    session.Room = room;
  }

  $scope.addRankingByVotes = (sessions) =>{
    let unSortedArray = []
    let i = 0;
    let SessionListings = $filter('orderBy')(sessions, 'total_votes', !$scope.reverse);
    angular.forEach(SessionListings, function (session){
      SessionListings[i].Rank = i+1;
      i++;
    });
    return SessionListings;
  }

  $scope.prepareSchedule = (timeOfDay) => {
    let preparedSchedule = [];
    let conflictCheck = [];
    if(!timeOfDay){
      alert('Select Morning or Aftxernoon from the sessions dropdown');
    }
    timeOfDay = timeOfDay.split("")[0].toUpperCase() + timeOfDay.slice(1);    
    angular.forEach($scope.sessions, function(session, index){
      if (session.Time && session.Room){
        session.index = index;
        preparedSchedule.push(session);
      }
    });
    updateScheduleToFirebase(timeOfDay, preparedSchedule)
  }

  const updateScheduleToFirebase = (timeOfDay, schedule) =>{
    const scheduleIndexes = schedule.map(each => each.index)
    return ($http.put(`${Constants.firebaseUrl}/Schedules/${timeOfDay}.json`, schedule))
      .then(() => {
        //index array has to match index in firebase
      Admin.selectSessions(scheduleIndexes)
      console.log('Schedule created')
    });
  }
  firebase.database().ref('/').on('value', (root) => {
      const {Sessions, Schedules} = root.val();
      if (Schedules) {
        // Admin.mapSessions(Sessions, Schedules.Morning);
        let mapSessions = Admin.mapSessions(Sessions, Schedules.Morning);
        $scope.sessions = $scope.addRankingByVotes(mapSessions);
      }
      //checks if $digest is in progress, if first time user visit or on refresh $scope.$apply, else simply let digest run
      if (!$scope.$$phase) {
          $scope.$apply();
      }
  });
})//end

