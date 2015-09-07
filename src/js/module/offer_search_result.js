elife.controller('OfferSearchResultCtrl', [
    '$scope',
    '$routeParams',
    'SharedState',
    '$timeout',
    '$http',
    '$cookieStore',
    'API',
    function ($scope, $routeParams, SharedState, $timeout, $http, $cookieStore, API) {

        var KEY_STORE_FILTER_DISTRICT = "storeDistrict";
        var KEY_STORE_FILTER_CITY_DISTRICT = "storeCityDistrict";
        var KEY_STORE_FILTER_MODE = "storeFilterMode";
        var KEY_STORE_ORDER_NAME = "storeOrderName";
        var KEY_STORE_ORDER_KEY = "storeOrderKey";
        var KEY_STORE_FILTER_DISTANCE = "storeFilterDistance";
        var KEY_STORE_FILTER_TYPE = "storeFilterType";
        var KEY_STORE_FILTER_BIG_TYPE = "storeFIlterBigType";
        var KEY_STORE_SEARCH_KEYNAME = "keyname";
        $scope.curType=$routeParams.smallCode;
        $cookieStore.remove(KEY_STORE_FILTER_TYPE);
        console.log($routeParams.type);
        if ($routeParams.type) {
            $cookieStore.put(KEY_STORE_FILTER_BIG_TYPE,{small_name:null,small_code:null,large_code:$routeParams.code,large_name:window.decodeURIComponent($routeParams.type)});
        }
            

        var currentMode = $cookieStore.get(KEY_STORE_FILTER_MODE);
        var currentStoreDistrict = $cookieStore.get(KEY_STORE_FILTER_DISTRICT);
        var currentStoreCityDIstrict = $cookieStore.get(KEY_STORE_FILTER_CITY_DISTRICT);
        var currentStoreOrderName = $cookieStore.get(KEY_STORE_ORDER_NAME);
        var currentStoreOrderKey = $cookieStore.get(KEY_STORE_ORDER_KEY);
        var currentStoreFilterDistance = $cookieStore.get(KEY_STORE_FILTER_DISTANCE);
        // var currentStoreFilterDistrict = $cookieStore.get(KEY_STORE_FILTER_DISTRICT);
        var currentStoreFilterType = $cookieStore.get(KEY_STORE_FILTER_TYPE);
        var currentStoreFilterBigType = $cookieStore.get(KEY_STORE_FILTER_BIG_TYPE);

        $scope.removeAllCookies = function () {
         
       
        $cookieStore.remove(KEY_STORE_FILTER_MODE);
        $cookieStore.remove(KEY_STORE_FILTER_DISTANCE);
        $cookieStore.remove(KEY_STORE_FILTER_DISTRICT);
        $cookieStore.remove(KEY_STORE_FILTER_CITY_DISTRICT);
        $cookieStore.remove(KEY_STORE_FILTER_TYPE);
        $cookieStore.remove(KEY_STORE_FILTER_BIG_TYPE);
        $cookieStore.remove(KEY_STORE_ORDER_KEY);
        $cookieStore.remove(KEY_STORE_ORDER_NAME);
        $cookieStore.remove(KEY_STORE_SEARCH_KEYNAME);
        // obs._fire('returnBack');
        // history.back();
        if(ICBCUtil.isElifeIos() || ICBCUtil.isElifeAndroid()){
     // document.getElementsByClassName("return_btn")[0].setAttribute("href","javascript:void(0);");
          // window.history.back();
            if(ICBCUtil.isElifeAndroid()){ 
              elife_app.GetNativeFunctionAndroid({'keyword':'return_btn'});
            } else if (ICBCUtil.isElifeIos()){
              ICBCUtil.nativeGetConfig({
                'key' : 'return_btn',
                'callBack' : ''
              });
            }
        }
        else{
            history.back();
        }
       
    };

        if (currentStoreOrderKey && currentStoreOrderName) {
            $scope.order_key = currentStoreOrderKey;
            $scope.order_name = currentStoreOrderName;
        }
        if (currentStoreFilterDistance) {
            console.log(currentStoreFilterDistance);
            $scope.currentDistance = currentStoreFilterDistance;
            $scope.currentDistanceTitle = currentStoreFilterDistance + "米";
        }
        if (currentStoreCityDIstrict) {
            $scope.currentCityDistrict = currentStoreCityDIstrict;
        }
        if (currentStoreDistrict) {
            $scope.currentDistrict = currentStoreDistrict;
        }
        if (currentStoreFilterType) {
            $scope.currentSmallType = currentStoreFilterType;
        }
        if (currentStoreFilterBigType) {

            $scope.currentLargeType = currentStoreFilterBigType;
        }
        $scope.keyword = $cookieStore.get(KEY_STORE_SEARCH_KEYNAME)||$routeParams.keyword || '';

        $scope.largeCode = $routeParams.largeCode;
        //$scope.largeName = $routeParams.type;
        if($routeParams.type){
			$scope.largeName = window.decodeURIComponent($routeParams.type);
        }else{
			$scope.largeName=null;
        }

        //alert($scope.largeName);
        $scope.code = $routeParams.code;
        $scope.search_type = $routeParams.searchType;
        // 返回按钮
        // elife_app.SetReturnBtn();
        $scope.loading = true;
        $scope.mark = false;
        $scope.isEmpty = false;
        //列表排序选项开关
        $scope.sideTab2 = 0;
        $scope.selectType = function (type) {
            $scope.currentType = type;
        };
        $scope.filterToggle = function (n) {
            if (n === 0) {
                SharedState.turnOff('listFilter');
            } else {
                var index = SharedState.get('listFilterIndex') || 0;
                if (n === index) {
                    SharedState.toggle('listFilter');
                } else {
                    SharedState.set({listFilterIndex: n});
                    SharedState.turnOn('listFilter');
                }
            }
        };
        // (商区)距离
        $scope.filterByDistance = function (distance) {
            $scope.currentDistance = distance;
            $scope.currentDistanceTitle = distance + "米";
            $scope.currentDistrict = null;
            $scope.currentCityDistrict = null;
            $cookieStore.remove(KEY_STORE_FILTER_CITY_DISTRICT);
            $cookieStore.remove(KEY_STORE_FILTER_DISTRICT);
            $cookieStore.remove(KEY_STORE_FILTER_DISTANCE);
            $cookieStore.put(KEY_STORE_FILTER_DISTANCE, distance);
            console.log(distance);
            $scope.getList(0);
            $scope.filterToggle(0);
        };
        // 商区
        $scope.filterByDistrict = function (district) {
            if (district.community_name) {
                console.log(district);
                $scope.currentDistrict = district;
                $scope.currentCityDistrict = null;
                $cookieStore.remove(KEY_STORE_FILTER_DISTRICT);
                $cookieStore.remove(KEY_STORE_FILTER_CITY_DISTRICT);
                $cookieStore.put(KEY_STORE_FILTER_DISTRICT, district?district:'');
            }
            else {
                console.log('sss');
                console.log(district);
                var newCurrentCityDistrict = {
                    district_name: district.district_name, district_code: district.district_code
                };
                console.log('sss1');
                console.log(newCurrentCityDistrict);
                $scope.currentCityDistrict = newCurrentCityDistrict;
                console.log($scope.currentCityDistrict);
                $scope.currentDistrict = null;
                $cookieStore.remove(KEY_STORE_FILTER_CITY_DISTRICT);
                $cookieStore.remove(KEY_STORE_FILTER_DISTRICT);
                $cookieStore.put(KEY_STORE_FILTER_CITY_DISTRICT, newCurrentCityDistrict);
            }
            $scope.currentDistanceTitle = null;
            $cookieStore.remove(KEY_STORE_FILTER_DISTANCE);
            $scope.getList(0);
            $scope.filterToggle(0);
            console.log($scope);
        };
        //类别
        $scope.filterByType = function (sType) {
            if (sType.small_name) {
                console.log(sType);
                $scope.currentSmallType = sType;
                $scope.currentLargeType = null;
                $cookieStore.remove(KEY_STORE_FILTER_TYPE);
                $cookieStore.remove(KEY_STORE_FILTER_BIG_TYPE);
                $cookieStore.put(KEY_STORE_FILTER_TYPE, sType);
            }
            else {
                console.log(sType);
                $scope.currentLargeType = sType;
                $scope.currentSmallType = null;
                $cookieStore.remove(KEY_STORE_FILTER_BIG_TYPE);
                $cookieStore.remove(KEY_STORE_FILTER_TYPE);
                $cookieStore.put(KEY_STORE_FILTER_BIG_TYPE, sType);
            }
            $scope.getList(0);
            $scope.filterToggle(0);
        };
        // // 类别
        // $scope.filterByType = function(sType){
        //     $scope.currentType = sType;
        //     $cookieStore.remove(KEY_STORE_FILTER_TYPE);
        //     $cookieStore.put(KEY_STORE_FILTER_TYPE, sType);
        //     $scope.getList(0);
        //     $scope.filterToggle(0);
        // };
        // 排序
        $scope.filterByRank = function (rType, rName) {
            $scope.order_name = rName;
            $scope.order_key = rType;
            $cookieStore.remove(KEY_STORE_ORDER_KEY);
            $cookieStore.remove(KEY_STORE_ORDER_NAME);
            $cookieStore.put(KEY_STORE_ORDER_KEY, $scope.order_key);
            $cookieStore.put(KEY_STORE_ORDER_NAME, $scope.order_name);
            $scope.getList(0);
            $scope.filterToggle(0);
        };
        API.getAllDistrict({}).then(function (data) {
            $scope.hotCitys = data.top_list;
            $scope.citys = data.data;
            // for (var i = 0; i < $scope.citys.length; i++) {
            //     //first = {'districtCode': $scope.citys.length[i].}
            // }
            // //修改全部商区的显示 2015-05-15
            // if ($scope.districtId != '0') {
            //     $scope.currentDistrict.district_name = $scope.keyword;
            //     $scope.keyword = '';
            //     $scope.currentDistrict.community_name = $scope.districtId;
            //     $scope.currentDistrict.district_code = $scope.districtId;
            // }
        }, function (data) {
            console.error("商区获取失败：" + data);
            //$scope.toast('请检查网络设置');
        });
        API.getAllType({}).then(function (data) {
            $scope.allTypes = data;
            $scope.currentType = data[0];
            var len = data.length;
            var i = 0;
            while (i < len) {
                $scope.small_industry_list = data[i].small_industry_list;
                var j = $scope.small_industry_list.length;
                while (j--) {
                    if ($scope.small_industry_list[j].small_name == $scope.keyword) {
                        $scope.currentSmallType.small_name = $scope.keyword;
                    }
                }
                i++;
            }
            if($routeParams.smallCode){
                for(var m=0; m<data.length; m++){
                    for(var n=0; n<data[m].small_industry_list.length; n++){
                        if(data[m].small_industry_list[n].small_code === $routeParams.smallCode){
                            console.log(data[m].small_industry_list[n]);
                            $scope.filterByType(data[m].small_industry_list[n]);
                        }
                    }
                }
            }
        }, function (data) {
            console.error("全部分类获取失败：" + data);
        });
        // $http.post('http://192.168.2.60:8080/',{
        //   't_k' : $rootScope.token,
        //   'c_no' : $cookieStore.get('c_no'),
        //   'city_code' : '',
        //   's_row' : '',
        //   'e_row' : '',
        //   'keyword' : ''
        // })
        // .success(function (data) {
        // if (data.res == "0") {
        //   $scope.offerList = data.data;
        // }
        // });
        $scope.loadingMore = true;
        $scope.offerList = [];
        $scope.e_row = 0;
        $scope.page_size = 9;
        $scope.getList = function (firstTime) {
            $scope.loading = true;
            if (!firstTime) {
                $scope.districtId = 0;
            }
            $scope.isEmpty = false;
            var para = {};
            if ($scope.mark === false) {
                $scope.offerList = [];
                $scope.e_row = 0;
            }
            para.s_row = $scope.e_row + 1;
            para.e_row = para.s_row + $scope.page_size;
            $scope.e_row = para.e_row;
//    para.t_k = $rootScope.token;
//    para.c_no = $cookieStore.get('c_no');
//    para.s_row = $scope.sRow || 1;
//   para.e_row = $scope.eRow || 10;
//    para.bs_row = $scope.bsRow || 1;
//    para.be_row = $scope.beRow || 10;
//    if($scope.currentType){
//      para.large_code = $scope.currentType.big_code ;
//    }
            if ($scope.keyword) {
                para.keyword = $scope.keyword;
            }
            if ($scope.currentDistance) {
                para.query_distance = $scope.currentDistance;
            }
            if ($scope.currentCityDistrict) {
                para.city_district_code = $scope.currentCityDistrict.district_code;
            }
            if ($scope.currentDistrict) {
                para.district_code = $scope.currentDistrict.community_code;
            }
            if ($scope.currentLargeType) {
                para.large_code = $scope.currentLargeType.large_code;
            }
            if ($scope.currentSmallType) {
                para.small_code = $scope.currentSmallType.small_code;
            }
            if ($scope.order_key) {
                para.order_key = $scope.order_key;
            }
            if (!$scope.search_type) {
                //获取商户优惠列表
                API.getFavorablekeyWord(para).then(function (data) {
                    console.log(data);
                    if ($scope.load_timer) {
                        $timeout.cancel($scope.load_timer);
                    }
                    $scope.loading = false;
                    //$scope.offerList = data;
                    $scope.showMore = {};
                    var length1 = $scope.offerList.length;
                    $scope.offerList = $scope.offerList.concat(data ? data : []);
                    var length2 = $scope.offerList.length;
                    if (length1 === length2) {
                        $scope.loadingMore = false;
                    }
                    $scope.e_row = $scope.offerList.length;
                    if ((!$scope.offerList || $scope.offerList.length === 0)) {
                        // console.log('----------------------------');
                        // console.log($scope.list);
                        $scope.isEmpty = true;
                        $scope.loading = false;
                        $scope.mark = false;
                    }
                    else {
                        data.forEach(function (d) {
                            $scope.showMore[d.store_code] = false;
                        });
                        for (var i = para.s_row-1; i < $scope.offerList.length; i++) {
                            $scope.offerList[i].allList = $scope.offerList[i].gpp_list.concat($scope.offerList[i].text_list);
                            for (var j = 0; j < $scope.offerList[i].allList.length; j++) {
                                var item = $scope.offerList[i].allList[j];
                                item.detailPath = item.type !== "gpp" ? "#/discount/business_offer/" + item.store_code + '/' + item.text_code + '/store' : "#/discount/customers/" + item.store_code + '/' + item.gpp_code;
                            }
                        }
                    }
                    $scope.load_timer = $timeout(function(){
                        $scope.mark = false;
                    }, 1000);
                    // var list = data.text_list;
                    // console.log(list.length);
                    // var inFlag = 0;//保存数组中是否存在该store
                    // var temp = 0;//保存store所在index
                    // var offerList = [];
                    // for (var i=0; i<list.length; i++) {
                    //     list[i].distance /= 1000;
                    //     list[i].distance = list[i].distance.toFixed(1);
                    //     for(var j=0; j<offerList.length; j++){
                    //       if(offerList[j].store_code == list[i].store_code){
                    //         inFlag = 1;
                    //         temp = j;
                    //         break;
                    //       }
                    //     }
                    //     if(inFlag === 0){
                    //       offerList[offerList.length] = {
                    //         'store_code': list[i].store_code,
                    //         'store_name':list[i].store_name,
                    //         'distance':list[i].distance,
                    //         discounts:[]
                    //       };
                    //       offerList[offerList.length - 1].discounts[0] = list[i].text_pft_list;
                    //     }else{
                    //       inFlag = 0;
                    //       offerList[temp].discounts[offerList[temp].discounts.length] = list[i].text_pft_list;
                    //     }
                    //   }
                    //   // if(list === undefined || list.length === 0){
                    //   //   $scope.isEmpty = true;
                    //   // }
                    //   $scope.loading = false;
                    //   $scope.offerList = offerList;
                    //   console.log($scope.offerList);
                }, function (data) {
                    //$scope.toast('没有更多数据');
                    //console.log(data);
                    //$scope.offerList = [];
                    $scope.loading = false;
                    $scope.mark = false;
                    //$scope.isEmpty = true;
                });
            } else {
                //获取关键字搜优惠 优惠列表
                para.search_type = $routeParams.searchType;
                console.log(para);
                API.getSelectKeywordDiscount(para).then(function (data) {
                    if ($scope.load_timer) {
                        $timeout.cancel($scope.load_timer);
                    }
                    console.log("coupon search");
                    console.log(data);
                    $scope.loading = false;
                    $scope.showMore = {};
                    var length1 = $scope.offerList.length;
                    console.log('length1' + length1);
                    $scope.offerList = $scope.offerList.concat(data ? data : []);
                    var length2 = $scope.offerList.length;
                    console.log('length2' + length2);
                    if (length1 === length2) {
                        $scope.loadingMore = false;
                    }
                    $scope.e_row = $scope.offerList.length;
                    if ((!$scope.offerList || $scope.offerList.length === 0)) {
                        // console.log('----------------------------');
                        // console.log($scope.list);
                        $scope.isEmpty = true;
                        $scope.mark = false;
                    }
                    else {
                        data.forEach(function (d) {
                            $scope.showMore[data.store_code] = false;
                        });
                        for (var i = para.s_row-1; i < $scope.offerList.length; i++) {
                            $scope.offerList[i].allList = $scope.offerList[i].gpp_list.concat($scope.offerList[i].text_list);
                            $scope.offerList[i].allList = $scope.offerList[i].allList.concat($scope.offerList[i].bank_list);
                            for (var j = 0; j < $scope.offerList[i].allList.length; j++) {
                                if ($scope.offerList[i].allList[j].txt_pft_title) {
                                    $scope.offerList[i].allList[j].detailPath = "#/discount/business_offer/" + $scope.offerList[i].allList[j].store_code + '/' + $scope.offerList[i].allList[j].text_code + '/store';
                                } else if ($scope.offerList[i].allList[j].gpp_code) {
                                    $scope.offerList[i].allList[j].detailPath = "#/discount/customers/" + $scope.offerList[i].allList[j].store_code + "/" + $scope.offerList[i].allList[j].gpp_code;
                                } else if ($scope.offerList[i].allList[j].bank_pft_code) {
                                    $scope.offerList[i].allList[j].detailPath = "#/discount/card_offer/" + $scope.offerList[i].allList[j].bank_pft_code + '/bank';
                                }
                            }
                        }
                    }

                    console.log($scope.offerList);
                    $scope.load_timer = $timeout(function(){
                        $scope.mark = false;
                    }, 1000);
                }, function (data) {
                    $scope.toast('请检查网络状况');
                    console.log(data);
                    $scope.offerList = [];
                    $scope.loading = false;
                    $scope.mark = false;
                    $scope.isEmpty = true;
                });
            }
            //保存搜索记录
            API.addDiscountSearchHistory($scope.keyword);
        };
        // 获取列表
        if(!$routeParams.smallCode)
            $scope.getList(1);
        // 点击回车，提交搜索
        $scope.keypress1 = function ($e) {
            $scope.keyword = $e.currentTarget.value;
            if ($e.keyCode == 13 && $scope.keyword.trim() !== '') {
                $scope.getList(0);
                 $cookieStore.remove(KEY_STORE_SEARCH_KEYNAME);
                 $cookieStore.put(KEY_STORE_SEARCH_KEYNAME,$scope.keyword);
            }
               
            // $scope.getList(0);
        };
        $scope.showLoading = function () {
            $scope.mark = true;
            $scope.loadingMore = true;
            //       console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        };

        console.log($scope.currentLargeType);
    }]);
elife.controller('GppOfferSearchResultCtrl', ['$scope', '$routeParams', 'SharedState', '$http', '$cookieStore', 'API', function ($scope, $routeParams, SharedState, $http, $cookieStore, API) {
    $scope.searchHeaderValue='';
    var KEY_STORE_FILTER_DISTRICT = "storeDistrict";
    var KEY_STORE_FILTER_CITY_DISTRICT = "storeCityDistrict";
    var KEY_STORE_FILTER_MODE = "storeFilterMode";
    var KEY_STORE_ORDER_NAME = "storeOrderName";
    var KEY_STORE_ORDER_KEY = "storeOrderKey";
    var KEY_STORE_FILTER_DISTANCE = "storeFilterDistance";
    var KEY_STORE_FILTER_TYPE = "storeFilterType";
    var KEY_STORE_FILTER_BIG_TYPE = "storeFIlterBigType";
    var currentMode = $cookieStore.get(KEY_STORE_FILTER_MODE);
    var currentStoreDistrict = $cookieStore.get(KEY_STORE_FILTER_DISTRICT);
    var currentStoreCityDIstrict = $cookieStore.get(KEY_STORE_FILTER_CITY_DISTRICT);
    var currentStoreOrderName = $cookieStore.get(KEY_STORE_ORDER_NAME);
    var currentStoreOrderKey = $cookieStore.get(KEY_STORE_ORDER_KEY);
    var currentStoreFilterDistance = $cookieStore.get(KEY_STORE_FILTER_DISTANCE);
    // var currentStoreFilterDistrict = $cookieStore.get(KEY_STORE_FILTER_DISTRICT);
    var currentStoreFilterType = $cookieStore.get(KEY_STORE_FILTER_TYPE);

    var currentStoreFilterBigType = $cookieStore.get(KEY_STORE_FILTER_BIG_TYPE);
    if (currentStoreOrderKey && currentStoreOrderName) {
        $scope.order_key = currentStoreOrderKey;
        $scope.order_name = currentStoreOrderName;
    }
    if (currentStoreFilterDistance) {
        console.log(currentStoreFilterDistance);
        $scope.currentDistance = currentStoreFilterDistance;
        $scope.currentDistanceTitle = currentStoreFilterDistance + "米";
    }
    if (currentStoreCityDIstrict) {
        $scope.currentCityDistrict = currentStoreCityDIstrict;
    }
    if (currentStoreDistrict) {
        $scope.currentDistrict = currentStoreDistrict;
    }
    if (currentStoreFilterType) {
        $scope.currentSmallType = currentStoreFilterType;
    }
    if (currentStoreFilterBigType) {
        $scope.currentLargeType = currentStoreFilterBigType;
    }
    $scope.keyword = $routeParams.keyword || '';
    $scope.largeCode = $routeParams.largeCode;
    $scope.largeName = $routeParams.largeName;

    // 返回按钮
    // elife_app.SetReturnBtn();
    // $scope.loading = true;
    $scope.isEmpty = false;
    //列表排序选项开关
    $scope.sideTab2 = 0;
    $scope.selectType = function (type) {
        $scope.currentType = type;
    };
    $scope.filterToggle = function (n) {
        if (n === 0) {
            SharedState.turnOff('listFilter');
        } else {
            var index = SharedState.get('listFilterIndex') || 0;
            if (n === index) {
                SharedState.toggle('listFilter');
            } else {
                SharedState.set({listFilterIndex: n});
                SharedState.turnOn('listFilter');
            }
        }
    };
    //关键字查找
    $scope.keypress = function ($e) {
        $scope.searchHeaderValue = $e.currentTarget.value;
        if ($e.keyCode == 13) {
            if ($scope.searchHeaderValue) {
                console.log(encodeURI($scope.searchHeaderValue));
                window.location.hash = "/home/search_result/0/" + encodeURI($scope.searchHeaderValue);
            }
// $scope.searchStore({'store_name':$scope.searchValue});
        }
    };
// (商区)距离
    $scope.filterByDistance = function (distance) {
        $scope.currentDistance = distance;
        $scope.currentDistanceTitle = distance + "米";
        $scope.currentDistrict = null;
        $scope.currentCityDistrict = null;
        $cookieStore.remove(KEY_STORE_FILTER_CITY_DISTRICT);
        $cookieStore.remove(KEY_STORE_FILTER_DISTRICT);
        $cookieStore.remove(KEY_STORE_FILTER_DISTANCE);
        $cookieStore.put(KEY_STORE_FILTER_DISTANCE, distance);
        console.log(distance);
        $scope.getList(0);
        $scope.filterToggle(0);
    };
    // 商区
    $scope.filterByDistrict = function (district) {
        if (district !== '' || district.community_name) {
            console.log(district);
            $scope.currentDistrict = district;
            $scope.currentCityDistrict = null;
            $cookieStore.remove(KEY_STORE_FILTER_DISTRICT);
            $cookieStore.remove(KEY_STORE_FILTER_CITY_DISTRICT);
            $cookieStore.put(KEY_STORE_FILTER_DISTRICT, district?district:'');
        }
        else {
            console.log('sss');
            console.log(district);
            var newCurrentCityDistrict = {district_name: district.district_name, district_code: district.district_code};
            console.log('sss1');
            console.log(newCurrentCityDistrict);
            $scope.currentCityDistrict = newCurrentCityDistrict;
            console.log($scope.currentCityDistrict);
            $scope.currentDistrict = null;
            $cookieStore.remove(KEY_STORE_FILTER_CITY_DISTRICT);
            $cookieStore.remove(KEY_STORE_FILTER_DISTRICT);
            $cookieStore.put(KEY_STORE_FILTER_CITY_DISTRICT, newCurrentCityDistrict);
        }
        $scope.currentDistanceTitle = null;
        $cookieStore.remove(KEY_STORE_FILTER_DISTANCE);
        $scope.getList(0);
        $scope.filterToggle(0);
        console.log($scope);
    };
    //类别
    $scope.filterByType = function (sType) {
        if (sType.small_name) {
            console.log(sType);
            $scope.currentSmallType = sType;
            $scope.currentLargeType = null;
            $cookieStore.remove(KEY_STORE_FILTER_TYPE);
            $cookieStore.remove(KEY_STORE_FILTER_BIG_TYPE);
            $cookieStore.put(KEY_STORE_FILTER_TYPE, sType);
        }
        else {
            console.log(sType);
            $scope.currentLargeType = sType;
            $scope.currentSmallType = null;
            $cookieStore.remove(KEY_STORE_FILTER_BIG_TYPE);
            $cookieStore.remove(KEY_STORE_FILTER_TYPE);
            $cookieStore.put(KEY_STORE_FILTER_BIG_TYPE, sType);
        }
        $scope.getList(0);
        $scope.filterToggle(0);
    }
    $scope.filterByRank = function (rType, rName) {
        $scope.order_name = rName;
        $scope.order_key = rType;
        $cookieStore.remove(KEY_STORE_ORDER_KEY);
        $cookieStore.remove(KEY_STORE_ORDER_NAME);
        $cookieStore.put(KEY_STORE_ORDER_KEY, $scope.order_key);
        $cookieStore.put(KEY_STORE_ORDER_NAME, $scope.order_name);
        $scope.getList(0);
        $scope.filterToggle(0);
    };
    API.getAllDistrict({}).then(function (data) {
        $scope.hotCitys = data.top_list;
        $scope.citys = data.data;
    }, function (data) {
        console.error("商区获取失败：" + data);
        $scope.toast('请检查网络设置');
    });
    API.getAllType({}).then(function (data) {
        $scope.allTypes = data;
        $scope.currentType = data[0];
    }, function (data) {
        console.error("全部分类获取失败：" + data);
    });
    $scope.getList = function (firstTime) {
        if (!firstTime) {
            $scope.districtId = 0;
        }
        $scope.isEmpty = false;
        $scope.loading = true;
        var para = {};
        if ($scope.districtId !== 0) {
            para = {
                'order_key': $scope.order_key,
                'district_code': $scope.districtId,
                'longitudeLocal': $cookieStore.get('longitude'),
                'latitudeLocal': $cookieStore.get('latitude'),
                's_row': '1',
                'e_row': '10',
                'discount': $scope.discount_role,
                'avg_price': $scope.avg_price
            };
        } else {
            para = {
                'order_key': $scope.order_key,
                'store_name': $scope.keyword,
                't_k': $cookieStore.get('t_k'),
                'c_no': $cookieStore.get('c_no'),
                'city_code': $cookieStore.get('city_code'),
                's_row': '1',
                'e_row': '10',
                'discount': $scope.discount_role,
                'avg_price': $scope.avg_price
            };
            if ($scope.keyword) {
                para.keyword = $scope.keyword;
            }
            if ($scope.currentCityDistrict) {
                para.city_district_code = $scope.currentCityDistrict.district_code;
            }
            if ($scope.currentLargeType) {
                para.large_code = $scope.currentLargeType.large_code;
            }
            if ($scope.currentSmallType) {
                para.small_code = $scope.currentSmallType.small_code;
            }
            if ($scope.currentDistrict) {
                para.district_code = $scope.currentDistrict.community_code;
            }
            if ($scope.currentSortType) {
                para.sort = $scope.currentSortType;
            }
            if ($scope.currentDistance) {
                para.query_distance = $scope.currentDistance.distance;
            }
        }
        //获取积分消费商户列表
        API.getFavorablekeyWord(para).then(function (data) {
            console.log(data);
            $scope.offerList = data;
            $scope.showMore = {};
            $scope.loading = false;
            if (data) {
                data.forEach(function (d) {
                    $scope.showMore[data.store_code] = false;
                });
            }
            else {
                $scope.loading = false;
                $scope.offerList = [];
                $scope.isEmpty = true;
            }
        }, function (data) {
            $scope.loading = false;
            $scope.offerList = [];
            $scope.isEmpty = true;
            // $scope.offerList = [];
            // $scope.isEmpty = true;
            $scope.toast('请检查网络状况');
            console.log(data);
        });
        //保存搜索记录
        API.addDiscountSearchHistory($scope.keyword);
    };
    // 获取列表
    $scope.getList(1);
    //点击回车，提交搜索
    $scope.keypress1 = function () {
        if ($e.keyCode == 13 && $scope.keyword.trim() !== '') {
            console.log("进行搜索");
            $scope.getList(0);
        }
        // $scope.getList(0);
    };

}]);