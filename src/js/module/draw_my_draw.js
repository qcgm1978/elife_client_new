elife.controller('MyDrawCtrl', ['$scope', '$rootScope', 'API', function ($scope, $rootScope, API) {
    elife_app.SetReturnBtn();
    $scope.loading = true;
    $scope.mark = false;
    $scope.isEmpty = false;
    $scope.loadingMore = true;
    $scope.details = [];
    $scope.e_row = 0;
    $scope.page_size = 9;
    $scope.getList = API.getAwardList($scope);
    $scope.loading = true;
    $scope.isEmpty = false;
    var para = {};
    if ($scope.mark === false) {
        $scope.list = [];
        $scope.e_row = 0;
    }
    para.s_row = $scope.e_row + 1;
    para.e_row = para.s_row + $scope.page_size;
    $scope.e_row = para.e_row;
    API.getLuckListByCust(para).then(function (data) {
        console.log('天天抽奖');
        console.log(data);
        var length1 = $scope.details.length;
        for (var index = 0; index < data.length; index++) {
            if (data[index].status === '') {
                continue;
            }
            var detail = {
                telePhone_url: data[index].imgUrl,
                phoneTitle: data[index].prizeName,
                number: "已参与" + (data[index].can_count || '0') + "人",
                periods: data[index].activityName,
                surplus: '剩余时间',
                labelstate: data[index].if_win == '1' ? '中奖了' : '未中奖',
                state: data[index].status,
                drawCode: data[index].code,
                drawType: data[index].cycle_type, //1天天抽 2周周抽 3月月抽
                isWin: data[index].if_win
            };
            //if (detail.isWin == '1') {
            //    detail.state = '0';
            //    detail.labelState = "中奖了";
            //}
            $scope.details.push(detail);
        }
        var length2 = $scope.details.length;
        if (length1 === length2) {
            $scope.loadingMore = false;
        }
        if ((!$scope.details || $scope.details.length === 0)) {
            // console.log('----------------------------');
            // console.log($scope.details);
            $scope.isEmpty = true;
            $scope.loading = false;
            $scope.mark = false;
        }
        $scope.loading = false;
        $scope.mark = false;
    }, function (data) {
        console.error("获取天天抽奖列表失败：" + data);
        $scope.isEmpty = true;
        $scope.details = [];
        $scope.loading = false;
        $scope.mark = false;
    });
    //$scope.getList();
    $scope.showLoading = function () {
        $scope.mark = true;
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    };
}]);