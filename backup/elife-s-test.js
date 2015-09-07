elife.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/personal/trade', {   //获得该用户该日期下的交易列表
        templateUrl: 'views/personal/trade_list.html',
        controller: 'TradeListCtrl',
        resolve: {
            delay: function ($q) {
                var delay = $q.defer();
                dataIn("send", "pageview");
                return null;
            }
        }
    })
        .when('/personal/trade_detail/:transerialnum/:orderId/:shopId/:merAcct', {  //通过orderId和shopId(特约商户编号)获得该笔交易详情,通过merAcct(门店编号）获取门店信息
            templateUrl: 'views/personal/trade_detail.html',
            controller: 'TradeDetailCtrl',
            resolve: {
                delay: function ($q) {
                    var delay = $q.defer();
                    dataIn("send", "pageview");
                    return null;
                }
            }
        })
        .when('/personal/trade_returns/:buttonflag/:transerialnum/:orderId/:shopId/:maxRejectSum/:merAcct', {   //通过buttonflag控制退货页面逻辑
            templateUrl: 'views/personal/trade_returns.html',
            controller: 'TradeReturnCtrl',
            resolve: {
                delay: function ($q) {
                    var delay = $q.defer();
                    dataIn("send", "pageview");
                    return null;
                }
            }
        })
        .when('/personal/trade_returns_success/:transerialnum', {
            templateUrl: 'views/personal/trade_returns_success.html',
            controller: 'TradeReturnSuccessCtrl',//退货成功页
            resolve: {
                delay: function ($q) {
                    var delay = $q.defer();
                    dataIn("send", "pageview");
                    return null;
                }
            }
        })
        .when('/protocol/protocol_h5', {
            templateUrl: 'views/protocol/protocol_h5.html',
            controller: 'ProtocolH5Ctrl'
        })
}])
elife.controller('TradeListCtrl', ['$scope', '$http', '$cookieStore', '$rootScope', 'SharedState', function ($scope, $http, $cookieStore, $rootScope, SharedState) {
    $scope.toast = $rootScope.toast;
    // 返回按钮
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
    $scope.listFilter = false;
    var curMonth = (new Date().getMonth() + 1);
    var month = curMonth < 10 ? ('0' + curMonth) : curMonth;
    $rootScope.date = $rootScope.date || "2015-" + month;  //初始化
    $scope.months = [
        {"num": 1}, {"num": 2}, {"num": 3}, {"num": 4},
        {"num": 5}, {"num": 6}, {"num": 7}, {"num": 8},
        {"num": 9}, {"num": 10}, {"num": 11}, {"num": 12}
    ];
    //页面载入时执行,通过token编号和渠道号查询custid，再根据custid和日期querydate查找该用户当月的交易列表
    $cookieStore.put('t_k', 'e6ab84b6f1994addbb9c46c4a4e31b5f');	//暂时设置一个tokenid:6806a954f47341de9da572c30198a5b7
    var tokenid = $cookieStore.get('t_k');
    var channelid = ICBCUtil.getIMChannel();
    //var listUrl = "http://localhost/OFSTCUST/listTrade/receive.action";
    var listUrl = $rootScope.baseUrl + "/OFSTCUST/listTrade/receive.action";
    $http.post(listUrl, {"tokenid": tokenid, "channelid": channelid, "querydate": $scope.date})
        .success(function (response) {
            if (response !== null && response !== undefined && response !== '' && response.length !== 0) {
                var length = response.length;
                for (var i = 0; i < length; i++) {
                    var date = new Date(response[i].orderDate);
                    response[i].orderDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                }
                $scope.items = response;
            }
            else {
                $scope.items = [];
                $rootScope.toast("未查到您在当月的交易明细");
            }
        })
        .error(function (response) {
            $scope.toast('请检查网络');
        });
    $scope.listReq = function (year, month) {
        SharedState.turnOff('listFilter');
        if (month < 10) {
            $scope.date = year + "-0" + month;
        }
        else {
            $scope.date = year + "-" + month;
        }
        //通过统一通行证编号custid和查询日期querydate请求当月交易列表
        //var listUrl = "http://localhost/OFSTCUST/listTrade/receive.action";
        var listUrl = $rootScope.baseUrl + "/OFSTCUST/listTrade/receive.action";
        $http.post(listUrl, {"tokenid": tokenid, "channelid": channelid, "querydate": $scope.date})
            .success(function (response) {
                if (response !== null && response !== undefined && response !== '' && response.length !== 0) {
                    var length = response.length;
                    for (var i = 0; i < length; i++) {
                        var date = new Date(response[i].orderDate);
                        response[i].orderDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                    }
                    $scope.items = response;
                }
                else {
                    $scope.items = [];
                    $rootScope.toast("未查到您在当月的交易明细");
                }
            })
            .error(function (response) {
                $rootScope.toast('请检查网络');
            });
    };
}]);
elife.controller('TradeDetailCtrl', ['$scope', '$http', '$routeParams', '$cookieStore', '$rootScope', 'API', function ($scope, $http, $routeParams, $cookieStore, $rootScope, API) {
    var transerialnum = $routeParams.transerialnum;	//唯一事件编号
    var orderId = $routeParams.orderId;	//订单编号
    var shopId = $routeParams.shopId;	//特约商户编号
    var merAcct = $routeParams.merAcct;	//门店编号
    var RejectSum = 0;	//默认最大退货金额
    //通过orderId(订单编号)和shopId(特约商户编号)调主机接口查交易详情
    var buttonflag = "0"; //标志变量，为0表示默认可退货
    //var detailUrl = "http://localhost/OFSTCUST/detailTrade/receive.action";
    var detailUrl = $rootScope.baseUrl + "/OFSTCUST/detailTrade/receive.action";
    $http.post(detailUrl, {"shopId": shopId, "orderId": orderId, "displayFlag": "true", "merAcct": merAcct})
        .success(function (response) {
            if (response !== null && response !== undefined && response !== '') {
                $scope.detail = response;
                buttonflag = response.BUTTONFLAG;
                if (buttonflag != "0" && buttonflag != "1") {
                    $scope.btnDisabled = true;
                }
                maxRejectSum = parseInt(response.ORDERSUM) + parseInt(response.POINT2VALUE) + parseInt(response.ECOUPON_SUM)
                    - parseInt(response.RJSUM) - parseInt(response.RJPOINT2AMT) - parseInt(response.ECOUPON_REJECT_SUM);
            }
            else {
                $rootScope.toast('未查到该笔交易的交易详情');
            }
        })
        .error(function (response) {
            $rootScope.toast('请检查网络');
        });
    //根据merAcct(门店编号)查询门店信息,langitude和latitude是通过电子地图获取的经纬度
    //$cookieStore.put('longitudeLocal', '116.472296');
    //$cookieStore.put('latitudeLocal', '39.994475');
    API.doGPSLocation();
    obs._on('positionCallback', function () {
        if (callbackPosition) {
            longitude = callbackPosition.longitude;
            latitude = callbackPosition.latitude;
        }
        var longitude = $cookieStore.get('longitudeLocal');
        var latitude = $cookieStore.get('latitudeLocal');
        //var storeUrl = "http://localhost/OFSTCUST/storeInfo/receive.action";
        var storeUrl = $rootScope.baseUrl + "/OFSTCUST/storeInfo/receive.action";
        $http.post(storeUrl, {"merAcct": merAcct, "longitude": callbackPosition.longitude, "latitude": callbackPosition.latitude})
            .success(function (response) {
                $scope.storeinfo = response;
                //控制逸、闪、分、积图标显示与否
                var flag = response.servicesupportflag;
                API.getOrderingIcons({discount_role: flag}, API, $scope, 0);
                $scope.new_discount_role = API.removeEmptyArrEleAndReverse($scope.new_discount_role);
                //控制星级的显示
                var level = parseFloat(response.starLevel); //字符串转浮点数
                var intLevel = parseInt(response.starLevel); //显示整颗星
                var decLevel = level - intLevel; //0.1~0.9显示半颗星
                $scope.starArray = new Array(intLevel);
                for (var i = 0; i < intLevel; i++) {
                    $scope.starArray[i] = i;
                }
                //平均消费保留两位小数
                response.avgPrice = parseFloat(response.avgPrice).toFixed(2);
            })
            .error(function (response) {
                $rootScope.toast('请检查网络');
            });
    });
    /*
     * 根据buttonflag的值判断点击“退货”按钮的事件
     * 0-非当日交易,待查退货登记表中是否已登记该订单号交易的记录及处理状态,可能处理路径:正常退货\退货待处理
     * 1-当日交易,非银联,待查退货登记表中是否已登记该订单号交易的记录及处理状态,可能处理路径:全部退货\退货待处理
     * 2-银联,当日交易,不能退货
     * 3-团购,不支持退货
     * 4-交易状态不正常,不能退货
     * 5-已全部退货,不能再次退货
     */
    $scope.returnOrder = function () {
        if (buttonflag == "0" || buttonflag == "1") {
            location.hash = "#/personal/trade_returns/" + buttonflag + "/" + transerialnum + "/" +
                orderId + "/" + shopId + "/" + maxRejectSum + "/" + merAcct;
        }
        else if (buttonflag == "2") {
            $rootScope.toast('该交易属银联当日交易，不能退货');
            $scope.returnpage = "javascript:void(0)";
            return false;
        }
        else if (buttonflag == "3") {
            $rootScope.toast('团购商品不能退货');
            $scope.returnPage == "javascript:void(0)";
            return false;
        }
        else if (buttonflag == "4") {
            $rootScope.toast('该笔交易状态不正常，不能退货');
            $scope.returnPage == "javascript:void(0)";
            return false;
        }
        else if (buttonflag == "5") {
            $rootScope.toast('该商品已全部退货，不能再次退货');
            $scope.returnPage == "javascript:void(0)";
            return false;
        }
        else if (buttonflag == "6") {
            $rootScope.toast('该交易未进行任何形式的支付，不能退货');
            $scope.returnPage == "javascript:void(0)";
            return false;
        }
    };
}]);
elife.controller('TradeReturnCtrl', ['$scope', '$http', '$routeParams', '$rootScope', '$cookieStore', function ($scope, $http, $routeParams, $rootScope, $cookieStore) {
    var buttonflag = $routeParams.buttonflag;	//退货标志位
    var transerialnum = $routeParams.transerialnum;	//唯一事件编号
    var orderId = $routeParams.orderId;	//订单编号
    var shopId = $routeParams.shopId;	//特约商户编号
    var maxRejectSum = $routeParams.maxRejectSum;	//最大退货金额
    var merAcct = $routeParams.merAcct;	//门店编号
    //通过tokenid和channelid获取客户姓名和电话
    var tokenid = $cookieStore.get('t_k');
    var channelid = ICBCUtil.getIMChannel();
    //var custUrl = "http://localhost/OFSTCUST/custInfo/receive.action";
    var custUrl = $rootScope.baseUrl + "/OFSTCUST/custInfo/receive.action";
    $http.post(custUrl,
        {
            "tokenid": tokenid,
            "channelid": channelid
        })
        .success(function (response) {
            $scope.person = response.nickName;
            $scope.tele = response.phone; //需要做输入格式规范检查
        })
        .error(function (response) {
            $rootScope.toast('请检查网络');
        });
    /*
     * 根据buttonflag的值判断点击“退货”按钮的事件
     * 0-非当日交易,待查退货登记表中是否已登记该订单号交易的记录及处理状态,可能处理路径:正常退货\退货待处理
     * 1-非银联当日交易,待查退货登记表中是否已登记该订单号交易的记录及处理状态,可能处理路径:全部退货\退货待处理
     */
    $scope.returnAmount = maxRejectSum / 100;	//默认本次退货金额为最大退货金额，可修改，但不可超出maxRejectSum
    console.log(maxRejectSum);
    $scope.sumflag = false;
    if (buttonflag == "1") {
        $scope.inputflag = true;
    }
    $scope.returnSubmit = function () {
        //检查必输项是否为空
        if (document.getElementById("rejectAmt").value == "") {
            $rootScope.toast('退货金额不能为空');
            return false;
        }
        if (document.getElementById("contactName").value == "") {
            $rootScope.toast('退货人姓名不能为空');
            return false;
        }
        if (document.getElementById("contactTele").value == "") {
            $rootScope.toast('退货人联系方式不能为空');
            return false;
        }
        if (document.getElementById("rejectAmt").value != "" &&
            document.getElementById("contactName").value != "" &&
            document.getElementById("contactTele").value != "") {
            //var rejectUrl = "http://localhost/OFSTCUST/rejectTrade/receive.action";
            var rejectUrl = $rootScope.baseUrl + "/OFSTCUST/rejectTrade/receive.action";
            $http.post(rejectUrl,
                {
                    "buttonflag": buttonflag,
                    "transerialnum": transerialnum,
                    "orderId": orderId,
                    "shopId": shopId,
                    "merAcct": merAcct,
                    "rejectSum": parseInt($scope.returnAmount * 100),
                    "cust_Name": $scope.person,
                    "cust_PhoneNum": $scope.tele,
                    "rejectReason": $scope.content
                })
                .success(function (response) {
                    if (response.insertResult == "1") {
                        $rootScope.toast('退货受理中，待商家处理');
                        location.hash = "#/personal/trade";
                    } else {
                        $rootScope.toast('退货失败，请联系商家');
                    }
                })
                .error(function (response) {
                    $rootScope.toast('请检查网络');
                });
        }
    };
    //输入框输入字数检查
    $scope.check = function () {
        var len = document.getElementById("trade_return_content").value.length;
        if (len > 999) {
            $scope.content = $scope.content.substring(0, 999);
        }
    };
    //检查输入退货金额是否超过最大退货金额
    $scope.$watch('returnAmount', function (newVal, oldVal) {
        if (parseInt(newVal * 100) > parseInt(maxRejectSum)) {
            $scope.sumflag = true;
        } else {
            $scope.sumflag = false;
        }
    });
}]);
elife.controller('TradeReturnSuccessCtrl', ['$scope', '$http', '$routeParams', '$rootScope', function ($scope, $http, $routeParams, $rootScope) {
    $scope.transerialnum = $routeParams.transerialnum;
}]);
elife.controller('ProtocolH5Ctrl', ['$scope', '$http', function ($scope, $http) {
    //nothing to do
}]);