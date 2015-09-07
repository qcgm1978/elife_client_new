elife.controller('EverydayDrawCtrl', ['$scope', '$rootScope', 'API', function ($scope, $rootScope, API) {
    elife_app.SetReturnBtn();
    $scope.loading = true;
    $scope.mark = false;
    $scope.isEmpty = false;
    $scope.loadingMore = true;
    $scope.details = [];
    $scope.e_row = 0;
    $scope.page_size = 10;
    $scope.getList = API.getAwardList($scope);
    $scope.getList();
    $scope.showLoading = function () {
        $scope.mark = true;
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    };
}]);
