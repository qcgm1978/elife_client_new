elife.controller('PersonalCreditCtrl', ['$scope', '$rootScope', '$routeParams', '$http', '$cookieStore', 'API', 'SharedState', '$filter', function ($scope, $rootScope, $routeParams, $http, $cookieStore, API, SharedState, $filter) {
    $scope.isEmpty = false;
    var nowDate = new Date();
    //$scope.cycle_date=$filter('date')(new Date().getTime(), 'yyyy-MM-dd');
    $scope.displayQueryBox = function () {

        SharedState.turnOn('comment_del_modal');
    };
    $scope.checkDate = function (date, attr) {
        if (attr === "s_date") {
            $scope.s_date = date;
        } else if (attr === "e_date") {
            $scope.e_date = date;
        } else if (attr === "cycle_date") {
            $scope.cycle_date = date;
        }
    };
    $scope.queryCreditByConditions= function () {
        console.log('%s, %s',$scope.s_date,$scope.e_date)
        requestCredits('../test/list-credit-search.json');
    };

    //todo test code
    var handleData = function (data) {
        if (data.res == 0) {
            $scope.creditData = data.data;
        } else {
            $scope.loading = false;
            $scope.isEmpty = true;
            $scope.toast('程序错误');
        }
    };
    var requestCredits = function (testUrl) {
        testUrl = testUrl || '../test/list-credit.json';
        if (localStorage.zhl) {
            $http.get(testUrl).success(function (data) {
                handleData(data);
            });
        } else {
            API.getBusinessInfo({
                'store_code': $scope.id
            }).then(handleData,
                function () {
                    $scope.toast("程序错误");
                    $scope.loading = false;
                    $scope.isEmpty = true;
                });
        }
    };
    requestCredits();
    //todo to del useless code
    //$scope.active = $cookieStore.get('orderActive') || 1;
    //$scope.saveActive = function () {
    //    $cookieStore.put('orderActive', $scope.active);
    //};
    //// 返回按钮
    //elife_app.SetReturnBtn();
    //$scope.deleteList = API.getDelFunc($scope);
    //API.setSelectBtn($scope, $scope.deleteList);
    //$scope.deleteList = API.cancelDel($scope);
    //API.promptDel($scope, SharedState);
    //API.setMaskClick($scope);
    //$scope.loadingMore = true;
    //$scope.list_paid = [];
    //$scope.list_unpaid = [];
    //$scope.e_row_paid = 0;
    //$scope.e_row_unpaid = 0;
    //$scope.page_size = 9;
    //$scope.showLoading = function () {
    //    $scope.mark = true;
    //    $scope.loadingMore = true;
    //};
    //$scope.getPaidOrders = function () {
    //    $scope.loading = true;
    //    $scope.isEmpty = false;
    //    var para = {};
    //    if ($scope.mark === false) {
    //        $scope.list_paid = [];
    //        $scope.e_row_unpaid = 0;
    //    }
    //    para.s_row = $scope.e_row_paid + 1;
    //    para.e_row = para.s_row + $scope.page_size;
    //    $scope.e_row_paid = para.e_row;
    //    para.tran_way = "APP";
    //    para.type = "PAID";
    //    API.getOrders(para).then(function (data) {
    //        console.log('我的已付款订单获取成功');
    //        console.log(data);
    //        var length1 = $scope.list_paid.length;
    //        $scope.list_paid = $scope.list_paid.concat(data ? data : []);
    //        var length2 = $scope.list_paid.length;
    //        // console.log('###########################################');
    //        // console.log(length1);
    //        // console.log(length2);
    //        // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    //        if (length1 === length2) {
    //            $scope.loadingMore = false;
    //            $scope.toast("无更多数据", 1000);
    //        }
    //        if ((!$scope.list_paid || $scope.list_paid.length === 0)) {
    //            $scope.isEmpty = true;
    //        }
    //        console.log("我的已付款信息");
    //        console.log($scope.list_paid);
    //        $scope.e_row_paid = $scope.list_paid.length;
    //        $scope.loading = false;
    //        $scope.mark = false;
    //        $scope.paidOrders = $scope.list_paid;
    //    }, function (data) {
    //        $scope.loading = false;
    //        console.log('我的已付款订单获取失败: ' + data);
    //    });
    //};
    //$scope.getPaidOrders();
    //$scope.getUnpaidOrders = function () {
    //    //todo test code
    //    //$http.get('../test/orders.json').success(function (data) {
    //    //    $scope.paidOrders = data.data;
    //    //
    //    //});
    //    $scope.loading = true;
    //    $scope.isEmpty = false;
    //    var para = {};
    //    if ($scope.mark === false) {
    //        $scope.list_unpaid = [];
    //        $scope.e_row_unpaid = 0;
    //    }
    //    para.s_row = $scope.e_row_unpaid + 1;
    //    para.e_row = para.s_row + $scope.page_size;
    //    $scope.e_row_unpaid = para.e_row;
    //    para.tran_way = "APP";
    //    para.type = "UNPAID";
    //    API.getOrders(para).then(function (data) {
    //        console.log('我的wei付款订单获取成功');
    //        console.log(data);
    //        var length1 = $scope.list_unpaid.length;
    //        $scope.list_unpaid = $scope.list_unpaid.concat(data ? data : []);
    //        var length2 = $scope.list_unpaid.length;
    //        // console.log('###########################################');
    //        // console.log(length1);
    //        // console.log(length2);
    //        // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    //        if (length1 === length2) {
    //            $scope.loadingMore = false;
    //            $scope.toast("无更多数据", 1000);
    //        }
    //        if ((!$scope.list_unpaid || $scope.list_unpaid.length === 0)) {
    //            $scope.isEmpty = true;
    //        }
    //        console.log("我的未付款信息");
    //        console.log($scope.list_unpaid);
    //        $scope.e_row_unpaid = $scope.list_unpaid.length;
    //        $scope.loading = false;
    //        $scope.mark = false;
    //        $scope.unpaidOrders = $scope.list_unpaid;
    //    }, function (data) {
    //        $scope.loading = false;
    //        console.log('我的未付款订单获取失败: ' + data);
    //    });
    //};
    //$scope.getUnpaidOrders();
    //$scope.delete = function () {
    //    var deleteId = [];
    //    for (var i = 0, n = $scope.deleteList.length; i < n; i++) {
    //        deleteId.push($scope.deleteList[i].order_id);
    //    }
    //    $scope.isEditing = false;
    //    var handleDelRequest = function (data) {
    //        if (data.res == "1") {
    //            $rootScope.toast(data.msg);
    //        }
    //        else if (data.res == '100002') {
    //            $rootScope.toast('未删除成功');
    //        } else {
    //            $rootScope.toast("删除成功");
    //            $scope.coIndexArry = [];
    //            $scope.deleteList = [];
    //            if ($scope.active == 1) {
    //                $scope.e_row_unpaid = 0;
    //                $scope.getUnpaidOrders();
    //                //$scope.unpaidOrders=$scope.unpaidOrders.slice(deleteId.length);
    //            } else {
    //                $scope.e_row_paid = 0;
    //                $scope.getPaidOrders();
    //                //$scope.paidOrders=$scope.paidOrders.slice(deleteId.length);
    //            }
    //        }
    //    };
    //    if (deleteId.length > 0) {
    //        //todo test code
    //        //handleDelRequest({res:'0'});
    //        $http.post($rootScope.baseUrl + '/OFSTCUST/myorder/delOrder.action', {
    //            'order_id': deleteId.join(",")
    //        }).success(function (data) {
    //            handleDelRequest(data);
    //        }).error(function (data) {
    //            $rootScope.toast('删除订单失败');
    //        });
    //    }
    //};
}]);
