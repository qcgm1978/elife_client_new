elife.controller('DiscountCategoryCtrl', [
    'API',
    '$scope',
    '$routeParams',
    function (API, $scope, $routeParams) {
        $scope.largeName = $routeParams.largeName;
    }
]);