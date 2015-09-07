elife.controller('MyFavoritesCtrl', ['$scope', '$http', '$cookieStore', '$timeout', 'SharedState', 'API', '$rootScope', function ($scope, $http, $cookieStore, $timeout, SharedState, API, $rootScope) {
    elife_app.SetReturnBtn();
    if (ICBCUtil.isElifeIos()) {
        ICBCUtil.nativeGetConfig({
            'key': 'tabbarhidden',
            'callBack': ''
        });
    }
    //是否点击顶部商户删除
    $scope.favor_delete = false;
    $scope.discount_delete = false;
    $scope.store_show = false;
    //商户选择
    $scope.favor_select = [];
    //优惠选择
    $scope.discount_select = [];
    $scope.typetop = null;
    $scope.store_erow = 0;
    $scope.discount_erow = 0;
    $scope.page_size = 9;
    $scope.FavBusinesses = [];
    //是否点击底部删除按钮
    $scope.delete_btn = false;
    console.log("商户、优惠");
    console.log($rootScope.showDelete);
    $rootScope.showDelete = $rootScope.showDelete === false ? $rootScope.showDelete : true;
    console.log($rootScope.showDelete);
    $scope.imgBaseUrl = $rootScope.imgBaseUrl;
    for (var i = 0; i < 5; i++) {
        $scope.favor_select[i] = false;
        $scope.discount_select[i] = false;
    }
    $scope.goback = function () {
        $rootScope.showDelete = true;
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
    //获取地区及类别列表
    // API.getFavCityList({
    // }).then(function(data){
    //   $scope.cityList = data.districtlist;
    //   console.log('获取地区列表成功');
    //   console.log($scope.cityList);
    //   $scope.typeList = data.industrylist;
    //   console.log('获取类别列表成功');
    //   console.log($scope.typeList);
    // },function(data){
    //   $scope.toast("请检查网络状况");
    //   console.error("银行优惠详情获取失败：" + data);
    // });
    var tK = $cookieStore.get('t_k');
    var cNo = $cookieStore.get('c_no');
    $http.post($scope.baseUrl + '/OFSTCUST/cusinfoFav/showCity.action',
        {
            't_k': tK,
            'c_no': cNo
        }).success(function (result) {
            if (result.res === '2000001') {
                $scope.toast('程序错误')
                return;
            }
            $scope.cityList = result.data.districtlist;
            $scope.tempCityName = result.data.districtlist[0].city_name;
            $scope.industryList = result.data.industrylist;
            $scope.tempName = result.data.industrylist[0].large_name;
            $scope.tempCode = result.data.industrylist[0].large_code;
            //$scope.typetop = result.data.industrylist[0].large_name;
            console.log($scope.industryList);
        });
    // $scope.showSub = function(e){console.log(e);$scope.ui=e+1;$scope.subList=$scope.cityList[e-1].list;};
    $scope.sideTabToggle1 = function (n, name, code) {
        $scope.tempName = name;
        $scope.tempCode = code;
        $scope.stype = name;
        SharedState.set({sideTab1: n + 1});
    };
    $scope.sideTabToggle2 = function (n, name, code) {
        $scope.tempCityName = name;
        $scope.tempCityCode = code;
        SharedState.set({sideTab2: n + 1});
    };
    // 按底部删除商户按钮方法
    $scope.openModal = function () {
        if ($rootScope.showDelete) {
            if (!angular.element(document.getElementsByClassName("delete_item")).length) {
                SharedState.turnOn('favor_del_error_modal');
            }
            else {
                SharedState.turnOn('favor_del_modal');
            }
        }
        else {
            if (!angular.element(document.getElementsByClassName("delete_discount_item")).length) {
                SharedState.turnOn('favor_del_error_modal');
            }
            else {
                SharedState.turnOn('favor_del_modal');
            }
        }
    };
    //取消按钮
    $scope.deleteFavorCancel = function () {
        $scope.favor_delete = false;
    };
    $scope.deleteDiscountCancel = function () {
        $scope.discount_delete = false;
    };
    // 弹窗删除按钮方法
    $scope.delete = function () {
        if ($rootScope.showDelete) {
            console.log('删除商户收藏');
            var delete_ele = document.getElementsByClassName("delete_item");
            var para = "";
            for (var i = 0; i < delete_ele.length; i++) {
                para = para + delete_ele[i].getAttribute("id") + ',';
            }
            console.log(para);
            API.deleteBusinessFavor({
                store_codes: para
            }).then(function (data) {
                console.log(data);
                if (data.res === "0") {
                    $scope.toast("删除成功");
                    angular.element(document.getElementsByClassName("delete_item")).remove();
                }
            }, function (data) {
                console.log('商户ICBC失败');
                $scope.toast("请检查网络状况");
            });
        }
        else {
            angular.element(document.getElementsByClassName("delete_discount_item")).remove();
        }
    };
    // 按顶部删除商户按钮初始化
    $scope.deleteFavorIni = function () {
        $scope.favor_delete = true;
        for (i = 0; i < 5; i++) {
            $scope.favor_select[i] = false;
        }
    };
    // 按顶部删除优惠按钮初始化
    $scope.deleteDiscountIni = function () {
        $scope.discount_delete = true;
        for (i = 0; i < 5; i++) {
            $scope.discount_select[i] = false;
        }
    };
    //删除优惠收藏
    $scope.paramArry = [];
    $scope.doPush = function (code, type, flag) {
        var param = {
            "code": code,
            "type": type
        };
        if (flag) {
            $scope.paramArry.push(param);
        } else {
            for (var i = 0; i < $scope.paramArry.length; i++) {
                if ($scope.paramArry[i].code === param.code) {
                    $scope.paramArry.splice(i, 1);
                }
            }
        }
        console.log($scope.paramArry);
    };
    $scope.deleteAction = function (store_codes) {
        $http.post($scope.baseUrl + '/OFSTCUST/disFav/deleteMyFavorite.action',
            {
                't_k': $cookieStore.get('t_k'),
                'c_no': $cookieStore.get('c_no'),
                'store_codes': store_codes
            }).success(function (result) {
                console.log(result.res);
                if (result.res == "0") {
                    $scope.paramArry = [];
                    $scope.favor_select = [];
                    $scope.listPadding = false;
                    $scope.discount_delete = false;
                    $scope.getFavDiscount();
                    console.log("删除成功...");
                }
            });
    };
    $scope.del = function () {
        if ($scope.temp === "1") {
            $scope.doDelete1();
        } else if ($scope.temp === "2") {
            $scope.doDelete();
        }
    };
    $scope.preDelete = function (no) {
        $scope.temp = no;
        if (no === "1") {
            console.log($scope.paramArry1);
            if ($scope.paramArry1 && $scope.paramArry1.length > 0) {
                SharedState.turnOn('favor_del_modal');
            } else {
                SharedState.turnOn('favor_del_error_modal');
            }
        } else {
            if ($scope.paramArry && $scope.paramArry.length > 0) {
                SharedState.turnOn('favor_del_modal');
            } else {
                SharedState.turnOn('favor_del_error_modal');
            }
        }
    };
    $scope.doDelete = function () {
        $scope.storeCode = "";
        if ($scope.paramArry.length < 1) {
            $scope.toast("您尚未选中要删除的对象!");
            return;
        } else if ($scope.paramArry.length == 1) {
            $scope.storeCode = $scope.paramArry[0].code + "#" + $scope.paramArry[0].type;
        } else {
            var paramStr = "";
            for (var i = 0; i < $scope.paramArry.length; i++) {
                var paramString = $scope.paramArry[i].code + "#" + $scope.paramArry[i].type + ",";
                //console.log(paramString);
                paramStr = paramString + paramStr;
                //console.log(paramStr);
            }
            $scope.storeCode = paramStr.substring(0, paramStr.length - 1);
        }
        console.log($scope.storeCode);
        $scope.deleteAction($scope.storeCode);
    };
//删除商户收藏
    $scope.paramArry1 = [];
    $scope.doPush1 = function (code, flag) {
        var param = {
            "code": code
        };
        if (flag) {
            $scope.paramArry1.push(param);
        } else {
            for (var i = 0; i < $scope.paramArry1.length; i++) {
                if ($scope.paramArry1[i].code === param.code) {
                    $scope.paramArry1.splice(i, 1);
                }
            }
        }
        console.log($scope.paramArry1);
    };
    $scope.deleteAction1 = function (store_codes) {
        $http.post($scope.baseUrl + '/OFSTCUST/storeFav/deleteMyFavorite.action',
            {
                't_k': $cookieStore.get('t_k'),
                'c_no': $cookieStore.get('c_no'),
                'store_codes': store_codes
            }).success(function (result) {
                console.log(result.res);
                if (result.res == "0") {
                    $scope.paramArry1 = [];
                    $scope.favor_select = [];
                    $scope.listPadding = false;
                    $scope.discount_delete = false;
                    $scope.store_erow = 0;
                    $scope.FavBusinesses = [];
                    $scope.searchMyFavorite({});
                    console.log("删除成功...");
                }
            });
    };
    $scope.doDelete1 = function () {
        $scope.storeCode = "";
        if ($scope.paramArry1.length < 1) {
            $scope.toast("您尚未选中要删除的对象!");
            return;
        } else if ($scope.paramArry1.length == 1) {
            $scope.favor_delete = false;
            $scope.storeCode = $scope.paramArry1[0].code;
        } else {
            $scope.favor_delete = false;
            var paramStr = "";
            for (var i = 0; i < $scope.paramArry1.length; i++) {
                var paramString = $scope.paramArry1[i].code + ",";
                //console.log(paramString);
                paramStr = paramString + paramStr;
                //console.log(paramStr);
            }
            $scope.storeCode = paramStr.substring(0, paramStr.length - 1);
        }
        console.log($scope.storeCode);
        $scope.deleteAction1($scope.storeCode);
    };
    $scope.getFavBusiness = function () {


        //2015-05-09
        //TODO
        // 获取商户收藏
        $scope.discount_srow = $scope.discount_erow + 1;
        $scope.discount_erow = $scope.discount_srow + $scope.page_size;
        var para = {
            // small_code : '01003',
            // district_code : 'a6d80d6bd2c34c438f371f23a81cce0b',
            s_row: $scope.discount_srow,
            e_row: $scope.discount_erow,
            order_key: 1
        };
        API.getBusinessFavor(para).then(function (data) {
            console.log('收藏商户列表');
            console.log(data);
            if (data.res * 1 !== 0) {
                $rootScope.toast("请检查网络状况");
                return;
            }
            $scope.FavBusinesses = data.data;
            $scope.isShowStore = false;
            if (data.data) {
                if (data.data.length > 0) {
                    $scope.isShowStore = true;
                }
                $scope.store_erow = data.data.length;
                if (data.data && data.data.length > 0) $scope.store_show = false;
                else $scope.store_show = true;
                $scope.list = $scope.FavBusinesses;
                for (var i = 0; i < $scope.list.length; i++) {
                    // $scope.FavBusinesses[i].discount_role =  API.resolveDiscountRole($scope.FavBusinesses[i].discount_role);
                    //  $scope.FavBusinesses[i].new_discount_role=[];
                    //  for(var z=0;z<$scope.FavBusinesses[i].discount_role.length;z++){
                    //     if($scope.FavBusinesses[i].discount_role[z]===' icon_yi'){
                    //           $scope.FavBusinesses[i].new_discount_role.push(' icon_yi');
                    //     }
                    //      if($scope.FavBusinesses[i].discount_role[z]===' icon_fen'){
                    //           $scope.FavBusinesses[i].new_discount_role.push(' icon_fen');
                    //     }
                    //      if($scope.FavBusinesses[i].discount_role[z]===' icon_shan'){
                    //           $scope.FavBusinesses[i].new_discount_role.push(' icon_shan');
                    //     }
                    //      if($scope.FavBusinesses[i].discount_role[z]===' icon_ji'){
                    //           $scope.FavBusinesses[i].new_discount_role.push(' icon_ji');
                    //     }
                    //  }
                    var listItem = $scope.list[i];
                    API.getOrderingIcons(listItem, API, $scope, i);
                    var stars = [];
                    for (var j = 0; j < 5; j++) {
                        if (j + 1 <= $scope.FavBusinesses[i].level) {
                            stars[j] = {"type": "full"};
                        } else if (j - $scope.FavBusinesses[i].level < 0) {
                            stars[j] = {"type": "half"};
                        } else {
                            stars[j] = {"type": "gray"};
                        }
                    }
                    $scope.FavBusinesses[i].level = stars;
                    $scope.FavBusinesses[i].bottomContent = '';
                    if (($scope.FavBusinesses[i].bottomContent.length <= 18) && $scope.FavBusinesses[i].business_name1 && $scope.FavBusinesses[i].business_name1 !== '') {
                        $scope.FavBusinesses[i].bottomContent += $scope.FavBusinesses[i].business_name1;
                        $scope.FavBusinesses[i].bottomContent += '/';
                    }
                    if (($scope.FavBusinesses[i].bottomContent.length <= 18) && $scope.FavBusinesses[i].business_name2 && $scope.FavBusinesses[i].business_name2 !== '') {
                        $scope.FavBusinesses[i].bottomContent += $scope.FavBusinesses[i].business_name2;
                        $scope.FavBusinesses[i].bottomContent += '/';
                    }
                    if (($scope.FavBusinesses[i].bottomContent.length <= 18) && $scope.FavBusinesses[i].business_name3 && $scope.FavBusinesses[i].business_name3 !== '') {
                        $scope.FavBusinesses[i].bottomContent += $scope.FavBusinesses[i].business_name3;
                        $scope.FavBusinesses[i].bottomContent += '/';
                    }
                    $scope.FavBusinesses[i].bottomContent = $scope.FavBusinesses[i].bottomContent.substring(0, $scope.FavBusinesses[i].bottomContent.length - 1) + ' ';
                    if (($scope.FavBusinesses[i].bottomContent.length <= 18) && $scope.FavBusinesses[i].small_name1 && $scope.FavBusinesses[i].small_name1 !== '') {
                        $scope.FavBusinesses[i].bottomContent += $scope.FavBusinesses[i].small_name1;
                        $scope.FavBusinesses[i].bottomContent += '/';
                    }
                    if (($scope.FavBusinesses[i].bottomContent.length <= 18) && $scope.FavBusinesses[i].small_name2 && $scope.FavBusinesses[i].small_name2 !== '') {
                        $scope.FavBusinesses[i].bottomContent += $scope.FavBusinesses[i].small_name2;
                        $scope.FavBusinesses[i].bottomContent += '/';
                    }
                    if (($scope.FavBusinesses[i].bottomContent.length <= 18) && $scope.FavBusinesses[i].small_name3 && $scope.FavBusinesses[i].small_name3 !== '') {
                        $scope.FavBusinesses[i].bottomContent += $scope.FavBusinesses[i].small_name3;
                        $scope.FavBusinesses[i].bottomContent += '/';
                    }
                    $scope.FavBusinesses[i].bottomContent = $scope.FavBusinesses[i].bottomContent.substring(0, $scope.FavBusinesses[i].bottomContent.length - 1);
                    $scope.FavBusinesses[i].showdistance = $scope.FavBusinesses[i].distance + $scope.FavBusinesses[i].unit || '0.0m';
                }
            }
            $scope.noThingTemp = false;
        }, function (data) {
            $scope.loading = false;
            $scope.mark = false;
            console.log('获取收藏商户失败');
            $rootScope.toast("请检查网络状况");
        });
    };
    $scope.getFavBusinessByConditions = function (keyword) {
        //2015-05-09
        //TODO
        // 通过级联条件获取商户收藏
        $http.post($scope.baseUrl + '/OFSTCUST/cuinfo/findCuMoreById.action', {
            't_k': $cookieStore.get('t_k'),
            'c_no': $cookieStore.get('c_no'),
            'small_code': '',
            'district_code': '',
            'sort_code': ''
        })
            .success(function (data) {
                var info = data;
                $scope.isShowStore = false;
                if (data) {
                    if (data.length > 0) {
                        $scope.isShowStore = true;
                    }
                    for (var i = 0; i < info.length; i++) {
                        var stars = [];
                        var icon_flags = [];
                        for (var j = 0; j < 5; j++) {
                            if (j + 1 <= info[i].dcmt_level) {
                                stars[j] = {"type": "full"};
                            } else if (j - info[i].dcmt_level < 0) {
                                stars[j] = {"type": "half"};
                            } else {
                                stars[j] = {"type": "gray"};
                            }
                            icon_flags[0] = info[i].is_yd == "0" ? "none" : "yi";
                            icon_flags[1] = info[i].is_fq == "0" ? "none" : "fen";
                            icon_flags[2] = info[i].is_jf == "0" ? "none" : "ji";
                            icon_flags[3] = info[i].is_sk == "0" ? "none" : "shan";
                            icon_flags[4] = info[i].is_gh == "0" ? "none" : "gong";
                            icon_flags[5] = info[i].is_tu == "0" ? "none" : "tuan";
                            icon_flags[6] = info[i].is_cx == "0" ? "none" : "cu";
                            icon_flags[7] = info[i].is_ka == "0" ? "none" : "ka";
                        }
                        info[i].stars = stars;
                        info[i].flags = icon_flags;
                    }
                }
                console.log(info);
                // $scope.FavBusinesses = info;
            });
    };
    $scope.getFavDiscount = function () {
        console.log("优惠收藏");
        //2015-05-10
        //TODO
        // 获取优惠收藏
        $http.post($scope.baseUrl + '/OFSTCUST/disFav/SelectFdis.action', {
            't_k': $cookieStore.get('t_k'),
            'c_no': $cookieStore.get('c_no'),
        })
            .success(function (result) {
                console.log("优惠收藏");
                console.log(result);
                $scope.disList = result.data;
                $scope.isShowDiscount = false;
                var getUrl = function (type) {
                    var code = result.data[i].pft_code;
                    return type === '3' ? '#/discount/customers/' +
                    code : '#/discount/card_offer/' + code + '/bank';
                };
                if ($scope.disList) {
                    if ($scope.disList.length > 0) {
                        $scope.isShowDiscount = true;
                    }
                    for (var i = 0, length = result.data.length; i < length; i++) {
                        var favoriteType = result.data[i].favorite_type;
                        $scope.disList[i].favorite_url = favoriteType === '1' ? '#/discount/business_offer/' + result.data[i].store_code + '/' + result.data[i].pft_code + '/store' : getUrl(favoriteType);
                    }
                    $scope.noThing = $scope.disList.length === 0 ? true : false;
                    $scope.noThingTemp = true;
                    console.log($scope.disList);
                }
            });
    };
    $scope.getStore = function () {
        $rootScope.showDelete = true;
    };
    $scope.getDiscount = function () {
        $rootScope.showDelete = false;
    };
    if (!$rootScope.showDelete) {
        $scope.getFavDiscount();
    }
    $scope.getFavBusiness();
    $scope.getFavDiscount();
    $scope.backToMy = function () {
        $rootScope.showDelete = true;
        history.back();
    };
    var lastOrderKey = '';
    var lastSmallCode = '';
    var lastLargeCode = '';
    var lastDistrictCode = '';
    var lastCityCode = "";
    $scope.searchFavoriteStore = function (para) {
        $scope.FavBusinesses = [];
        $scope.store_erow = 0;
        $scope.searchMyFavorite(para);
    };
    // 条件搜索
    $scope.searchMyFavorite = function (para) {
        SharedState.set({listFilter: false});
        console.log(para);
        $scope.loading = true;
        $scope.mark = true;
        $scope.notip = false;
        lastOrderKey = para.order_key || lastOrderKey;
        if (para.large_code === "") {
            lastLargeCode = "";
        } else {
            lastLargeCode = para.large_code || lastLargeCode;
        }
        if (para.small_code === "") {
            lastSmallCode = "";
        } else {
            lastSmallCode = para.small_code || lastSmallCode;
        }
        if (para.district_code === "") {
            lastDistrictCode = "";
        } else {
            lastDistrictCode = para.district_code || lastDistrictCode;
        }
        if (para.city_code === "") {
            lastCityCode = "";
        } else {
            lastCityCode = para.city_code || lastCityCode;
        }
        $scope.store_srow = $scope.store_erow + 1;
        $scope.store_erow = $scope.store_srow + $scope.page_size;
        var tK = $cookieStore.get('t_k');
        var cNo = $cookieStore.get('c_no');
        var basePara = {
            't_k': tK,
            'c_no': cNo,
            's_row': $scope.store_srow,
            'e_row': $scope.store_erow,
            'order_key': lastOrderKey || 1
        };
        if (para.keyword) {
            basePara.keyword = para.keyword;
        }
        if (lastSmallCode) {
            basePara.small_code = lastSmallCode;
        }
        if (lastLargeCode) {
            basePara.large_code = lastLargeCode;
        }
        if (lastDistrictCode) {
            basePara.district_code = lastDistrictCode;
        }
        if (lastCityCode) {
            basePara.city_code = lastCityCode;
        }
        $http.post($scope.baseUrl + '/OFSTCUST/storeFav/selectMyFavorite.action', basePara)
            .success(function (data) {
                console.log(data);
                if (data.res * 1 !== 0) {
                    $rootScope.toast("请检查网络状况");
                    return;
                }
                if ($scope.load_timer) {
                    $timeout.cancel($scope.load_timer);
                }
                if (data.data && data.data.length === 0) {
                    $scope.loadingMore = false;
                }
                console.log($scope.FavBusinesses);
                $scope.FavBusinesses = $scope.FavBusinesses.concat(data.data ? data.data : null);
                $scope.store_erow = $scope.FavBusinesses.length;
                if ($scope.FavBusinesses && $scope.FavBusinesses.length > 0) $scope.store_show = false;
                else $scope.store_show = true;
                $scope.list = $scope.FavBusinesses;
                if (data.data) {
                    for (var i = 0; i < $scope.FavBusinesses.length; i++) {
                        // $scope.FavBusinesses[i].discount_role =  API.resolveDiscountRole($scope.FavBusinesses[i].discount_role);
                        var stars = [];
                        for (var j = 0; j < 5; j++) {
                            if (j + 1 <= $scope.FavBusinesses[i].level) {
                                stars[j] = {"type": "full"};
                            } else if (j - $scope.FavBusinesses[i].level < 0) {
                                stars[j] = {"type": "half"};
                            } else {
                                stars[j] = {"type": "gray"};
                            }
                        }
                        $scope.FavBusinesses[i].level = stars;
                        var listItem = $scope.list[i];
                        API.getOrderingIcons(listItem, API, $scope, i);
                        $scope.FavBusinesses[i].bottomContent = '';
                        if (($scope.FavBusinesses[i].bottomContent.length <= 18) && $scope.FavBusinesses[i].business_name1 && $scope.FavBusinesses[i].business_name1 !== '') {
                            $scope.FavBusinesses[i].bottomContent += $scope.FavBusinesses[i].business_name1;
                            $scope.FavBusinesses[i].bottomContent += '/';
                        }
                        if (($scope.FavBusinesses[i].bottomContent.length <= 18) && $scope.FavBusinesses[i].business_name2 && $scope.FavBusinesses[i].business_name2 !== '') {
                            $scope.FavBusinesses[i].bottomContent += $scope.FavBusinesses[i].business_name2;
                            $scope.FavBusinesses[i].bottomContent += '/';
                        }
                        if (($scope.FavBusinesses[i].bottomContent.length <= 18) && $scope.FavBusinesses[i].business_name3 && $scope.FavBusinesses[i].business_name3 !== '') {
                            $scope.FavBusinesses[i].bottomContent += $scope.FavBusinesses[i].business_name3;
                            $scope.FavBusinesses[i].bottomContent += '/';
                        }
                        $scope.FavBusinesses[i].bottomContent = $scope.FavBusinesses[i].bottomContent.substring(0, $scope.FavBusinesses[i].bottomContent.length - 1) + ' ';
                        if (($scope.FavBusinesses[i].bottomContent.length <= 18) && $scope.FavBusinesses[i].small_name1 && $scope.FavBusinesses[i].small_name1 !== '') {
                            $scope.FavBusinesses[i].bottomContent += $scope.FavBusinesses[i].small_name1;
                            $scope.FavBusinesses[i].bottomContent += '/';
                        }
                        if (($scope.FavBusinesses[i].bottomContent.length <= 18) && $scope.FavBusinesses[i].small_name2 && $scope.FavBusinesses[i].small_name2 !== '') {
                            $scope.FavBusinesses[i].bottomContent += $scope.FavBusinesses[i].small_name2;
                            $scope.FavBusinesses[i].bottomContent += '/';
                        }
                        if (($scope.FavBusinesses[i].bottomContent.length <= 18) && $scope.FavBusinesses[i].small_name3 && $scope.FavBusinesses[i].small_name3 !== '') {
                            $scope.FavBusinesses[i].bottomContent += $scope.FavBusinesses[i].small_name3;
                            $scope.FavBusinesses[i].bottomContent += '/';
                        }
                        $scope.FavBusinesses[i].bottomContent = $scope.FavBusinesses[i].bottomContent.substring(0, $scope.FavBusinesses[i].bottomContent.length - 1);
                        $scope.FavBusinesses[i].showdistance = $scope.FavBusinesses[i].distance + $scope.FavBusinesses[i].unit;
                    }
                }
                $scope.noThingTemp = false;
                $scope.loading = false;
                $scope.load_timer = $timeout(function () {
                    $scope.mark = false;
                }, 1000);
            })
            .error(function (data) {
                $scope.loading = false;
                $scope.mark = false;
                console.error('搜索失败！');
            });
    };
    $scope.doSearch = function (value) {
        $scope.store_erow = 0;
        $scope.searchFavoriteStore({'keyword': value});
        return false;
    };
    $scope.setType = function (tp) {
        $scope.typetop = tp;
    };
    $scope.setCity = function (city) {
        $scope.citytop = city;
    };
    $scope.setSort = function (sort) {
        $scope.sorttop = sort;
    };
    $scope.showLoading = function () {
        $scope.mark = true;
        $scope.loadingMore = true;
    };
    //点击回车，提交搜索,homepage
    $scope.keypress = function ($e, searchValue) {
        console.log($e.keyCode);
        if ($e.keyCode === 13 && searchValue) {
            $scope.deleteFavorCancel();
            $scope.listPadding = false;
            $scope.searchFavoriteStore({'keyword': searchValue});
        }
    };
}]);