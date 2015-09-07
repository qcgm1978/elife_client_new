elife.controller('CategoryResultCtrl', ['$scope', '$cookieStore', '$routeParams', '$timeout', '$route', 'SharedState', 'API', '$rootScope', '$http', function ($scope, $cookieStore, $routeParams, $timeout, $route, SharedState, API, $rootScope, $http) {
    // 返回按钮
    // elife_app.SetReturnBtn();
    $scope.id = $routeParams.id;
    $scope.store_type = $routeParams.name;
    console.log($scope.store_type);
    $scope.loading = true;
    $scope.mark = false;
    $scope.isEmpty = false;
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
    var pageSize = 10;
    $scope.isMapModel = false;
    if (currentMode === "map") {
        $scope.mapFilter = true;
        $scope.isMapModel = true;
        $scope.currentMapPage = -1;
    }
    // $scope.currentDistrict
    //列表排序选项开关
    $scope.sideTab2 = 0;
    $scope.selectType = function (type) {
        $scope.currentType = type;
        console.log($scope.currentType);
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
    $scope.setPositionData = function () {
        $rootScope.assignSliderData($scope.position).then(function func(data) {
            $scope.position = data;
        });
    };
    $scope.storeFilter = function (icbc, discount, mapFilter) {
        console.log('food filter');
        if (mapFilter) {
            //地图筛选
            $cookieStore.put(KEY_STORE_FILTER_MODE, "map");
        } else {
            $scope.mapFilter = false;
            $cookieStore.remove(KEY_STORE_FILTER_MODE);
        }
        API.getFilterRoles($scope, icbc, discount);
        //if ($scope.position.min * 1 !== 0 && $scope.position.max * 1 !== 1000)
            $scope.avg_price = $scope.position.min + ',' + $scope.position.max;
        $scope.getList(0);
        // $cookieStore.put('storeFilterMode','');
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
        console.log('request by distance');
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
    //filter type
    $scope.filterByType = function (sType, large_name) {
        if (sType.small_name) {
            console.log(sType);
            $scope.currentSmallType = sType;
            $scope.currentLargeType = null;
            $cookieStore.remove(KEY_STORE_FILTER_TYPE);
            $cookieStore.remove(KEY_STORE_FILTER_BIG_TYPE);
            $cookieStore.put(KEY_STORE_FILTER_TYPE, sType);
            if(large_name) {
                $scope.store_type = large_name;
            }
        }
        else {
            console.log(sType);
            $scope.currentLargeType = sType;
            $scope.store_type = $scope.currentLargeType.large_name;
            $scope.currentSmallType = null;
            $cookieStore.remove(KEY_STORE_FILTER_BIG_TYPE);
            $cookieStore.remove(KEY_STORE_FILTER_TYPE);
            $cookieStore.put(KEY_STORE_FILTER_BIG_TYPE, sType);
        }
        $scope.getList(0);
        $scope.filterToggle(0);
    };
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
        console.log(data.data);
        console.log($scope.hotCitys);
        $scope.citys = data.data;
    }, function (data) {
        $scope.toast("请检查网络状况");
        console.error("商区获取失败：" + data);
    });
    API.getAllType({}).then(function (data) {
        $scope.allTypes = data;
        console.log("获取所有类型");
        console.log(data);
        // $scope.currentType = data[0];
        console.log($scope.currentType);
    }, function (data) {
        $scope.toast("请检查网络状况");
        console.error("全部分类获取失败：" + data);
    });
    $scope.list = [];
    $scope.e_row = 0;
    $scope.page_size = 9;
    $scope.getListCallback = function () {
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
        if ($scope.currentCityDistrict) {
            para.city_district_code = $scope.currentCityDistrict.district_code;
        }
        if ($scope.currentDistance) {
            para.query_distance = $scope.currentDistance.distance || $scope.currentDistance;
        }
        //judge small_code
        var largeCodeVar = $scope.currentLargeType;

        if ($scope.currentSmallType) {
            para.small_code = $scope.currentSmallType.small_code;
        }
        else if ($routeParams.isSecondType === '1') {
            para.small_code = $scope.id;
        } else  if (largeCodeVar) {
            para.large_code = largeCodeVar.large_code;
        }
        else {
            para.large_code = $scope.id;
        }
        if ($scope.currentDistrict) {
            para.district_code = $scope.currentDistrict.community_code;
        }
        if ($scope.order_key) {
            para.order_key = $scope.order_key;
        }
        para.discount_role = $scope.discount_role;
        if ($scope.avg_price)
            para.avg_price = $scope.avg_price;
        //todo test code
        //$http.get('../test/list.json').success(function (data) {
        //    $scope.list = $scope.list.concat(data ? data.data : null);
        //    $rootScope.updateMap($scope);
        //});
        //return;
        API.getStore(para).then(function (data) {
            $scope.loading = false;
            if ($scope.load_timer) {
                $timeout.cancel($scope.load_timer);
            }
            var length1 = $scope.list.length;
            $scope.list = $scope.list.concat(data ? data : null);
            var length2 = $scope.list.length;
            $scope.mapStartIndex = 0;
            $scope.mapEndIndex = pageSize;

            if (length1 === length2) {
                $scope.loadingMore = false;
            }
            $scope.e_row = $scope.list.length;
            console.log("所有商户:");
            console.log(data);
            if (!$scope.list || $scope.list.length === 0) {
                $scope.mark = false;
                $scope.isEmpty = true;
            }
            else {
                for (var i = 0; i < $scope.list.length; i++) {
                    var stars = [];
                    var listItem = $scope.list[i];
                    for (var j = 0; j < 5; j++) {
                        if (j + 1 <= listItem.levels) {
                            stars[j] = {"type": "full"};
                        } else if (j - listItem.levels < 0) {
                            stars[j] = {"type": "half"};
                        } else {
                            stars[j] = {"type": "gray"};
                        }
                    }
                    listItem.stars = stars;
                    listItem.distance /= 1000;
                    listItem.distance = listItem.distance.toFixed(1);
                    API.getOrderingIcons(listItem, API, $scope, i);
                    listItem.bottomContent = '';
                    if (listItem.district_name1 && listItem.district_name1 !== '') {
                        listItem.bottomContent += listItem.district_name1;
                        listItem.bottomContent += '/';
                    }
                    if (listItem.district_name2 && listItem.district_name2 !== '') {
                        listItem.bottomContent += listItem.district_name2;
                        listItem.bottomContent += '/';
                    }
                    if (listItem.district_name3 && listItem.district_name3 !== '') {
                        listItem.bottomContent += listItem.district_name3;
                        listItem.bottomContent += '/';
                    }
                    if (listItem.small_name1 && listItem.small_name1 !== '') {
                        listItem.bottomContent += listItem.small_name1;
                        listItem.bottomContent += '/';
                    }
                    if (listItem.small_name2 && listItem.small_name2 !== '') {
                        listItem.bottomContent += listItem.small_name2;
                        listItem.bottomContent += '/';
                    }
                    if (listItem.small_name3 && listItem.small_name3 !== '') {
                        listItem.bottomContent += listItem.small_name3;
                        listItem.bottomContent += '/';
                    }
                    listItem.bottomContent = listItem.bottomContent.substring(0, listItem.bottomContent.length - 1);
                }
                console.log($scope.list);
                if ($cookieStore.get(KEY_STORE_FILTER_MODE) === 'map') {
                    $rootScope.updateMap($scope);
                }
                $scope.load_timer = $timeout(function () {
                    $scope.mark = false;
                }, 1000);
            }
        }, function (data) {
            $scope.loading = false;
            $scope.toast("请检查网络状况");
            $scope.isEmpty = true;
            $scope.mark = false;
            console.error("列表获取失败：" + data);
        });
    };
    $scope.getList = function () {
        this.getListCallback();
    };
    // home_category.js
    $scope.getList();
    var map = null;
    $scope.mapCurrentPage = 0;

    $scope.mapPreviousPage = function () {
        if ($scope.mapCurrentPage > 0) {
            $scope.mapCurrentPage--;
            $scope.updateIndex();
        }
    };
    $scope.mapNextPage = function () {
        console.log("point change");
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
        $scope.loadingMore = true;
    };
    $scope.removeAllCookies = function () {
        $cookieStore.remove(KEY_STORE_FILTER_MODE);
        $cookieStore.remove(KEY_STORE_FILTER_DISTANCE);
        $cookieStore.remove(KEY_STORE_FILTER_DISTRICT);
        $cookieStore.remove(KEY_STORE_FILTER_CITY_DISTRICT);
        $cookieStore.remove(KEY_STORE_FILTER_TYPE);
        $cookieStore.remove(KEY_STORE_FILTER_BIG_TYPE);
        $cookieStore.remove(KEY_STORE_ORDER_KEY);
        $cookieStore.remove(KEY_STORE_ORDER_NAME);
        if (ICBCUtil.isElifeIos() || ICBCUtil.isElifeAndroid()) {
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
        else {
            window.history.back();
        }
    };
}]);