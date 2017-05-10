angular.module('BarcampApp')
    .controller('AdminCtrl', function ($scope, $rootScope, $interval, $firebase, Sessions) {
        $rootScope.pollingSync.$bindTo($scope, 'polling');
        $scope.sessions = Sessions;
        $scope.currenttime = new Date().toLocaleTimeString();
        $interval(function () {
            $scope.currenttime = new Date().toLocaleTimeString();
        }, 1000);

        $scope.remove = function (s) {
            s.inSync.removed = !s.inSync.removed;
            s.inSync.$save();
        }
    })
;