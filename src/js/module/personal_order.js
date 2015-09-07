elife.controller('AppOrderCtrl', ['$scope', '$rootScope', '$routeParams', '$http', '$cookieStore', 'API', 'SharedState', function ($scope, $rootScope, $routeParams, $http, $cookieStore, API, SharedState) {
    


    $scope.active = $cookieStore.get('orderActive') || 1;
    $scope.saveActive = function () {
        $cookieStore.put('orderActive', $scope.active);
    };
    // 返回按钮
    elife_app.SetReturnBtn();
    $scope.deleteList = API.getDelFunc($scope);
    API.setSelectBtn($scope, $scope.deleteList);
    $scope.deleteList = API.cancelDel($scope);
    API.promptDel($scope, SharedState);
    API.setMaskClick($scope);
    $scope.loadingMore = true;
    $scope.list_paid = [];
    $scope.list_unpaid = [];
    $scope.e_row_paid = 0;
    $scope.e_row_unpaid = 0;
    $scope.page_size = 9;
    $scope.showLoading = function () {
        $scope.mark = true;
        $scope.loadingMore = true;
    };
    $scope.getPaidOrders = function () {
        $scope.loading = true;
        $scope.isEmpty1 = false;
        var para = {};
        if ($scope.mark === false) {
            $scope.list_paid = [];
            $scope.e_row_unpaid = 0;
        }
        para.s_row = $scope.e_row_paid + 1;
        para.e_row = para.s_row + $scope.page_size;
        $scope.e_row_paid = para.e_row;
        para.tran_way = "APP";
        para.type = "PAID";
        API.getOrders(para).then(function (data) {
            console.log('我的已付款订单获取成功');
            console.log(data);
            var length1 = $scope.list_paid.length;
            $scope.list_paid = $scope.list_paid.concat(data ? data : []);
            var length2 = $scope.list_paid.length;
            // console.log('###########################################');
            // console.log(length1);
            // console.log(length2);
            // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
            if (length1 === length2) {
                $scope.loadingMore = false;
                $scope.toast("无更多数据", 1000);
            }
            if ((!$scope.list_paid || $scope.list_paid.length === 0)) {
                $scope.isEmpty1 = true;
            }
            console.log("我的已付款信息");
            console.log($scope.list_paid);
            $scope.e_row_paid = $scope.list_paid.length;
            $scope.loading = false;
            $scope.mark = false;
            $scope.paidOrders = $scope.list_paid;
        }, function (data) {
            $scope.loading = false;

            console.log('我的已付款订单获取失败: ' + data);
        });
    };
    $scope.getPaidOrders();
    $scope.getUnpaidOrders = function () {
        //todo test code
        //$http.get('../test/orders.json').success(function (data) {
        //    $scope.paidOrders = data.data;
        //
        //});
        $scope.loading = true;
        $scope.isEmpty2 = false;
        var para = {};
        if ($scope.mark === false) {
            $scope.list_unpaid = [];
            $scope.e_row_unpaid = 0;
        }
        para.s_row = $scope.e_row_unpaid + 1;
        para.e_row = para.s_row + $scope.page_size;
        $scope.e_row_unpaid = para.e_row;
        para.tran_way = "APP";
        para.type = "UNPAID";
        API.getOrders(para).then(function (data) {
            console.log('我的wei付款订单获取成功');
            console.log(data);
            var length1 = $scope.list_unpaid.length;
            $scope.list_unpaid = $scope.list_unpaid.concat(data ? data : []);
            var length2 = $scope.list_unpaid.length;
            // console.log('###########################################');
            // console.log(length1);
            // console.log(length2);
            // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
            if (length1 === length2) {
                $scope.loadingMore = false;
                $scope.toast("无更多数据", 1000);
            }
            if ((!$scope.list_unpaid || $scope.list_unpaid.length === 0)) {
                $scope.isEmpty2 = true;
            }
            console.log("我的未付款信息");
            console.log($scope.list_unpaid);
            $scope.e_row_unpaid = $scope.list_unpaid.length;
            $scope.loading = false;
            $scope.mark = false;
            $scope.unpaidOrders = $scope.list_unpaid;
        }, function (data) {
            $scope.loading = false;

            console.log('我的未付款订单获取失败: ' + data);
        });
    };
    $scope.getUnpaidOrders();
    $scope.delete = function () {
        var deleteId = [];
        for (var i = 0, n = $scope.deleteList.length; i < n; i++) {
            deleteId.push($scope.deleteList[i].order_id);
        }
        $scope.isEditing = false;
        var handleDelRequest = function (data) {
            if (data.res == "1") {
                $rootScope.toast(data.msg);
            }
            else if (data.res == '100002') {
                $rootScope.toast('未删除成功');
            } else {
                $rootScope.toast("删除成功");
                $scope.coIndexArry = [];
                $scope.deleteList = [];
                if ($scope.active == 1) {
                    $scope.e_row_unpaid = 0;
                    $scope.getUnpaidOrders();
                    //$scope.unpaidOrders=$scope.unpaidOrders.slice(deleteId.length);
                } else {
                    $scope.e_row_paid = 0;
                    $scope.getPaidOrders();
                    //$scope.paidOrders=$scope.paidOrders.slice(deleteId.length);
                }
            }
        };
        if (deleteId.length > 0) {
            //todo test code
            //handleDelRequest({res:'0'});
            $http.post($rootScope.baseUrl + '/OFSTCUST/myorder/delOrder.action', {
                'order_id': deleteId.join(",")
            }).success(function (data) {
                handleDelRequest(data);
            }).error(function (data) {
                $rootScope.toast('删除订单失败');
            });
        }
    };
}]);
elife.controller('ewmOrderCtrl', ['$scope', '$rootScope', '$routeParams', '$http', '$cookieStore', 'API', 'SharedState', function ($scope, $rootScope, $routeParams, $http, $cookieStore, API, SharedState) {
    $scope.active = 1;
    // 返回按钮
    elife_app.SetReturnBtn();
    $scope.deleteList = API.getDelFunc($scope);
    API.setSelectBtn($scope, $scope.deleteList);
    $scope.deleteList = API.cancelDel($scope);
    API.promptDel($scope, SharedState);
    API.setMaskClick($scope);
    var getPaidOrders = function () {
        //todo test code
        //$http.get('../test/orders.json').success(function (data) {
        //    $scope.paidOrders = data.data;
        //
        //});
        API.getOrders({
            'tran_way': 'QRCODE',
            'type': 'PAID'
        }).then(function (data) {
            console.log('app orders paid');
            console.log(data);
            $scope.loading = false;

            $scope.paidOrders = data;
        }, function (data) {
            console.log('我的订单获取失败: ' + data);
        });
    };
    getPaidOrders();
    var getUnpaidOrders = function () {
        API.getOrders({
            'tran_way': 'QRCODE',
            'type': 'UNPAID'
        }).then(function (data) {
            console.log('我的订单获取成功');
            console.log(data);
            $scope.loading = false;

            $scope.unpaidOrders = data;
        }, function (data) {
            console.log('我的订单获取失败: ' + data);
        });
    };
    getUnpaidOrders();
    $scope.delete = function () {
        var deleteId = [];
        for (var i = 0, n = $scope.deleteList.length; i < n; i++) {
            deleteId.push($scope.deleteList[i].order_id);
        }
        $scope.isEditing = false;
        var handleDelRequest = function (data) {
            console.log("del ewm");
            if (data.res == "1") {
                $rootScope.toast(data.msg);
            }
            else if (data.res == '100002') {
                $rootScope.toast('未删除成功');
            } else {
                $rootScope.toast("删除成功");
                $scope.coIndexArry = [];
                $scope.deleteList = [];
                if ($scope.active == 1) {
                    $scope.e_row_unpaid = 0;
                    getUnpaidOrders();
                    //$scope.unpaidOrders=$scope.unpaidOrders.slice(deleteId.length);
                } else {
                    $scope.e_row_paid = 0;
                    getPaidOrders();
                    //$scope.paidOrders=$scope.paidOrders.slice(deleteId.length);
                }
            }
        };
        if (deleteId.length > 0) {
            //todo test code
            //handleDelRequest({res:'0'});
            $http.post($rootScope.baseUrl + '/OFSTCUST/myorder/delOrder.action', {
                'order_id': deleteId.join(",")
            }).success(function (data) {
                handleDelRequest(data);
            }).error(function (data) {
                $rootScope.toast('删除订单失败');
            });
        }
    };
}]);
elife.controller('GppOrderCtrl', ['$scope', '$rootScope', '$routeParams', '$http', '$cookieStore', 'API', 'SharedState', function ($scope, $rootScope, $routeParams, $http, $cookieStore, API, SharedState) {
    // 返回按钮
    elife_app.SetReturnBtn();
    //状态数据-后台只能传过来 1、2、4、6、10
    //$scope.status = ['未分配','已购买','已使用','已作废','已退货','已过期','过期已退款','退货锁定','使用锁定','过期退款锁定','购买锁定'];
    $scope.status = ['', '待消费', '已消费', '', '已退款', '', '过期已退款', '', '', '', '待付款'];
    //获取列表数据
    API.getGroupList({}).then(function (data) {
        console.log(data);
        $scope.paidOrders = data.payList;
        for (var i = 0; i < data.payList.length; i++) {
            if (data.payList[i].gpp_status === "1")
                data.payList[i].isRed = true;
            else
                data.payList[i].isRed = false;
            data.payList[i].s_date = data.payList[i].begin_time.split(" ")[0];
            data.payList[i].e_date = data.payList[i].end_time.split(" ")[0];
        }
        $scope.unpaidOrders = data.unPayList;
        for (var j = 0; j < data.unPayList.length; j++) {
            if (data.unPayList[i].gpp_status === "10")
                data.unPayList[j].isRed = true;
            else
                data.unPayList[j].isRed = false;
            data.unPayList[j].s_date = data.unPayList[j].begin_time.split(" ")[0];
            data.unPayList[j].e_date = data.unPayList[j].end_time.split(" ")[0];
        }
    }, function (data) {
        $scope.toast("请检查网络状况");
        console.error("我的团购列表获取失败：" + data);
    });
    // 初始化编辑操作，默认为false
    $scope.isEditing = false;
    $scope.edit = function () {
        if ($scope.isEditing) {
            $scope.isEditing = false;
            //执行删除操作
        } else {
            $scope.isEditing = true;
            deleteList = [];
        }
    };
    $scope.delOrder = function (orderId) {
        API.delOrder({
            order_id: orderId
        }).then(function (data) {
            console.log(data);
            if (data.res === '0') {
                console.log('删除订单成功！');
            } else {
                console.log('删除失败！');
            }
        }, function (data) {
            console.error('删除订单失败！错误码：');
            console.log(data);
        });
    };
    // API.getOrders({
    //   'tran_way' : 'GROUP',
    //   'type' : 'PAID'
    // }).then(function(data){
    //   console.log('我的订单获取成功');
    //   console.log(data);
    //   $scope.paidOrders = data;
    // },function(data){
    //   console.log('我的订单获取失败: ' + data);
    // });
    // API.getOrders({
    //   'tran_way' : 'GROUP',
    //   'type' : 'UNPAID'
    // }).then(function(data){
    //   console.log('我的订单获取成功');
    //   console.log(data);
    //   $scope.unpaidOrders = data;
    // },function(data){
    //   console.log('我的订单获取失败: ' + data);
    // });
}]);
//useless
elife.controller('PersonalOrdersCtrl', ['$scope', '$location', '$rootScope', '$routeParams', '$http', '$cookieStore', 'API', 'SharedState', function ($scope, $location, $rootScope, $routeParams, $http, $cookieStore, API, SharedState) {
    // 返回按钮
    if(ICBCUtil.isElifeIos()){
        ICBCUtil.nativeGetConfig({
            'key': 'tabbarhidden',
            'callBack': ''
        });
      }

      $scope.back = function () {
        if ($cookieStore.get('noPrevPage')) {
            $cookieStore.remove('noPrevPage');
            if (ICBCUtil.isIPhone()) {
                ICBCUtil.nativeGetConfig({
                    'key': 'closeWebview',
                    'callBack': ''
                });
            } else if (ICBCUtil.isAndroid()) {
                elife_app.GetNativeFunctionAndroid({'keyword': 'closeWebview'});
            }
        } else if (ICBCUtil.isElifeAndroid()) {
            elife_app.GetNativeFunctionAndroid({'keyword': 'return_btn'});
        } else if (ICBCUtil.isElifeIos()) {
            ICBCUtil.nativeGetConfig({
                'key': 'return_btn',
                'callBack': ''
            });
        } else {
            history.back();
        }
    };
    elife_app.SetReturnBtn();
    // 五月版取消团购订单
    $scope.hidden = false;
    var payType = $cookieStore.get('payType');
    $cookieStore.remove('payType');

    switch (payType) {
        case '1' : // 普通买单
        $location.path('/personal/app_orders');
        break;

        case '2' : // 团购订单
        $location.path('personal/my_customers');
        break;

        case '3' : // 二维码订单
        $location.path('/personal/ewm_orders');
        break;
    }
}]);