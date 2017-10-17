'use strict';
app.controller('AdminCtrl', function($scope, $filter, Polling, Constants, Admin, Rooms, Times) {

  $scope.rooms = Rooms;
  $scope.times = Times; // Will need to select times.Morning or times.Afternoon. Can simplify if need be.

  const addRankingByVotes = (sessions) =>{
    const SessionListings = sessions.map((session, i) => {
        session.index = i;
        session.Rank = i + 1;
        session.total_votes = (session.total_votes) ? session.total_votes : 0;
        return session;
    });

    return $filter('orderBy')(SessionListings, 'total_votes', true);
  };

  //to add rank for the session (ie, 1, 2, 3, must first create a new unsorted array then sort the array by the total votes)
   $scope.setTime = (time, session) => {
    session.Time = time;
   };

  $scope.setRoom = (room, session) => {
    session.Room = room;
  };

  $scope.clearSession = (session) => {
    session.Room = '';
    session.Time = '';
  };

  $scope.clearAllSessions = () => {
      $scope.realTimeSessions.forEach(each => $scope.clearSession(each));
  };

  $scope.disableSessionSelect = (session) => {
      if (session.selected === 'Morning' && $scope.selectedSchedule === 'Afternoon') {
          return true;
      } else if (session.selected === 'Afternoon' && $scope.selectedSchedule === 'Morning') {
          return true;
      }
  };

  $scope.prepareSchedule = () => {
    let preparedSchedule = [];
    let conflictCheck = [];
    if(!$scope.selectedSchedule){
      alert('Select Morning or Aftxernoon from the sessions dropdown');
      return;
    }

    angular.forEach($scope.sessions, function(session){
      if (session.Time && session.Room){
        preparedSchedule.push(session);
      }
    });

    Admin.updateScheduleToFirebase($scope.selectedSchedule, preparedSchedule);
  };

  $scope.displaySchedule = () => {
    if (!$scope.selectedSchedule || !$scope.realtimeSchedules || !$scope.realtimeSchedules[$scope.selectedSchedule]) {
        $scope.clearAllSessions();
        $scope.sessions = addRankingByVotes($scope.realTimeSessions);
        return;
    }
    $scope.clearAllSessions();

    const sessions = $scope.realTimeSessions;
    const schedule = $scope.realtimeSchedules[$scope.selectedSchedule];
    const mappedSessions = Admin.mapSessions(sessions, schedule);
    $scope.sessions = addRankingByVotes(mappedSessions);
  };

  // JS below will run on pageload
  firebase.database().ref('/').on('value', (root) => {
      const { Sessions, Schedules } = root.val();

      $scope.realTimeSessions = Sessions;
      $scope.realtimeSchedules = Schedules;

      // On initial page load, show all empty sessions and do not load preexisting schedules.
      if (Sessions && !$scope.selectedSchedule) {
        $scope.sessions = addRankingByVotes(Sessions);
      } else if (Schedules && $scope.selectedSchedule) {
        $scope.displaySchedule();
      }

      // checks if $digest is in progress, if first time user visit or on refresh $scope.$apply, else simply let digest run
      if (!$scope.$$phase) {
          $scope.$apply();
      }
  });
})//end
