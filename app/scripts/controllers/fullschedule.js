'use strict'

app.controller('FullScheduleCtrl', function ($scope) {

  $scope.scheduleByTime = [];
  $scope.rooms = [];
  $scope.morningRooms = [];
  $scope.afternoonRooms = [];
  $scope.showLabel = true;
  $scope.showName = false;
  $scope.showTitle = true;
 
    //sorts morning/afternoon sessions for use in groupBy function
    const sortOn = (attribute) => {
        $scope.morningRooms.sort(function(a, b) {
            if (a[attribute] < b[attribute]) {
                return -1
            } else {
                return 1
            }
        })
        $scope.afternoonRooms.sort(function(a, b) {
            if (a[attribute] < b[attribute]) {
                return -1
            } else {
                return 1
            }
        })
    }

    //shows/hides group labels based on attribute
    //re-sorts if no grouping required
    const toggleLabels = (attribute) => {
        if (attribute === 'Last Name') {
            $scope.showLabel = false
            $scope.showName = true
            $scope.showTitle = false
            sortOn(attribute)
        } else if (attribute === 'Title') {
            $scope.showLabel = false
            $scope.showName = false
            $scope.showTitle = true
            sortOn(attribute)
        } else {
            $scope.showLabel = true
            $scope.showName = false
            $scope.showTitle = true
        }
    }


    $scope.groupBy = (attribute) => {
        //initial sort of morning/afternoon sessions
        sortOn(attribute)
        $scope.morningGroups = [];
        $scope.afternoonGroups = [];
        let period1 = $scope.morningRooms;
        let period2 = $scope.afternoonRooms;
        let groupValue = '';
        let session;
        let group = {};

        //$scope.morningGroups creation
        for(let i = 0; i < period1.length; i++) {
            session = period1[i];
            //creates a new group object for each new groupValue
            if (session[attribute] != groupValue) {
                group = {
                    label: session[attribute],
                    sessions: []
                }

                groupValue = group.label;
                //new array with group objects for use in fullschedule.html
                $scope.morningGroups.push(group)      
            }
            //adds current session to sessions array of current group object
            group.sessions.push(session)
        }

        //$scope.afternoonGroups creation
        for(let i = 0; i < period2.length; i++) {
            session = period2[i];
            if (session[attribute] != groupValue) {
                group = {
                    label: session[attribute],
                    sessions: []
                }

                groupValue = group.label;
                $scope.afternoonGroups.push(group)      
            }
            group.sessions.push(session)
        }
        toggleLabels(attribute)
    }


    // This JS will execute on page load
    firebase.database().ref('/Schedules').on('value', function(schedule){
        $scope.scheduleHasLoaded = true;
        // If morning schedule has been posted to Firebase, populate the schedule
        if (schedule.val() && schedule.val().Morning){
            $scope.morningRooms = [];
            // $scope.sortScheduleByTime(schedule.val(), "Morning");
            $scope.morningRooms = schedule.val().Morning;
            //initial sorting/grouping based on Time attribute
            $scope.groupBy('Time')
        }

        // If afternoon schedule has been posted to Firebase, populate the schedule
        if (schedule.val() && schedule.val().Afternoon){
            $scope.afternoonRooms = [];
            // $scope.sortScheduleByTime(schedule.val(), "Afternoon");
            $scope.afternoonRooms = schedule.val().Afternoon
            $scope.groupBy('Time')
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

