angular.module('BarcampApp')
    .controller('SigninCtrl', function ($scope, AuthService, $location) {
        $scope.$watch('badgeId', function () {
            $scope.error = null;
        });

        $scope.login = function (id) {
            $scope.thinking = true;
            $scope.error = null;
            AuthService.login(id.toUpperCase()).then(function () {},
            function (response) {
                $scope.thinking = false;
                $scope.error = response.status == 401 ? "I have no memory of this ID" : "I'm afraid I can't do that, Chuck.";
            });
        };
    })
;
