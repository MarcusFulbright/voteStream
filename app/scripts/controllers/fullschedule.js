'use strict'

app.controller('FullScheduleCtrl', function ($scope) {

  $scope.scheduleByTime = [];
  $scope.rooms = [];
  $scope.morningRooms = [];
  $scope.afternoonRooms = [];
  $scope.showLabel = true;
  $scope.sessionGroups = [];
  $scope.morningGroups = [];
  $scope.afternoonGroups = [];
 

    $scope.sortScheduleByTime = (schedule, session) => {
        let scheduleObj = schedule[session].rooms;
        let numberOfRooms = Object.keys(scheduleObj).length;

        for (let i = 0; i <= numberOfRooms -1; i++) {
            for (let j = 0; j < scheduleObj[i].times.length; j++){
                if(session === "Morning") {
                  $scope.morningRooms.push(scheduleObj[i].times[j]);
                  scheduleObj[i].times[j]["room"] = scheduleObj[i].name;
                }
                if(session === "Afternoon") {
                  $scope.afternoonRooms.push(scheduleObj[i].times[j]);
                  scheduleObj[i].times[j]["room"] = scheduleObj[i].name;
                }
            }
        }
    }


    const sortOn = (sessions, attribute) => {
        sessions.sort(function(a, b) {
            if (a[attribute] < b[attribute]) {
                return -1
            } else {
                return 1
            }
        })
    }


    $scope.groupBy = (period, attribute) => {
        console.log("period:", period);
        sortOn(period, attribute)
        $scope.sessionGroups = [];
        let groupValue = ''
        let session;
        let group = {}

        for(let i = 0; i < period.length; i++) {
            session = period[i];
            if (session[attribute] != groupValue) {
                group = {
                    label: session[attribute],
                    sessions: []
                }

                groupValue = group.label;
                $scope.sessionGroups.push(group)
            }
            group.sessions.push(session)
        }
        if (attribute === 'Last Name' || attribute === 'Title') {
            $scope.showLabel = false
            //re-sorts to remove groupings
            sortOn(period, attribute)
        } else {
            $scope.showLabel = true
        }
    }


    // This JS will execute on page load
    firebase.database().ref('/Schedules').on('value', function(schedule){
        $scope.scheduleHasLoaded = true;
        // If morning schedule has been posted to Firebase, populate the schedule
        if (schedule.val() && schedule.val().Morning){
            $scope.morningRooms = [];
            // $scope.sortScheduleByTime(schedule.val(), "Morning");
            $scope.morningRooms = schedule.val().Morning;
            $scope.groupBy($scope.morningRooms, 'Time')
        }

        // If afternoon schedule has been posted to Firebase, populate the schedule
        if (schedule.val() && schedule.val().Afternoon){
            $scope.afternoonRooms = [];
            // $scope.sortScheduleByTime(schedule.val(), "Afternoon");
            $scope.afternoonRooms = schedule.val().Afternoon
            $scope.groupBy($scope.afternoonRooms, 'Time')
        }

        if (!schedule.val()) {
            $scope.morningRooms = [];
            $scope.afternoonRooms = [];
        }

        //checks if $digest is in progress, if first time user visit or on refresh $scope.$apply, else simply let digest run
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    });

});
