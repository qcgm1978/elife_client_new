elife.controller('NavigationRouteCtrl', [
    '$scope',
    '$rootScope',
    '$routeParams',
    '$cookieStore',
    'API',
    'mapService',
    function ($scope, $rootScope, $routeParams, $cookieStore, API, mapService) {
        //if(typeof BMap==='undefined'){
        //    $scope.toast('无法加载地图');
        //    return;
        //}
        $scope.navigationType = "walking";
        var origin = $routeParams.origin;
        $scope.origin = origin;
        var getOrigin = function () {
            $scope.toast("无法定位，请允许GPS定位");
        };
        
       
        var destination = $routeParams.destination;
        var destStoreName = $routeParams.destStoreName;
        var destLongitude = $routeParams.destLongitude;
        var destLatitude = $routeParams.destLatitude;
        //test code
        //destLatitude=$rootScope.lat;
        //destLongitude=$rootScope.lng;
        $scope.initializeMap = function () {
            if (!map) {
                map = new BMap.Map("navigationRoute");
            }
        };
        try {
            var destinationPoint = new BMap.Point(destLongitude, destLatitude);
        } catch (e) {
        }

        var map = null;
        var storeInfoOverlay = new mapService.overlay(new BMap.Point(destLongitude, destLatitude), destStoreName, destination);
        $scope.getWalkingRoute = function () {
            $scope.initializeMap();
            map.clearOverlays();
            //var walking = new BMap.WalkingRoute(map, {renderOptions: {map: map, autoViewport: true}});
            //walking.search($scope.originPoint, destinationPoint);
            map.addOverlay(storeInfoOverlay);
        };
        $scope.getDrivingRoute = function () {
            $scope.initializeMap();
            map.clearOverlays();
            var driving = new BMap.DrivingRoute(map, {
                renderOptions: {map: map, autoViewport: true}, policy: BMAP_DRIVING_POLICY_LEAST_TIME
            });
            driving.search($scope.originPoint, destinationPoint);
            map.addOverlay(storeInfoOverlay);
        };
        $scope.getBusRoute = function () {
            $scope.initializeMap();
            map.clearOverlays();
            var transit = new BMap.TransitRoute(map, {
                renderOptions: {map: map},
                policy: 0
            });
            transit.setPolicy(BMAP_TRANSIT_POLICY_LEAST_TIME);
            transit.search($scope.originPoint, destinationPoint);
            map.addOverlay(storeInfoOverlay);
        };
        $scope.changeNavigationType = function (type) {
            if (type === $scope.navigationType) {
                return;
            }
            $scope.navigationType = type;
            if (type === "walking") {
                $scope.getWalkingRoute();
            } else if (type === "driving") {
                $scope.getDrivingRoute();
            } else if (type === "bus") {
                $scope.getBusRoute();
            }
        };
        obs._on('positionCallback', function () {
            if (callbackPosition) {
                $scope.origin = callbackPosition;
                $scope.initializeMap();
                map.centerAndZoom(new BMap.Point(Number(destLongitude), Number(destLatitude)), 13);
                $scope.originPoint = new BMap.Point(callbackPosition.longitude, callbackPosition.latitude);
                map.addOverlay($scope.originPoint);
                $scope.getWalkingRoute();
            }
        });
        API.doGPSLocation(getOrigin);
    }
]);

