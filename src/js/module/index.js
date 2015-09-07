
elife.controller('IndexCtrl', ['$scope', '$rootScope', '$cookieStore', '$http', 'API', function ($scope, $rootScope, $cookieStore, $http, API) {
    // 初始化参数

    $scope.imgBaseUrl = $rootScope.imgBaseUrl;
    $scope.details = [];
    $scope.status = '1';
    $scope.ini = 0;
    $scope.getList = API.getAwardList($scope, function func() {
        if ($scope.ini >= 2) {
            return;
        }
        $scope.getList();
        $scope.ini++;
    });
    $scope.getList();
    //定位城市选择
    if(localStorage.getItem('city_name')){
        $scope.location = localStorage.getItem('city_name');
    } else {
        $scope.toast('未定位城市');
        location.href = '#/choose_locator';
    }
    // $rootScope.loading = true;
    API.getBannerInfo().then(function (data) {
        var len = data.length;
        if(len===0){
            $scope.isEmptyBanner=true;
            return;
        }
        $scope.bannerInfo = data;
        console.log("首页图片");
        console.log($scope.bannerInfo);
    }, function (data) {
        
        // $scope.bannerInfo = [{
        //     "promotions_code": "110100",
        //     "image_name": "名称用于图片显示不了的提示",
        //     "image_url": "images/card_offer_top.jpg"
        // },{
        //     "promotions_code": "110100",
        //     "image_name": "名称用于图片显示不了的提示",
        //     "image_url": "images/card_offer_top.jpg"
        // },{
        //     "promotions_code": "110100",
        //     "image_name": "名称用于图片显示不了的提示",
        //     "image_url": "images/index_top.jpg"
        // }];
        console.error('宣传图片获取失败' + data);
        $scope.toast('请检查网络状况');
        $scope.bannerInfo = [];
    });
    //大类服务
    $scope.imgBaseUrl = $rootScope.imgBaseUrl;
    API.getHomeLargeCategory({
        e_row: 3
    }).then(function (data) {
        console.log("行业大类：");
        console.log(data);
        $scope.largeCategory = data;
    }, function (data) {
        $scope.largeCategory = [];
        console.error("行业大类获取失败：" + data);
        $scope.toast('请检查网络状况');
    });
    //工行服务
    $scope.imgBaseUrl = $rootScope.imgBaseUrl;
    API.getHomeGhService({
        e_row: 7,
        r_now: 1
    }).then(function (data) {
        var len = data.length;
        var tabCount = len / 4;
        if (len % 4) {
            tabCount += 1;
        }
        tabCount = parseInt(tabCount);
        ghService = [];
        for (var i = 0; i < tabCount; i++) {
            var services = data.slice(i * 4, (i + 1) > tabCount ? tabCount * 4 : (i + 1) * 4);
            ghService[i] = {
                'services': services
            };
        }
        $scope.ghService = ghService;
        //     console.log("工行服务测试");
        // console.log($scope.ghService);
        // $scope.ghService = new Array();
        //
        // $scope.ghService[0] = data.slice(0, 4);
        // if(data.length>4){
        //   $scope.ghService[1] = data.slice(4, 8);
        //     if(data.length>8){
        //       $scope.ghService[2] = data.slice(8, 12);
        //     }
        // }
    }, function (data) {
        $scope.ghService = [];
        console.error("工行服务获取失败：" + data);
        $scope.toast('请检查网络状况');
    });
    //精选优惠
    API.getHomeSpecialOffer({}).then(function (data) {
        console.log("精选优惠");
        $scope.specialOffer = true;
        console.log(data);
        $scope.specialOffer = data;
    }, function (data) {
        console.error("精选优惠获取失败：" + data);
    });
    // $http.post('http://223.223.177.32:8082/OFSTCUST/coupon/getCouponFirst.action',{
    //    't_k' : $rootScope.token,
    //    'c_no' : $cookieStore.get('c_no'),
    //    'Cn_code' : $cookieStore.get('cn_code'),
    //    'city_code' :  '110000'
    //  }).success(function (data) {
    //    console.log("精选优惠");
    //    console.log(data);
    //  });
    // $scope.specialOffer = [
    //   {
    //     "store_name": "门店优惠标题",
    //     "image_url": "images/restaurant_bgps.jpg",
    //     "preferential_code": "252166254424",
    //     "o_price": "123",
    //     "n_price": "100"
    //   },
    //   {
    //     "store_name": "门店优惠标题",
    //     "image_url": "images/restaurant_bgps.jpg",
    //     "preferential_code": "252166254424",
    //     "o_price": "123",
    //     "n_price": "100"
    //   },
    //   {
    //     "store_name": "门店优惠标题",
    //     "image_url": "images/restaurant_bgps.jpg",
    //     "preferential_code": "252166254424",
    //     "o_price": "123",
    //     "n_price": "100"
    //   }
    // ];
//推荐商户
// $http.post('http://223.223.177.32:8082/OFSTCUST/storecredit/getRecommendedStoreForIndex.action',{
//     't_k' : '10000',
//     'c_no' : 'AA',
//     'count' : '10',
//     'citycode' :  '110100'
//   }).success(function (data) {
//     console.log("推荐商户");
//     console.log(data);
//   });
    // 推荐商户
    API.getHomeRecommandStore({}).then(function (data) {
        console.log('推荐商户');
        console.log(data);
        $scope.recommandStore = data;
        //更换img图片url
        // var getImgs = function (imgurl){
        //   API.getImg(imgurl).then(function(data){
        //     console.log(data);
        //     // $scope.recommandStore[i].image_url = data;
        //   }, function(data){
        //     console.log("更换img图片失败");
        //   });
        // };
        // for(var i=0, dataLength=data.length; i<dataLength; i++) {
        //   var imgurl = $scope.recommandStore[i].image_url;
        //   getImgs(imgurl);
        // }
    }, function (data) {
        console.log('推荐商户失败');
        // $scope.recommandStore = [
        //   {
        //     "store_code":"1111111",
        //     "store_name": "门店名称",
        //     "image_url": "images/restaurant_jdx.jpg",
        //     "title": "超值自助餐"
        //   },
        //   {
        //     "store_code":"1111111",
        //     "store_name": "门店名称",
        //     "image_url": "images/restaurant_jdx.jpg",
        //     "title": "超值自助餐"
        //   }
        // ];
    });
    // 更多推荐商户
    API.getMoreRecommandStore({}).then(function (data) {
        console.log('更多推荐商户');
        console.log(data);
        $scope.moreRecommandStore = data;
    }, function (data) {
    });
    //天天抽奖
    // API.getDailyGamble({}).then(function(data){
    //   console.log('天天抽奖');
    //   console.log(data);
    // }, function(data){
    //   console.error("获取天天抽奖列表失败：" +  data);
    // });
    // 猜你喜欢
    console.log(localStorage.getItem('city_code'));
    console.log($cookieStore.get('city_code'));
    API.getHomeGuessLike({}).then(function (data) {
        $scope.guessLike = data;
        if (data) {
            console.log(data);
            for (var i = 0; i < $scope.guessLike.length; i++) {
                $scope.guessLike[i].discount_role = API.resolveDiscountRole($scope.guessLike[i].discount_role);
                $scope.guessLike[i].new_discount_role = [];
                // 内边距
                $scope.guessLike[i].PRStyle = {paddingRight : $scope.guessLike[i].discount_role.length * 18 + 'px'};
                console.log($scope.guessLike[i].discount_role.length);
                for (var z = 0; z < $scope.guessLike[i].discount_role.length; z++) {
                    API.loopRoleIcons($scope, i, z);
                }
                $scope.guessLike[i].new_discount_role = API.removeEmptyArrEleAndReverse($scope.guessLike[i].new_discount_role);
                var stars = [];
                for (var j = 0; j < 5; j++) {
                    if (j + 1 <= $scope.guessLike[i].levels) {
                        stars[j] = {"type": "full"};
                    } else if (j - $scope.guessLike[i].levels < 0) {
                        stars[j] = {"type": "half"};
                    } else {
                        stars[j] = {"type": "gray"};
                    }
                }
                $scope.guessLike[i].levels = stars;
                $scope.guessLike[i].bottomContent = '';
                if (($scope.guessLike[i].bottomContent.length <= 18) && $scope.guessLike[i].district_name1 && $scope.guessLike[i].district_name1 !== '') {
                    $scope.guessLike[i].bottomContent += $scope.guessLike[i].district_name1;
                    $scope.guessLike[i].bottomContent += '/';
                }
                if (($scope.guessLike[i].bottomContent.length <= 18) && $scope.guessLike[i].district_name2 && $scope.guessLike[i].district_name2 !== '') {
                    $scope.guessLike[i].bottomContent += $scope.guessLike[i].district_name2;
                    $scope.guessLike[i].bottomContent += '/';
                }
                if (($scope.guessLike[i].bottomContent.length <= 18) && $scope.guessLike[i].district_name3 && $scope.guessLike[i].district_name3 !== '') {
                    $scope.guessLike[i].bottomContent += $scope.guessLike[i].district_name3;
                    $scope.guessLike[i].bottomContent += '/';
                }
                $scope.guessLike[i].bottomContent = $scope.guessLike[i].bottomContent.substring(0, $scope.guessLike[i].bottomContent.length - 1) + ' ';
                if (($scope.guessLike[i].bottomContent.length <= 18) && $scope.guessLike[i].small_name1 && $scope.guessLike[i].small_name1 !== '') {
                    $scope.guessLike[i].bottomContent += $scope.guessLike[i].small_name1;
                    $scope.guessLike[i].bottomContent += '/';
                }
                if (($scope.guessLike[i].bottomContent.length <= 18) && $scope.guessLike[i].small_name2 && $scope.guessLike[i].small_name2 !== '') {
                    $scope.guessLike[i].bottomContent += $scope.guessLike[i].small_name2;
                    $scope.guessLike[i].bottomContent += '/';
                }
                if (($scope.guessLike[i].bottomContent.length <= 18) && $scope.guessLike[i].small_name3 && $scope.guessLike[i].small_name3 !== '') {
                    $scope.guessLike[i].bottomContent += $scope.guessLike[i].small_name3;
                    $scope.guessLike[i].bottomContent += '/';
                }
                $scope.guessLike[i].bottomContent = $scope.guessLike[i].bottomContent.substring(0, $scope.guessLike[i].bottomContent.length - 1);
                $scope.guessLike[i].showdistance = $scope.guessLike[i].distance + ($scope.guessLike[i].unit || 'm');
            }
        }
    }, function (data) {
        console.error("获取猜你喜欢列表失败：" + data);
    });
    // $scope.guessLike = [
    //   {
    //     "cis_num": "102030411111",
    //     "mer_name": "商户名称",
    //     "image_url": "images/restaurant_qjn.jpg",
    //     "address": "海淀区",
    //     "dcmt_level": "4",
    //     "distance":"700",
    //     "small_type": "川菜/家常菜",
    //     "price": "200",
    //     "is_yd":"1",
    //     "is_fq":"0",
    //     "is_jf":"1",
    //     "is_sk":"0",
    //     "is_gh":"0",
    //     "is_tu":"0",
    //     "is_cx":"0",
    //     "is_ka":"0"
    //   },
    //   {
    //     "cis_num": "102030411111",
    //     "mer_name": "商户名称",
    //     "image_url": "images/restaurant_qjn.jpg",
    //     "address": "海淀区",
    //     "dcmt_level": 3,
    //     "distance":"700",
    //     "small_type": "川菜/家常菜",
    //     "price": "200",
    //     "is_yd":"1",
    //     "is_fq":"0",
    //     "is_jf":"1",
    //     "is_sk":"0",
    //     "is_gh":"0",
    //     "is_tu":"0",
    //     "is_cx":"0",
    //     "is_ka":"0" 
    //   }
    // ];
    $scope.yidaiName = "逸贷(分期)商户";
    $scope.jifenName = "积分消费商户";
// app交互获取定位
    $scope.get_location = function () {
        var callback = location_callback;
        var para = {
            "key": "getGPS",
            "callBack": callback
        };
        ICBCUtil.nativeGetConfig(para);
    };
// app交互返回到客户端
    $scope.close_client = function () {
        // location_callback({
        //   "longitude":"11",
        //   "latitude":"122"
        // });
        if (ICBCUtil.isIPhone()||localStorage.zhl) {
            ICBCUtil.nativeGetConfig({
                'key': 'closeWebview',
                'callBack': ''
            });
        } else if (ICBCUtil.isAndroid()) {
            elife_app.GetNativeFunctionAndroid({'keyword': 'closeWebview'});
        }
    };
    $scope.doScan = function () {
        location.hash = '/scan';
    };
}]);