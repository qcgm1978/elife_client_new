elife.controller('NavigationLocationCtrl',  [
    '$scope',
    '$location',
    '$rootScope',
    '$routeParams',
    '$cookieStore',
    function ($scope, $location, $rootScope, $routeParams, $cookieStore) {
        $scope.destination = $routeParams.destination;

        $scope.confirm = function() {
            $location.path('navigation/route/' + $scope.origin + "/" + $routeParams.destination + "/" + $routeParams.destStoreName + "/" + $routeParams.destLongitude + "/" + $routeParams.destLatitude);
        };
    }
]);

