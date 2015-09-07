elife.controller('CardOfferListCtrl', ['$scope', 'SharedState', '$http', '$cookieStore', 'API', '$rootScope', function ($scope, SharedState, $http, $cookieStore, API, $rootScope) {
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
  
    // 获取工行卡优惠列表
    // $http.post('http://192.168.2.60:8080/',{
    //   't_k' : $rootScope.token,
    //   'c_no' : $cookieStore.get('c_no'),
    //   'city_code' : '',
    //   's_row' : '',
    //   'e_row' : ''
    // })
    // .success(function (data) {
    //     if (data.res == "0") {
    //       $scope.typeName = data.data.type_name;
    //       $scope.businessList = data.data.merchantsList;
    //     }
    // });
    $scope.typeName = '工行卡优惠';
    $scope.imgBaseUrl = $rootScope.imgBaseUrl;
    // $scope.cardOfferList = [
    //   {
    //       "image_url": "images/restaurant_qjn.jpg",
    //       "title": "工行卡优惠标题",
    //       "begin_time": "2015-05-05",
    //       "count": "6"
    //   },
    //   {
    //       "image_url": "images/restaurant_qjn.jpg",
    //       "title": "工行卡优惠标题",
    //       "begin_time": "2015-05-05",
    //       "count": "6"
    //   }
    // ];
    $scope.loading = true;
    $scope.mark = false;
    $scope.isEmpty = false;
    $scope.list = [];
    //列表排序选项开关
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
    //列表排序选项开关
    $scope.sideTab2 = 0;
    $scope.selectType = function (type) {
        $scope.currentType = type;
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
        $scope.getList();
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
            $cookieStore.put(KEY_STORE_FILTER_DISTRICT, district);
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
        $scope.getList();
        $scope.filterToggle(0);
    };
    //排序
    $scope.filterByRank = function (rType, rName) {
        $scope.order_name = rName;
        $scope.order_key = rType;
        $cookieStore.remove(KEY_STORE_ORDER_KEY);
        $cookieStore.remove(KEY_STORE_ORDER_NAME);
        $cookieStore.put(KEY_STORE_ORDER_KEY, $scope.order_key);
        $cookieStore.put(KEY_STORE_ORDER_NAME, $scope.order_name);
        $scope.getList();
        $scope.filterToggle(0);
    };
    API.getAllDistrict({}).then(function (data) {
        $scope.hotCitys = data.top_list;
        $scope.citys = data.data;
    }, function (data) {
        console.error("商区获取失败：" + data);
    });
    API.getAllType({}).then(function (data) {
        $scope.allTypes = data;
        $scope.currentType = data[0];
    }, function (data) {
        console.error("全部分类获取失败：" + data);
    });
    $scope.loadingMore = true;
    $scope.list = [];
    $scope.e_row = 0;
    $scope.page_size = 9;
    $scope.getList = function () {
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
        if ($scope.currentDistance) {
            para.query_distance = $scope.currentDistance.distance;
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
        if ($scope.order_key) {
            para.order_key = $scope.order_key;
        }
        console.log('small_code' + para.small_code + '; district_code' + para.district_code);
        API.getICBCDiscountList(para).then(function (data) {
            console.log("工行卡列表");
            console.log(data);
            var length1 = $scope.list.length;
            $scope.list = $scope.list.concat(data ? data : []);
            var length2 = $scope.list.length;
            // console.log('###########################################');
            // console.log(length1);
            // console.log(length2);
            // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
            if (length1 === length2) {
                $scope.loadingMore = false;
            }
            if ((!$scope.list || $scope.list.length === 0)) {
                // console.log('----------------------------');
                // console.log($scope.list);
                $scope.toast('没有搜索结果');
                $scope.list = [];
                $scope.isEmpty = true;
                $scope.loading = false;
                $scope.mark = false;
            }
            $scope.cardOfferList = $scope.list;
            console.log($scope.cardOfferList);
            $scope.loading = false;
            $scope.mark = false;
        }, function (data) {
            $scope.toast('请检查网络设置');
            console.error("列表获取失败：" + data);
            $scope.list = [];
            $scope.loading = false;
            $scope.mark = false;
        });
    };
    // 获取列表
    $scope.getList();
    $scope.showLoading = function () {
        $scope.mark = true;
        // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    };
   
}]);