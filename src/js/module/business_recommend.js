elife.controller('businessRecommendCtrl', ['$rootScope', '$scope', '$routeParams', 'SharedState', '$http', '$cookieStore', 'API', function ($rootScope, $scope, $routeParams, SharedState, $http, $cookieStore, API) {
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
    $scope.removeAllCookies = function () {
        setTimeout(function () {
            $cookieStore.remove(KEY_STORE_FILTER_MODE);
            $cookieStore.remove(KEY_STORE_FILTER_DISTANCE);
            $cookieStore.remove(KEY_STORE_FILTER_DISTRICT);
            $cookieStore.remove(KEY_STORE_FILTER_CITY_DISTRICT);
            $cookieStore.remove(KEY_STORE_FILTER_TYPE);
            $cookieStore.remove(KEY_STORE_FILTER_BIG_TYPE);
            $cookieStore.remove(KEY_STORE_ORDER_KEY);
            $cookieStore.remove(KEY_STORE_ORDER_NAME);
            // obs._fire('returnBack');
            // history.back();
            if (ICBCUtil.isElifeIos() || ICBCUtil.isElifeAndroid()) {
                // document.getElementsByClassName("return_btn")[0].setAttribute("href","javascript:void(0);");
                // window.history.back();
                setTimeout(function () {
                    if (ICBCUtil.isElifeAndroid()) {
                        elife_app.GetNativeFunctionAndroid({'keyword': 'return_btn'});
                    } else if (ICBCUtil.isElifeIos()) {
                        ICBCUtil.nativeGetConfig({
                            'key': 'return_btn',
                            'callBack': ''
                        });
                    }
                }, 0);
            }
            else{
                window.history.back();
                return false;
            }
        }, 0);
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
    var pageSize = 10;
    $scope.isMapModel = false;
    if (currentMode === "map") {
        $scope.mapFilter = true;
        $scope.isMapModel = true;
        $scope.currentMapPage = -1;
    }
    // 返回按钮
    // elife_app.SetReturnBtn();
    $scope.loading = true;
    $scope.mark = false;
    $scope.isEmpty = false;
    $scope.setPositionData = function () {
        $rootScope.assignSliderData($scope.position).then(function func(data) {
            $scope.position = data;
        });
    };
    //列表排序选项开关
    $scope.sideTab2 = 0;
    $scope.selectType = function (type) {
        $scope.currentType = type;
    };
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
        $scope.getList();
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
            var newCurrentLargeType = {large_code: sType.large_code, large_name: sType.large_name};
            $scope.currentLargeType = sType;
            $scope.currentSmallType = null;
            $cookieStore.remove(KEY_STORE_FILTER_BIG_TYPE);
            $cookieStore.remove(KEY_STORE_FILTER_TYPE);
            $cookieStore.put(KEY_STORE_FILTER_BIG_TYPE, newCurrentLargeType);
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
    var initializeMap = function () {
        map = new BMap.Map("map");
        // map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
        map.centerAndZoom(new BMap.Point($cookieStore.get('longitude'), $cookieStore.get('latitude')), 11);
    };
    $scope.refreshMapContent = function (stores) {//TODO 添加覆盖
        stores.forEach(function (store) {
            console.log(store);
            var point = new BMap.Point(store.longitude, store.latitude);
            var marker = new BMap.Marker(point);
            map.addOverlay(marker);
        });
    };
    $scope.storeFilter = function (icbc, discount, mapFilter) {
        if (mapFilter) {
            //地图筛选
            $scope.mapFilter = true;
            // $cookieStore.put(KEY_STORE_FILTER_MODE, "map");
            $rootScope.updateMap($scope);

        } else {
            $scope.mapFilter = false;
            $cookieStore.remove(KEY_STORE_FILTER_MODE);
        }
        API.getFilterRoles($scope, icbc, discount);
        $scope.avg_price = $scope.position.min + ',' + $scope.position.max;
        $scope.getList(0);
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
    $scope.page_size = 10;
    $scope.getList = function () {
        $scope.loading = true;
        // $scope.isEmpty = false;
        var para = {};
        if ($scope.mark === false) {
            $scope.list = [];
            $scope.e_row = 0;
        }
        para.s_row = $scope.e_row;
        para.e_row = para.s_row + $scope.page_size;
        $scope.e_row = para.e_row;
        para.avg_price = $scope.avg_price;
        para.discount_role = $scope.discount_role;
//    if($scope.currentType){
//      para.large_code = $scope.currentType.big_code ;
//    }
        if ($scope.currentCityDistrict) {
            para.city_district_code = $scope.currentCityDistrict.district_code;
        }
        if ($scope.currentLargeType) {
            para.large_code = $scope.currentLargeType.large_code;
        }
        if ($scope.currentDistance) {
            para.query_distance = $scope.currentDistance.distance;
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
//    if($scope.currentSortType){
//      para.sort = $scope.currentSortType;
//    }
        // para.type = "YD";
        // para.discount_role = '00100000000000000000';
        // para.latitude = $cookieStore.get('latitude');
        // para.longitude = $cookieStore.get('longitude');
        //获取猜你喜欢列表
        API.getMoreRecommandStore(para).then(function (data) {
            var length1 = $scope.list.length;
            $scope.list = $scope.list.concat(data ? data : []);
            var length2 = $scope.list.length;
            if (length1 === length2) {
                $scope.loading = false;
                $scope.loadingMore = false;
            }
            $scope.mapStartIndex = 0;
            $scope.mapEndIndex = pageSize;
            $scope.mapCurrentPage = 0;
            if ((!$scope.list || $scope.list.length === 0)) {
                $scope.isEmpty = true;
                $scope.loading = false;
                $scope.mark = false;
            } else {
                // 解析商户图标
                for (var i = 0; i < $scope.list.length; i++) {
                    var stars = [];
                    for (var j = 0; j < 5; j++) {
                        if (j + 1 <= $scope.list[i].levels) {
                            stars[j] = {"type": "full"};
                        } else if (j - $scope.list[i].levels < 0) {
                            stars[j] = {"type": "half"};
                        } else {
                            stars[j] = {"type": "gray"};
                        }
                    }
                    $scope.list[i].stars = stars;
                    $scope.list[i].icons = API.resolveDiscountRole($scope.list[i].discount_role);
                    $scope.list[i].new_icons = [];
                    $scope.list[i].PRStyle = {paddingRight : $scope.list[i].icons.length * 18 + 'px'}; 
                    for (var z = 0; z < $scope.list[i].icons.length; z++) {
                        API.loopRoleIcons($scope, i, z);
                    }
                    $scope.list[i].new_icons = API.removeEmptyArrEleAndReverse($scope.list[i].new_icons);
                    $scope.list[i].bottomContent = '';
                    if ($scope.list[i].district_name1 && $scope.list[i].district_name1 !== '') {
                        $scope.list[i].bottomContent += $scope.list[i].district_name1;
                        $scope.list[i].bottomContent += '/';
                    }
                    if ($scope.list[i].district_name2 && $scope.list[i].district_name2 !== '') {
                        $scope.list[i].bottomContent += $scope.list[i].district_name2;
                        $scope.list[i].bottomContent += '/';
                    }
                    if ($scope.list[i].district_name3 && $scope.list[i].district_name3 !== '') {
                        $scope.list[i].bottomContent += $scope.list[i].district_name3;
                        $scope.list[i].bottomContent += '/';
                    }
                    $scope.list[i].bottomContent = $scope.list[i].bottomContent.substring(0, $scope.list[i].bottomContent.length - 1) + '  ';
                    if ($scope.list[i].small_name1 && $scope.list[i].small_name1 !== '') {
                        $scope.list[i].bottomContent += $scope.list[i].small_name1;
                        $scope.list[i].bottomContent += '/';
                    }
                    if ($scope.list[i].small_name2 && $scope.list[i].small_name2 !== '') {
                        $scope.list[i].bottomContent += $scope.list[i].small_name2;
                        $scope.list[i].bottomContent += '/';
                    }
                    if ($scope.list[i].small_name3 && $scope.list[i].small_name3 !== '') {
                        $scope.list[i].bottomContent += $scope.list[i].small_name3;
                        $scope.list[i].bottomContent += '/';
                    }
                    $scope.list[i].bottomContent = $scope.list[i].bottomContent.substring(0, $scope.list[i].bottomContent.length - 1);
                    $scope.list[i].showdistance = $scope.list[i].distance + $scope.list[i].unit;
                }
                // $scope.storeList = $scope.list;
                // if($scope.list === undefined || $scope.list.length === 0){
                //   $scope.isEmpty = true;
                // }
                if ($scope.mapFilter) {
                    $rootScope.updateMap($scope);

                }
                $scope.loading = false;
                $scope.mark = false;
                // console.log($scope.storeList);
            }
        }, function (data) {
            $scope.isEmpty = true;
            $scope.toast('请检查网络状况');
            $scope.list = [];
            $scope.loading = false;
            $scope.mark = false;
        });
    };
    // if($scope.currentType){
    //   para.large_code = $scope.currentType.big_code ;
    // }
    // if($scope.currentSmallType){
    //   para.small_code = $scope.currentSmallType.small_code;
    // }
    // if($scope.currentDistrict){
    //   para.district_code = $scope.currentDistrict.countryCode || $scope.currentDistrict.district_code;
    // }
    // 获取列表
    $scope.getList();
    var map = null;
    $scope.mapPreviousPage = function () {
        if ($scope.mapCurrentPage > 0) {
            $scope.mapCurrentPage--;
            $scope.updateIndex();
        }
    };
    $scope.mapNextPage = function () {
        console.log("hello");
        var page = Math.floor($scope.list.length / pageSize);
        if ($scope.list.length % pageSize !== 0) {
            page = page + 1;
        }
        console.log(page);
        if ($scope.mapCurrentPage < page) {
            $scope.mapCurrentPage++;
            $scope.updateIndex();
        }
    };
    $scope.updateIndex = function () {
        $scope.mapStartIndex = $scope.mapCurrentPage * pageSize;
        $scope.mapEndIndex = $scope.mapStartIndex + pageSize;
        $rootScope.updateMap($scope);

    };
    $scope.showLoading = function () {
        $scope.mark = true;
        //       console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    };
}]);