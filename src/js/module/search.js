elife.controller('IndexSearchCtrl', ['$scope', '$rootScope', 'API', '$cookieStore','$http', function ($scope, $rootScope, API, $cookieStore,$http) {

    $scope.keyboard = function () {
        // ICBCUtil.nativeGetConfig({
        //     'key': 'getShare',
        //     'callBack': ""
        // });
        ICBCUtil.nativeGetConfig({
            'key': 'getSafeKeyboard',
            'callBack': ""
        });
    };
    // 返回按钮


    //search_type='bank(银行关键字搜索)/store(商户优惠关键字搜索)'
    $scope.showHistory = true;
    $scope.close_icon = true;
    $scope.searchValue = "";
    $scope.search_type = 'bank';
    /*
     function connectWebViewJavascriptBridge(callback) {
     if (window.WebViewJavascriptBridge) {
     $scope.test1 = '有相关对象';
     callback(WebViewJavascriptBridge);
     } else {
     $scope.test1 = '没有相关对象';
     document.addEventListener('WebViewJavascriptBridgeReady', function() {
     callback(WebViewJavascriptBridge);
     }, false);
     }
     }
     connectWebViewJavascriptBridge(function (interface_) {
     $scope.testCall = function () {
     if (interface_.callHandler) {
     interface_.callHandler('testObjcCallback', '111111', function(response) {
     if (response) {
     window.document.write('asdljfalksdjfa');
     }
     });
     }
     };
     });*/
//点击回车，提交搜索
    $scope.keypress = function ($e) {
        console.log("keycode");
        console.log($e.keyCode);
        var val = $scope.searchHeaderValue;
        if (typeof val === 'undefined' || val.trim() === '') {
            return;
        }
        if ($e.keyCode == 13) {
            if (val) {
                console.log("搜索内容");
                console.log(val);
                 API.addHomeSearchHistory($scope.searchHeaderValue);
                window.location.hash = "/home/search_result/0/" + encodeURI($scope.searchHeaderValue);
               
            }
        }
    };
//优惠搜索点击回车，提交搜索
    $scope.keypress1 = function ($e) {
        var val = $scope.searchHeaderValue;
        if (typeof val === 'undefined' || val.trim() === '') {
            return;
        }
        if ($e.keyCode == 13) {
            if (val) {
                window.location.hash = "/discount/search_result/0/" + encodeURI(val) + '/' + $scope.search_type;
            }
        }
    };



    $scope.searthResultKeys = [];
   // $scope.$watch("searchHeaderValue",function(v,o){
     //   if(v){
       //     setTimeout(function(){
         //       API.searthKeysV({keyword:v}).then(function(data){
                    //$scope.searthResultKeys =  (data.data);
                   // for(var i=0;i<data.data.length;i++){
                     //   console.log(data.data[i])
                    //}
           //         $scope.searthResultKeys = [];
             //   },function(data){
               //     $scope.searthResultKeys = [];
               // });
            //},0);
        //}


//获取热门
    API.getHotSearch({}).then(function (data) {
        console.log(data);
        $scope.hotKeywords = data.data;
        console.log("热门搜索");
        console.log(data);
    }, function (data) {
        console.error("热门搜索获取失败：" + data);
    });
    //首页历史记录
    $scope.history = API.getHomeSearchHistory();
    $scope.clearHistory = function () {
        API.clearHomeSearchHistroy();
        $scope.history = [];
    };
    //优惠历史记录
    $scope.history1 = API.getDiscountSearchHistory();
    $scope.clearHistory1 = function () {
        API.clearDiscountSearchHistroy();
        $scope.history1 = [];
    };
    // 关键词搜索商户
    $scope.searchStore = function () {
        var para = {};
        API.getStore(para).then(function (data) {
            console.log('_____________________');
            console.log(JSON.stringify(data));
            alert(JSON.stringify(data));
            console.log('_____________________');
        }, function (data) {
            console.error('关键词搜索商户失败！');
        });
    };
    $scope.filterByOfferType = function (type) {
        // console.log('???????????????????');
        // console.log(document.getElementsByClassName("offer_list_filter_category2"));
        if (type === 1) {
            if (document.getElementsByClassName("offer_list_filter_category1")[0]) {
                document.getElementsByClassName("offer_list_filter_category1")[0].style.borderBottom = " 4px solid #cc0000";
                document.getElementsByClassName("offer_list_filter_category2")[0].style.borderBottom = "";
                document.getElementsByClassName("name1")[0].style.color = "#cc0000";
                document.getElementsByClassName("name2")[0].style.color = "#606060";
                $scope.search_type = 'bank';
            }
        } else {
            if (document.getElementsByClassName("offer_list_filter_category1")[0]) {
                document.getElementsByClassName("offer_list_filter_category2")[0].style.borderBottom = " 4px solid #cc0000";
                document.getElementsByClassName("offer_list_filter_category1")[0].style.borderBottom = "";
                document.getElementsByClassName("name2")[0].style.color = "#cc0000";
                document.getElementsByClassName("name1")[0].style.color = "#606060 ";
                $scope.search_type = 'store';
            }
        }
        $cookieStore.put('couponSearchType', $scope.search_type);
    };
    var couponSearchType = $cookieStore.get('couponSearchType') || 'bank';
    var searchType = couponSearchType == 'bank' ? 1 : 2;
    $scope.filterByOfferType(searchType);
 
}]);