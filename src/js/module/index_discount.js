elife.controller('IndexDiscountCtrl', ['$scope', '$document', '$http', '$cookieStore', '$routeParams', 'API', '$rootScope', '$timeout', function ($scope, $document, $http, $cookieStore, $routeParams, API, $rootScope, $timeout) {
    // 弹窗交互数据
    $scope.imgBaseUrl = $rootScope.imgBaseUrl;
    $scope.businessOfferCategories = [];
    // 以下location将在maincontroller中的rootScope中定义。
    // $scope.location = $cookieStore.get('city_name');
    if (!$scope.location) {
        $timeout(function () {
            if (ICBCUtil.isElifeAndroid()) {
                elife_app.GetNativeFunctionAndroid({'keyword': 'getCityCode'});
            } else if (ICBCUtil.isElifeIos()) {
                ICBCUtil.nativeGetConfig({
                    'key': 'getCityCode',
                    'callBack': "GetCityCodeCallbackIos"
                });
            }
        }, 0);
    }
    $scope.isElifeAndroid = ICBCUtil.isElifeAndroid();
    $scope.isElifeClient = ICBCUtil.isElifeIos() || ICBCUtil.isElifeAndroid();
    // 获取商户优惠大类
    API.getIndustryFavorable().then(function (data) {
        console.log("商户优惠大类");
        console.log(data);
        $scope.businessOfferCategories = data;
    }, function (data) {
        console.log("获取商户优惠大类失败");
        console.log(data);
    });
    // 获取工行卡优惠列表情况
    API.getICBCDiscountList({
        s_row: 1,
        e_row: 10,
        top_flag:1
    }).then(function (data) {
        console.log(data);
        var tabCount = data.length / 3;
        if (data.length % 3) {
            tabCount += 1;
        }
        tabCount = parseInt(tabCount);
        ghService = [];
        for (var i = 0; i < tabCount; i++) {
            var services = data.slice(i * 3, (i + 1) > tabCount ? tabCount * 3 : (i + 1) * 3);
            ghService[i] = {
                'services': services
            };
        }
        $scope.ghService = ghService;
    }, function (data) {
        $scope.ghService = [];
        console.error("列表获取失败：" + data);
    });
//收藏商户优惠
    // $scope.addBusinessFavor = function(){
    //   console.log("收藏商户");
    //   $http.post('http://192.168.2.60:8080/OFSTCUST/cuinfo/findCuMoreById.action ',{
    // 't_k' : $rootScope.token,
    // 'c_no' : $cookieStore.get('c_no'),
    // 's_code' : '11',
    // 'pft_code' : $cookieStore.get('city_code')
    // })
    // .success(function (data) {
    //   if(data.res === 0){
    //     console.log("成功");
    //   }
    //   if(data.res === 1000002){
    //     console.log("失败");
    //   }
    //   if(data.res === 1000003){
    //     console.log("缺少参数");
    //   }
    // });
    // };
    // $http.post('http://118.144.88.162:8082/OFSTCUST/bankiscount/findBankDiscountDetail.action',{
    // 't_k' : $rootScope.token,
    // 'c_no' : $cookieStore.get('c_no'),
    //  'pft_code' : 'Y0001150507000030'
    // })
    // .success(function (data) {
    //   console.log("银行优惠详情");
    //   console.log(data);
    // });
    $scope.getNearStoreDiscount = function (distance) {
        var para = {};
        //    para.t_k = $rootScope.token;
        //    para.c_no = $cookieStore.get('c_no');
        para.city_code = $cookieStore.get('city_code');
        para.s_row = 0;
        para.e_row = 10;
//     para.bs_row = $scope.bsRow || 1;
//     para.be_row = $scope.beRow || 10;
        //    if($scope.keyword){
        //      para.keyword = $scope.keyword;
        //    }
        para.query_distance = distance;
        // para.latitude = $cookieStore.get('latitude');
        // para.longitude = $cookieStore.get('longitude');
        //获取积分消费商户列表
        API.getNearStoreDiscount(para).then(function (data) {
            console.log('附近优惠');
            console.log(data);
            //     var list = data;
            //      // 解析商户图标
            //      for (var i=0; i<list.length; i++) {
            //          list[i].distance /= 1000;
            //          list[i].distance = list[i].distance.toFixed(1);
            // //          list[i].discount_role = API.resolveDiscountRole(list[i].discount_role);
            // //          var stars=[];
            // //          for(var j=0;j<5;j++)
            // //          {
            // //            if (j+1<=list[i].level)
            // //            {
            // //              stars[j] = {"type":"full"};
            // //            }else if(j - list[i].level < 0)
            // //            {
            // //              stars[j] = {"type":"half"};
            // //            }else {
            // //              stars[j] = {"type" : "gray"};
            // //            }
            // //          }
            // //          list[i].stars = stars;
            //        }
            $scope.storeList = data;

            for(var i=0; i<data.length; i++) {
                if(data[i].bank_list.length > 0 || data[i].text_list.length > 0){
                    data[i].bottomContent = "";
                    if (data[i].district_name1 && data[i].district_name1 !== '') {
                        data[i].bottomContent += data[i].district_name1;
                        data[i].bottomContent += '/';
                    }
                    if (data[i].district_name2 && data[i].district_name2 !== '') {
                        data[i].bottomContent += data[i].district_name2;
                        data[i].bottomContent += '/';
                    }
                    if (data[i].district_name3 && data[i].district_name3 !== '') {
                        data[i].bottomContent += data[i].district_name3;
                        data[i].bottomContent += '/';
                    }
                    if (data[i].small_name1 && data[i].small_name1 !== '') {
                        data[i].bottomContent += data[i].small_name1;
                        data[i].bottomContent += '/';
                    }
                    if (data[i].small_name2 && data[i].small_name2 !== '') {
                        data[i].bottomContent += data[i].small_name2;
                        data[i].bottomContent += '/';
                    }
                    if (data[i].small_name3 && data[i].small_name3 !== '') {
                        data[i].bottomContent += data[i].small_name3;
                        data[i].bottomContent += '/';
                    }
                    data[i].bottomContent = data[i].bottomContent.substring(0, data[i].bottomContent.length - 1);
                }
            }
            // if(list === undefined || list.length === 0){
            //  $scope.isEmpty = true;
            // }
            //      $scope.loading = false;
            console.log($scope.discounts);
        }, function (data) {
            $scope.toast('请检查网络状况');
            // $scope.isEmpty = true;
        });
    };
    $scope.getNearStoreDiscount(5000);
    //app交互判断是不是e生活的客户端
    if (ICBCUtil.isElifeIos() || ICBCUtil.isElifeAndroid()) {
        var hideEle = document.querySelectorAll('.foot,.close_icon,.about_us,.about_us_border');
        _(hideEle).css('display', 'none');
    }
    //app获取 gps定位
    $scope.gps = function () {
        console.log(1111);
        if (ICBCUtil.isElifeAndroid() || ICBCUtil.isAndroid()) {
            elife_app.GetLocationAndroid();
        }
        if (ICBCUtil.isElifeIos() || ICBCUtil.isIPhone()) {
            //调用地理位置
            ICBCUtil.nativeGetConfig({
                'key': 'getGPS',
                'callBack': GetLocationCallback
            });
        }
    };
    // $scope.share = function (para) {
    //   /*分享相关数据暂时写死*/
    //   var testObj = {
    //     PNGUrl : 'xxxxxxxx.png',
    //     ShareUrl : 'http://www.baidu.com',
    //     Title : '标题',
    //     Content : '内容',
    //     UseChannel : 1
    //   };
    //   testObj = JSON.stringify(testObj);
    //    if(ICBCUtil.isElifeAndroid()||ICBCUtil.isAndroid()){
    //      // elife_app.GetNativeFunction({'keyword':'getShare'});
    //      // elife_app.GetNativeFunctionAndroid(API.base64.encode(testObj));
    //      elife_app.GetNativeFunctionAndroid({'keyword':'getShare','shareInfo':API.base64.encode(testObj)});
    //    }
    //    if(ICBCUtil.isElifeIos()||ICBCUtil.isIPhone()){
    //   /*dataString 需要base64转换*/
    //     // var testObjDataString = encodeURI(testObj);
    //     ICBCUtil.nativeGetConfig({
    //       'key' : 'getShare',
    //       'callBack' : "",
    //       'dataString' : API.base64.encode(testObj)
    //     });
    //    }
    // };
    $scope.getPhoto = function () {
        if (ICBCUtil.isElifeAndroid() || ICBCUtil.isAndroid()) {
            elife_app.GetNativeFunctionAndroid({'keyword': 'getPhoto'});
        }
        if (ICBCUtil.isElifeIos() || ICBCUtil.isIPhone()) {
            ICBCUtil.nativeGetConfig({
                'key': 'getPhoto',
                'callBack': ""
            });
        }
    };
}]);