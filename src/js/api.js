elife.factory('API', ['$rootScope', '$http', '$q', '$cookieStore', '$interval', '$timeout', function ($rootScope, $http, $q, $cookieStore, $interval, $timeout) {

    // var baseUrl = 'http://192.168.2.213:8080',
    //var baseUrl = 'http://82.201.189.177:9082',
    // todo 志攀ip
    var baseUrl = 'http://82.200.109.131:8080',

    // CC 生产环境
    // var baseUrl = 'http://elife.icbc.com.cn',
    // var baseUrl = 'http://82.200.109.86:8080',
    // var baseUrl = 'http://82.201.189.85:9082',
        currentUser,
        token,
        c_no,   // 2015.07.10 金春国 取消默认渠道号AA
        city = {
            // code: 10020,
            // name: 城市
        },
        api = {
            baseUrl: baseUrl,
        };
    // 全局变量存储
    $rootScope.mapStartIndex = 0;
    $rootScope.mapEndIndex = 10;
    $rootScope.emulationGeoData = {
        lng: 116.5365445,
        lat: 39.94452845
    };
    $rootScope.imgBaseUrl = baseUrl + "/OFSTCUST/base/getImg.action?image_url=";
    $rootScope.baseUrl = baseUrl;
    $rootScope.defaultImgUrl = "images/e-life-default.png";
    $rootScope.defaultStoreImgUrl = "images/default_shop_image.jpg";
    var KEY_STORE_FILTER_DISTRICT = "storeDistrict";
    var KEY_STORE_FILTER_CITY_DISTRICT = "storeCityDistrict";
    var KEY_STORE_FILTER_MODE = "storeFilterMode";
    var KEY_STORE_ORDER_NAME = "storeOrderName";
    var KEY_STORE_ORDER_KEY = "storeOrderKey";
    var KEY_STORE_FILTER_DISTANCE = "storeFilterDistance";
    var KEY_STORE_FILTER_TYPE = "storeFilterType";
    var KEY_STORE_FILTER_BIG_TYPE = "storeFIlterBigType";
    var KEY_STORE_SEARCH_KEYNAME = "keyname";
    $rootScope.removeAllCookies = function () {
        $cookieStore.remove(KEY_STORE_FILTER_MODE);
        $cookieStore.remove(KEY_STORE_FILTER_DISTANCE);
        $cookieStore.remove(KEY_STORE_FILTER_DISTRICT);
        $cookieStore.remove(KEY_STORE_FILTER_CITY_DISTRICT);
        $cookieStore.remove(KEY_STORE_FILTER_TYPE);
        $cookieStore.remove(KEY_STORE_FILTER_BIG_TYPE);
        $cookieStore.remove(KEY_STORE_ORDER_KEY);
        $cookieStore.remove(KEY_STORE_ORDER_NAME);
        $cookieStore.remove(KEY_STORE_SEARCH_KEYNAME);
    };
    $rootScope.assignSliderData = function (position) {
        return ($q(function (resolve, reject) {
            if (position instanceof Object) {
                reject();
            }
            $timeout(function () {
                resolve({
                    min: 0,
                    max: 1000
                });
            });
        }));
    };
    $rootScope.updateMap = function ($scope) {
        if (!map.clearOverlays) {
            map = new BMap.Map("map");
        }
        map.clearOverlays();
        // 创建地图实例
        var point = new BMap.Point($cookieStore.get('longitude'), $cookieStore.get('latitude'));  // 创建点坐标
        var isZoom = true;
        $scope.list.slice($scope.mapStartIndex, $scope.mapEndIndex).forEach(function (store) {
            var point = new BMap.Point(store.longitude, store.latitude);
            if (store.longitude > 39 && isZoom) {
                map.centerAndZoom(point, 12);
                isZoom = false;
            }
            var marker = new BMap.Marker(point);
            map.addOverlay(marker);
        });
    };
    // 分享接口通用
    $rootScope.share = function (para) {
        if (!elife.shareBtnClicked) {
            elife.shareBtnClicked = true;
            $rootScope.toast("正在获取数据...", 500);
            var shareInfo = {};
            api.getShare(para).then(function (data) {
                shareInfo = {
                    PNGUrl: data.shareImageUrl,
                    ShareUrl: data.shareLink,
                    Title: data.shareTitle,
                    Content: data.shareContent,
                    UseChannel: 1,
                    backCallUrl: data.backCallUrl,
                    pkOfstTwShare: data.pkOfstTwShare,
                    shareCode: data.shareCode
                };
                shareInfo = JSON.stringify(shareInfo);
                if (ICBCUtil.isElifeAndroid() || ICBCUtil.isAndroid()) {
                    elife_app.GetNativeFunctionAndroid({
                        'keyword': 'getShare', 'shareInfo': api.base64.encode(shareInfo)
                    });
                }
                if (ICBCUtil.isElifeIos() || ICBCUtil.isIPhone()) {
                    ICBCUtil.nativeGetConfig({
                        'key': 'getShare',
                        'callBack': "",
                        'dataString': api.base64.encode(shareInfo)
                    });
                }
                elife.shareBtnClicked = false;
            }, function (data) {
                console.error('获取分享信息失败！');
            });
        } else {
            return false;
        }
    };
    var ready = $q.defer();
    (function () {
        // 获取ua判断平台
        var ua = window.navigator.userAgent,
            os = (function () {
                if (/(iPhone|iPod|iPad|iOS)/i.test(ua)) {
                    return 'ios';
                } else if (/Android/i.test(ua)) {
                    return 'android';
                } else {
                    return 'other';
                }
            })();
        // 获取令牌
        var t_k = $cookieStore.get('t_k'),
            c_no = 'AA';
        // 设置总体配置对象
        api.elifeConf = {
            // 判断平台
            os: os,
            t_k: t_k,
            c_no: c_no,
            remoteHost: baseUrl
        };
        /* 2015.7.10 金春国 取消默认登陆
         // 尝试登录
         var loginPromise = request(
         baseUrl + '/OFSTCUST/cuinfo/login.action',
         'post',
         {
         'userId': '100001',
         'c_no': 'AA'
         }
         );
         console.log(loginPromise);
        
         loginPromise.then(function (data) {
         console.log('登入信息');
         console.log(data);
         token = data.t_k;
         if (!$cookieStore.get('city_code') || !$cookieStore.get('city_name')) {
         $cookieStore.put('city_code', '110100');
         $cookieStore.put('city_name', '北京');
         }
         $cookieStore.put('t_k', data.t_k);
         $cookieStore.put('c_no', 'AA');
         $cookieStore.put('cn_code', 'CN');
         $cookieStore.put('country_code', 'CN');
         $cookieStore.put('longitude', '116.372298');
         $cookieStore.put('latitude', '39.914476');
         ready.resolve();
         }, function (data) {
         console.info('login failed with code:' + data);
         ready.resolve();
         });
         */
    })();
    // 中文字符按两个算，一共的字符数
    api.cal = function (str) {
        re = /[\u4E00-\u9FA5]/g;  // 测试中文字符的正则
        if (re.test(str))
            return (str.length - str.match(re).length) + str.match(re).length * 2;
        else
            return str.length;
    };
    /*本地数据存储*/
    api.storage = {
        put: function (key, obj) {
            var str = JSON.stringify(obj);
            localStorage.setItem(key, str);
        },
        get: function (key) {
            var str = localStorage.getItem(key);
            console.log(JSON.parse(str));
            return JSON.parse(str);
        }
    };
    function request(url, method, data, cache) {
        if (cache === 'false') {
            cache = false;
        } else {
            cache = cache || true;
        }
        var deferred = $q.defer();
        $http({
            method: method,
            url: url,
            data: data,
            cache: cache
        })
            .success(function (result, status) {
                if (result && result.res) {
                    if (result.res == '0') {
                        if (result.data) {
                            result.data.suitable_num = result.suitable_num;
                        }
                        deferred.resolve(result.data || result);
                    } else {
                        deferred.reject(result.res, result);
                    }
                }
            })
            .error(function (data, status) {
                deferred.reject(status, 'network failed');
            });
        return deferred.promise;
    }

    function requestRaw(url, method, data, cache) {
        if (cache === 'false') {
            cache = false;
        } else {
            cache = cache || true;
        }
        var deferred = $q.defer();
        $http({
            method: method,
            url: url,
            data: data,
            cache: cache
        })
            .success(function (result, status) {
                if (result && result.res) {
                    if (result.res == '0') {
                        deferred.resolve(result);
                    } else {
                        deferred.reject(result.res, result);
                    }
                }
            })
            .error(function (data, status) {
                deferred.reject(status, 'network failed');
            });
        return deferred.promise;
    }

//返回值没有res=0 没有data的情况
    function requestNoRes(url, method, data, cache) {
        if (cache === 'false') {
            cache = false;
        } else {
            cache = cache || true;
        }
        var deferred = $q.defer();
        $http({
            method: method,
            url: url,
            data: data,
            cache: cache
        })
            .success(function (result, status) {
                if (result) {
                    deferred.resolve(result);
                }
            })
            .error(function (data, status) {
                deferred.reject(status, 'network failed');
            });
        return deferred.promise;
    }

    api.onLoginReady = function () {
        return ready.promise();
    };
    /* 登录状态验证 */
    api.isLogin = function () {
        return !!$cookieStore.get('t_k');
    };
    api.doLogin = function () {
        if (ICBCUtil.isElifeAndroid()) {
            elife_app.GetNativeFunctionAndroid({'keyword': 'getToken', 'showLoginFlag': '1'});
        } else if (ICBCUtil.isElifeIos()) {
            ICBCUtil.nativeGetConfig({
                'key': 'getToken',
                'dataString': 'open',
                'callBack': "GetTokenCallbackIos"
            });
        }
    };
    // 退出登陆
    api.doLogout = function () {
        localStorage.removeItem('t_k');
        $cookieStore.remove('t_k');
        if (ICBCUtil.isElifeAndroid()) {
            elife_app.GetNativeFunctionAndroid({'keyword': 'logout'});
        } else {
            ICBCUtil.nativeGetConfig({
                'key': 'logout'
            });
        }
        console.log('退出登录');
    };
    /*获取用户信息*/
    api.getUserInfo = function () {
        var para = {
            't_k': $cookieStore.get('t_k'),
            'c_no': $cookieStore.get('c_no')
        };
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/cuinfo/findCuMoreById.action',
            'post',
            para
        );
        return promise;
    };
    api.reportError = function (para) {
        // para = {
        //     't_k': $cookieStore.get('t_k'),
        //     'c_no': $cookieStore.get('c_no')
        // };  
        console.log("报错参数");
        console.log(para);
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/feedback/addFeedback.action',
            'post',
            para
        );
        return promise;
    };
    /********************首页模块************************
     *****************************************************/
    /*获取首页banner信息*/
    api.getBannerInfo = function () {
        var para = {
            t_k: $cookieStore.get('t_k'),
            c_no: $cookieStore.get('c_no'),
            city_code: $cookieStore.get('city_code'),
            s_row: 1,
            e_row: 5
        };
        // console.log( $rootScope.token+$cookieStore.get('c_no')+$cookieStore.get('city_code'));
        var promise = request(
            baseUrl + '/OFSTCUST/banner/bannerInfo.action',
            'post',
            para
        );
        return promise;
    };
    /*首页，行业大类*/
    api.getHomeLargeCategory = function (para) {
        para.city_code = para.city_code || $cookieStore.get('city_code') || 110100;
        var promise = request(
            baseUrl + '/OFSTCUST/industry/findBtn.action',
            'post',
            para
        );
        return promise;
    };
    /*首页，工行服务搜索*/
    api.getHomeGhService = function (para) {
        para.city_code = para.city_code || $cookieStore.get('city_code') || '110100';
        var promise = request(
            baseUrl + '/OFSTCUST/funbtn/findFunBtn.action',
            'post',
            para
        );
        return promise;
    };
    /*首页，精选优惠*/
    api.getHomeSpecialOffer = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        // para.city_code = '110011';
        para.city_code = $cookieStore.get('city_code') || '110100';
        var promise = request(
            baseUrl + '/OFSTCUST/coupon/getCouponFirst.action',
            'post',
            para
        );
        return promise;
    };
    /*首页，更多精选优惠*/
    api.getMoreSpecialOffer = function (para) {
        para = {
            t_k: $cookieStore.get('t_k'),
            c_no: $cookieStore.get('c_no'),
            city_code: $cookieStore.get('city_code') || '110011',
            s_row: '1',
            e_row: '10',
            //latitude : 39.6656666,
            //longitude : 106.66566666
            latitude: $cookieStore.get('latitude'),
            longitude: $cookieStore.get('longitude')
        };
        var promise = request(
            baseUrl + '/OFSTCUST/coupon/getCouponList.action',
            'post',
            para
        );
        return promise;
    };
    /*天天抽奖*/
    api.getDailyGamble = function (para) {
        para.c_no = $cookieStore.get('c_no');
        para.city_code = $cookieStore.get('city_code') || '110011';
        //todo test code
        //para.c_no = 'AA'
        //para.city_code = 110100
        var promise = request(
            baseUrl + '/OFSTCUST/common/getLuckdRawAll.action',
            'post',
            para
        );
        return promise;
    };
    //我的抽奖
    api.getLuckListByCust = function (para) {
        para.t_k = $cookieStore.get('t_k') || '10004';
        para.c_no = $cookieStore.get('c_no');
        //para.city_code = $cookieStore.get('city_code') || '110011';
        var promise = request(
            baseUrl + '/OFSTCUST/common/getLuckListByCust.action',
            'post',
            para
        );
        return promise;
    };
    //抽奖详情
    api.getDrawDetail = function (para) {
        //para.t_k = $cookieStore.get('t_k') || '10004';
        //para.c_no = $cookieStore.get('c_no');
        para.city_code = $cookieStore.get('city_code') || '110011';
        var promise = request(
            baseUrl + '/OFSTCUST/common/findLucInfo.action',
            'post',
            para
        );
        return promise;
    };
    api.submitInfo = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/common/modifyLuckCusOrgetLuckCusInfo.action',
            'post',
            para
        );
        return promise;
    };
    /*首页，搜索历史记录*/
    api.getHomeSearchHistory = function () {
        var key = "HOME_SEARCH_HISTORY";
        return api.storage.get(key);
    };
    api.addHomeSearchHistory = function (keyword) {
        var key = "HOME_SEARCH_HISTORY";
        var historys = api.storage.get(key);
        // 第一次加载时historys是null
        if (!historys) {
            api.storage.put(key, []);
            historys = api.storage.get(key);
        }
        var index = historys.indexOf(keyword);
        if (index != -1) {
            historys.splice(index, 1);
            historys.unshift(keyword);
        } else {
            historys.unshift(keyword);
        }
        api.storage.put(key, historys);
        return;
    };
    /*首页，清除历史记录*/
    api.clearHomeSearchHistroy = function () {
        var key = "HOME_SEARCH_HISTORY";
        return api.storage.put(key, []);
    };
    /*优惠，搜索历史记录*/
    api.getDiscountSearchHistory = function () {
        var key = "DISCOUNT_SEARCH_HISTORY";
        return api.storage.get(key);
    };
    api.addDiscountSearchHistory = function (keyword) {
        var key = "DISCOUNT_SEARCH_HISTORY";
        var historys = api.storage.get(key);
        // 第一次加载时historys是null
        if (!historys) {
            api.storage.put(key, []);
            historys = api.storage.get(key);
        }
        var index = historys.indexOf(keyword);
        if (index != -1) {
            historys.splice(index, 1);
            historys.unshift(keyword);
        } else {
            historys.unshift(keyword);
        }
        api.storage.put(key, historys);
        return;
    };
    /*首页，清除历史记录*/
    api.clearDiscountSearchHistroy = function () {
        var key = "DISCOUNT_SEARCH_HISTORY";
        return api.storage.put(key, []);
    };
    // 热门搜索
    api.getHotSearch = function (para) {
        para.city_code = para.city_code || $cookieStore.get('city_code') || 110100;
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/storeisyd/hotSearch.action',
            'post',
            para
        );
        return promise;
    };
    // 搜素热门城市
    api.getHotSearchCity = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        para.country_code = para.country_code || "CN";
        para.s_row = para.s_row || 1;
        para.e_row = para.e_row || 6;
        console.log(baseUrl);
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/area/hotCity.action',
            'post',
            para
        );
        return promise;
    };
    /*首页，推荐商户*/
    api.getHomeRecommandStore = function (para) {
        // var promise = request(
        //   baseUrl + '/OFSTCUST/industry/findBtn.action',
        //   'post',
        //   para
        // );
        // return promise;
        para.t_k = $cookieStore.get('t_k');
        para.s_row = 1;
        para.e_row = 4;
        para.c_no = $cookieStore.get('c_no');
        para.city_code = $cookieStore.get('city_code');
        var promise = request(
            baseUrl + '/OFSTCUST/storecredit/getRecommendedStoreForIndex.action',
            'post',
            para
        );
        return promise;
    };
    /*更多推荐商户*/
    api.getMoreRecommandStore = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        para.city_code = $cookieStore.get('city_code');
        var promise = request(
            baseUrl + '/OFSTCUST/storecredit/getMoreRecommendStore.action',
            'post',
            para
        );
        return promise;
    };
    /*首页，猜你喜欢*/
    api.getHomeGuessLike = function (para) {
        para.city_code = localStorage.getItem('city_code') || $cookieStore.get('city_code') || '110100';
        para.s_row = '1';
        para.e_row = '10';
        para.longitude = $cookieStore.get('longitude');
        para.latitude = $cookieStore.get('latitude');
        para.query_distance = '500000';
        var promise = request(
            baseUrl + '/OFSTCUST/storecredit/guessYouLike.action',
            'post',
            para
        );
        return promise;
    };
    /*猜你喜欢更多*/
    api.getGuessLikeList = function (para) {
        para.city_code = $cookieStore.get('city_code') || '110100';
        para.longitude = $cookieStore.get('longitude');
        para.latitude = $cookieStore.get('latitude');
        para.query_distance = '500000';
        var promise = request(
            baseUrl + '/OFSTCUST/storecredit/guessYouLike.action',
            'post',
            para
        );
        return promise;
    };
    /*全部商区和热门商区*/
    api.getAllDistrict = function (para) {
        para.city_code = $cookieStore.get('city_code') || para.city_code;
        para.Cn_code = $cookieStore.get('cn_code');
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        console.log("地区获取参数");
        console.log(para);
        // para.t_k='10001';
        // para.c_no='AA';
        var promise = requestRaw(
            baseUrl + '/OFSTCUST/community/getCommunityAllByCityCode.action',
            'post',
            para
        );
        return promise;
    };
    /*报错中的全部商区和热门商区*/
    api.getDistrictList = function (para) {
        para.city_code = para.city_code || $cookieStore.get('city_code');
        para.Cn_code = $cookieStore.get('cn_code');
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        var promise = requestRaw(
            baseUrl + '/OFSTCUST/community/listDistrict.action',
            'post',
            para
        );
        return promise;
    };
    /*附近搜索*/
    api.getNearBySearch = function (para) {
        para.city_code = para.city_code || $cookieStore.get('city_code') || 110100;
        var promise = request(
            baseUrl + '/OFSTCUST/storedetail/getFoodHome.action',
            'post',
            para
        );
        return promise;
    };
    /*根据城市获取行业大类和行业小类*/
    api.getAllType = function (para) {
        // para.t_k = $cookieStore.get('t_k');
        // para.c_no = $cookieStore.get('c_no');
        para.city_code = $cookieStore.get('city_code');
        console.log("全部类别获取参数");
        console.log(para);
        var promise = request(
            baseUrl + '/OFSTCUST/industry/getIndustryAllByCity_Code.action',
            // baseUrl + '/OFSTCUST/industry/getAllType.action',
            'post',
            para
        );
        return promise;
    };
    /*逸贷商户筛选*/
    api.getYidaiBySearch = function (para) {
        para.discount_role = para.discount_role || "10010000000000000000";
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        para.city_code = para.city_code || $cookieStore.get('city_code') || 110100;
        para.longitude = $cookieStore.get('longitude');
        para.latitude = $cookieStore.get('latitude');
        var promise = request(
            baseUrl + '/OFSTCUST/storequery/list.action',
//      baseUrl + '/OFSTCUST/storeisyd/getStoreIsydList.action',
            'post',
            para
        );
        return promise;
    };
    /*积分商户筛选*/
    api.getJiFenBySearch = function (para) {
        para.discount_role = para.discount_role || '00100000000000000000';
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        para.city_code = para.city_code || $cookieStore.get('city_code') || 110100;
        para.longitude = $cookieStore.get('longitude');
        para.latitude = $cookieStore.get('latitude');
        var promise = request(
            baseUrl + '/OFSTCUST/storequery/list.action',
//      baseUrl + '/OFSTCUST/storeisyd/getStoreIsydList.action',
            'post',
            para
        );
        return promise;
    };
    /*闪酷商户筛选*/
    api.getShanKuBySearch = function (para) {
        para.discount_role = para.discount_role || "01000000000000000000";
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        para.city_code = para.city_code || $cookieStore.get('city_code') || 110100;
        para.longitude = $cookieStore.get('longitude');
        para.latitude = $cookieStore.get('latitude');
        var promise = request(
            baseUrl + '/OFSTCUST/storequery/list.action',
//      baseUrl + '/OFSTCUST/storeisyd/getStoreIsydList.action',
            'post',
            para
        );
        return promise;
    };
    api.loopRoleIcons = function ($scope, i, z) {
        for (var m = 0; m < api.rolesArr.length; m++) {
            api.getRoleIcon($scope, i, z, m);
        }
        return m;
    };
    /* 工行卡优惠筛选 */
    api.getCardOfferBySearch = function (para) {
        para.city_code = para.city_code || $cookieStore.get('city_code') || 110100;
        para.t_k = token;
        para.c_no = c_no;
        var promise = request(
            baseUrl + '/OFSTCUST/iFavorableList/getFavorableList.action',
            'post',
            para
        );
        return promise;
    };
    //获取热门城市
    api.getCity = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        para.country_code = para.country_code || "CN";
        var promise = request(
            baseUrl + '/OFSTCUST/area/showAlphaCity.action',
            'post',
            para
        );
        return promise;
    };
    //获取城市列表
    /*积分消费商户筛选*/
    api.getJifenBySearch = function (para) {
        para.city_code = para.city_code || $cookieStore.get('city_code') || 110100;
        var promise = request(
            baseUrl + '/OFSTCUST/storequery/list.action',
            'post',
            para
        );
        return promise;
    };
    /*首页顶部-关键词搜索*/
    api.getStore = function (para) {
        para.city_code = para.city_code || $cookieStore.get('city_code') || 110100;
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        para.latitude = $cookieStore.get('latitude');
        para.longitude = $cookieStore.get('longitude');
        console.log("搜索商户列表参数");
        console.log(para);
        // para.store_name = para.store_name || '';
        var promise = request(
            //baseUrl + '/OFSTCUST/storeisyd/getStoreIsydList.action',
            baseUrl + '/OFSTCUST/storequery/list.action',
            'post',
            para
        );
        return promise;
    };
    /*解析商户门店小图标*/
    api.rolesArr = ["gong", "tuan", "cu", "fen", "yi", "ji", "shan"];
    api.rolesDataBaseOrder = ["yi", "shan", "ji", "fen", "gong", "tuan", '', "cu"];
    api.getRoleIcon = function ($scope, i, z, displayOrder) {
        var val = 'icon_' + api.rolesArr[displayOrder];
        // 判断条件加了 i ，否则有时候会报错。-- 15.08.24
        if ($scope.list && i) {
            if ($scope.list[i].icons[z].trim() === val) {
                //$scope.list[i].new_icons[displayOrder]=val;
                $scope.list[i].new_icons[displayOrder] = (val);
            }
        } else {
            if ($scope.guessLike && $scope.guessLike[i].discount_role[z].trim() === val) {
                $scope.guessLike[i].new_discount_role[displayOrder] = (val);
            } else {
                $scope.new_discount_role = [];
                $scope.new_discount_role[displayOrder] = (val);
            }
        }
    };
    api.resolveDiscountRole = function (para) {
        // 原字符串得各个位，值为1表明相应图标应显示，数量达到9个后直接返回
        var resultValue = [];
        var resultRole = api.rolesDataBaseOrder;
        var index = 0;
        for (var i = 0; i < resultRole.length; i++) {
            // 如果满足要求的图标已经达到3个，直接返回
            if (index > 9) {
                return resultValue;
            }
            if (para.charAt(i) == '1') {
                resultValue.push(" icon_" + resultRole[i]);
                index++;
            }
        }
        return resultValue;
    };
    //附近优惠接口
    api.getNearStoreDiscount = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        para.city_code = $cookieStore.get('city_code');
        para.latitude = $cookieStore.get('latitude');
        para.longitude = $cookieStore.get('longitude');
        var promise = request(
            baseUrl + '/OFSTCUST/iFavorableList/getNearStoreDiscount.action',
            'post',
            para
        );
        return promise;
    };
    api.getNearBankDiscount = function (para) {
        var promise = request(
            baseUrl + '/OFSTCUST/iFavorableList/getNearBankDiscount.action',
            'post',
            para
        );
        return promise;
    };
    api.getNearDiscount = function (para) {
        var promise = request(
            baseUrl + '/OFSTCUST/iFavorableList/getNearDiscountList.action',
            'post',
            para
        );
        return promise;
    };
    /********************优惠模块************************
     *****************************************************/

        // 获取商户优惠行业大类
    api.getIndustryFavorable = function () {
        var para = {};
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        para.city_code = $cookieStore.get('city_code');
        var promise = request(
            baseUrl + '/OFSTCUST/industry/industryFavorable.action',
            'post',
            para
        );
        return promise;
    };
    // 获取商户优惠所有行业大小类
    api.getIndustryAllByCityCode = function () {
        var para = {};
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        para.city_code = $cookieStore.get('city_code');
        var promise = request(
            baseUrl + '/OFSTCUST/industry/getIndustryAllByCity_Code.action',
            'post',
            para
        );
        return promise;
    };
    // 获取商户优惠热门分类
    api.getHotIndustry = function (para) {
        para.s_row = 0;
        para.e_row = 8;
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        para.city_code = $cookieStore.get('city_code');
        var promise = request(
            baseUrl + '/OFSTCUST/industry/getHotIndustry.action',
            'post',
            para
        );
        return promise;
    };
    // 获取工行卡优惠列表
    api.getICBCDiscountList = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        para.city_code = $cookieStore.get('city_code');
        para.latitude = $cookieStore.get('latitude');
        para.longitude = $cookieStore.get('longitude');
        // para.s_row='1';
        // para.e_row='10';
        var promise = request(
            baseUrl + '/OFSTCUST/iFavorableList/getFavorableList.action',
            'post',
            para
        );
        return promise;
    };
    //获取商户优惠列表
    api.getFavorablekeyWord = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        para.city_code = $cookieStore.get('city_code');
        para.latitude = $cookieStore.get('latitude');
        para.longitude = $cookieStore.get('longitude');
        var promise = request(
            baseUrl + '/OFSTCUST/iFavorablekeyWord/listGpp.action',
            'post',
            para
        );
        return promise;
    };
    //获取关键搜优惠列表
    api.getSelectKeywordDiscount = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        para.city_code = $cookieStore.get('city_code');
        para.latitude = $cookieStore.get('latitude');
        para.longitude = $cookieStore.get('longitude');
        var promise = request(
            baseUrl + '/OFSTCUST/iFavorablekeyWord/selectKeywordDiscount.action',
            'post',
            para
        );
        return promise;
    };
    // 获取商户优惠详情
    api.getBusinessDiscountInfo = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/storediscount/getStorePftDetail.action',
            'post',
            para
        );
        return promise;
    };
    // 获取银行卡优惠详情
    api.getBankDiscountInfo = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/iFavorableList/getFavDetailsList.action',
            'post',
            para
        );
        return promise;
    };
    //获取商户详情团购信息
    api.getStoreGpp = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        para.s_row = 1;
        para.e_row = 10;
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/gpp/getStoreGpp.action',
            'post',
            para
        );
        return promise;
    };
    //获取商户团购优惠详情
    api.getGppInfo = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/gpp/getGppInfo.action',
            // 'http://82.200.109.84:8080/OFSTCUST/gpp/getGppInfo.action',
            'post',
            para
        );
        return promise;
    };
    //获取商户团购优惠详情更多
    api.getGppInfoDetail = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/gpp/getGppInfoDetail.action',
            'post',
            para
        );
        return promise;
    };
    api.gppOrder = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/order/gppOrder.action',
            // 'http://82.200.109.84:8080/OFSTCUST/order/gppOrder.action',
            'post',
            para
        );
        return promise;
    }
    //收藏银行卡优惠
    api.addBankCountFavor = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/disFav/addMyFavorite2.action',
            'post',
            para
        );
        return promise;
    };
//优惠适用门店
    api.getDiscountStore = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/bankAndStore/fundBankDiscount.action',
            'post',
            para
        );
        return promise;
    };
//收藏商户文本优惠
    api.addBusinessTextFavor = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/disFav/addMyFavorite2.action',
            'post',
            para
        );
        return promise;
    };
    /*******************商户详情模块************************
     *****************************************************/
// 商户信息
    api.getBusinessInfo = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        console.log("商户信息参数");
        console.log(para);
        var promise = request(
            baseUrl + '/OFSTCUST/storequery/storeDetail.action',
            'post',
            para
        );
        return promise;
    };
// 收藏商户
    api.addBusinessFavor = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/storeFav/favStore.action',
            'post',
            para
        );
        return promise;
    };
// 商户详情工行卡优惠
    api.getBusinessInfoICBC = function (para) {
        para.s_row = '1';
        para.e_row = '10';
        var promise = request(
            baseUrl + '/OFSTCUST/iFavorableList/getFavorableList.action',
            'post',
            para
        );
        return promise;
    };
    // 商户详情其他分店
    api.getOtherStores = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        para.city_code = $cookieStore.get('city_code');
        console.log("其他分店参数");
        console.log(para);
        var promise = requestRaw(
            baseUrl + '/OFSTCUST/storequery/list.action',
            'post',
            para
        );
        return promise;
    };
    // 商户相册
    api.getStoreAlbums = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/store/getAlbums.action',
            'post',
            para
        );
        return promise;
    };
    // 商户某一某一相册图片
    api.getAlbumPhotos = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        console.log(para);
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/store/getPhotos.action',
            'post',
            para
        );
        return promise;
    };
    // 删除商户相册某一图片
    api.deleteAlbumPhoto = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/store/removeImg.action',
            'post',
            para
        );
        return promise;
    };
    // 提交商户相册图片信息
    api.saveAlbumImgs = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/store/saveAlbumImgs.action',
            'post',
            para
        );
        return promise;
    };
    /********************我的模块************************
     *****************************************************/

        //获取我的订单
    api.getOrders = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        var promise = request(
            baseUrl + '/OFSTCUST/myorder/myOrderList.action',
            'post',
            para
        );
        return promise;
    };
    // 删除订单
    api.delOrder = function (para) {
        var promise = request(
            baseUrl + '/OFSTCUST/myorder/delOrder.action',
            // 'http://192.168.2.13:8080/OFSTCUST/myorder/delOrder.action',
            'post',
            para
        );
        return promise;
    };
    //获取团购列表
    api.getGroupList = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
         //todo test code
         para.t_k = '72b1b0b7ff734adbba8763b46b01bd63';
         para.c_no = '312';
        var promise = request(
            baseUrl + '/OFSTCUST/Groupq/getList.action',
            // 'http://192.168.2.30:8080/OFSTCUST/Groupq/getList.action',
            'post',
            para
        );
        return promise;
    };
    //我的团购券详情
    api.getMyGroupDetail = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        // para.t_k = '10001';
        // para.c_no = 'AA';
        var promise = request(
            baseUrl + '/OFSTCUST/Groupq/groupDetail.action',
            // 'http://192.168.2.30:8080/OFSTCUST/Groupq/groupDetail.action',
            'post',
            para
        );
        return promise;
    };
    // 获取我的所有电子券（包括过期、可用等等）
    api.getAllECoupons = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/order/getAllEcoupons.action',
            // 'http://82.200.109.84:8080/OFSTCUST/order/getAllEcoupons.action',
            'post',
            para
        );
        return promise;
    };
    // 获取我的可用电子券（在支付页面查询电子券时使用）
    api.getMyECoupons = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        // para.c_no = '312';
        // para.store_code = '02000000046';
        // para.t_k = 'e6ab84b6f1994addbb9c46c4a4e31b5f';
        console.log(11111111111111111111111111111111);
        console.log(para);
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/order/getMyEcoupons.action',
            // 'http://82.200.109.84:8080/OFSTCUST/order/getMyEcoupons.action',
            'post',
            para
        );
        return promise;
    };
    //支付订单详情
    api.getEWMDetial = function (para) {
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/myorder/findOrder.action',
            'post',
            para
        );
        return promise;
    };
    // 获取我的商户收藏
    api.getBusinessFavor = function (para) {
        var tK = $cookieStore.get('t_k');
        var cNo = $cookieStore.get('c_no');
        para.t_k = tK;
        para.c_no = cNo;
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/storeFav/selectMyFavorite.action',
            'post',
            para
        );
        return promise;
    };
    //删除我的评价商户收藏
    api.deleteBusinessFavor = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/storeFav/deleteMyFavorite.action',
            'post',
            para
        );
        return promise;
    };
    //删除我的评价优惠收藏
    api.deleteDiscountFavor = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/disFav/deleteMyFavorite.action',
            'post',
            para
        );
        return promise;
    };
    //获取我的评价
    api.getUserComment = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        var promise = request(
            baseUrl + '/OFSTCUST/comment/getUserComment.action',
            'post',
            para
        );
        return promise;
    };
    //获取点评列表
    api.getComments = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        var promise = request(
            baseUrl + '/OFSTCUST/comment/getComments.action',
            'post',
            para,
            'false'
        );
        return promise;
    };
    //添加点评信息
    api.addComment = function (para) {
        para.t_k = $cookieStore.get('t_k') || $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        console.log(para);
        var promise = request(
            baseUrl + '/OFSTCUST/comment/addComment.action',
            'post',
            para
        );
        return promise;
    };
    //修改点评信息
    api.updateComment = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        var promise = request(
            baseUrl + '/OFSTCUST/comment/modifyComment.action',
            'post',
            para
        );
        return promise;
    };
    //我的点评详情
    api.getCommentDetail = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        var promise = request(
            baseUrl + '/OFSTCUST/comment/getCommentDetail.action',
            'post',
            para
        );
        return promise;
    };
    //修改个人信息
    api.changePersonalInfo = function (para) {
        var promise = request(
            baseUrl + '/OFSTCUST/cuinfo/updateCuinfo.action',
            // 'http://82.200.109.86:8080/OFSTCUST/cuinfo/updateCuinfo.action',
            'post',
            para
        );
        return promise;
    };
    //常住地城市列表
    api.getAllCity = function (para) {
        para.country_code = para.country_code || "CN";
        var promise = request(
            baseUrl + '/OFSTCUST/area/showAllCity.action',
            'post',
            para
        );
        return promise;
    };
    //默认图片的设置
//  api.setDefaultImg = function(url) {
//    var defaultImgUrl = "/images/xinxian.jpg";
//
//    $http({
//      method : 'get',
//      url: $rootScope.imgBaseUrl + url,
//    })
//    .success(function(result, status) {
//      var resUrl = url;
//      console.log(status);
//      return resUrl;
//    });
//    return defaultImgUrl;
//  };
    //获取商户/团购/银行/电子券适用门店
    api.getSuitStoreList = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        var promise = request(
            baseUrl + '/OFSTCUST/storediscount/getSuitStoreList.action',
            'post',
            para
        );
        console.log('获取适用门店');
        console.log(para);
        return promise;
    };
    //获取我的收藏城市列表
    api.getFavCityList = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        var promise = request(
            baseUrl + '/OFSTCUST/cusinfoFav/showCity.action',
            'post',
            para
        );
        return promise;
    };
    // 获取 商户/团购 分享信息
    api.getShare = function (para) {
        para.t_k = $cookieStore.get('t_k');
        para.c_no = $cookieStore.get('c_no');
        para.share_channel = 1;
        var promise = request(
            baseUrl + '/OFSTCUST/share/addShareInfo.action',
            'post',
            para
        );
        console.log('__________________');
        console.log(para);
        return promise;
    };
    api.loginByTicket = function (para) {
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/servlet/loginInfo.action',
            'post',
            para
        );
        return promise;
    };
    //根据经纬度获取城市
    api.getCityCodeByGPS = function (para) {
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/area/getCityCodeByLatAndLng2.action',
            'post',
            para
        );
        return promise;
    };
    // 买单
    api.addOrder = function (para) {
        console.log(para);
        var promise = request(
            baseUrl + '/OFSTCUST/order/appOrder.action',
            // 'http://82.200.109.84:8080/OFSTCUST/order/appOrder.action',
            'post',
            para
        );
        return promise;
    };
    // 扫一扫解密二维码
    api.decryptQrcode = function (para) {
        console.log(para);
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/order/qrCodeOrder.action',
            // 'http://82.200.109.84:8080/OFSTCUST/order/qrCodeOrder.action',
            'post',
            para
        );
        return promise;
    };
    api.changePwd = function (para) {
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/cuinfo/updateCuinfo.action',
            // 'http://82.200.109.86:8080/OFSTCUST/cuinfo/updateCuinfo.action',
            'post',
            para
        );
        return promise;
    };
    api.checkTel = function (para) {
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/cuinfo/validatePwd.action',
            // 'http://82.200.109.86:8080/OFSTCUST/cuinfo/validatePwd.action',
            'post',
            para
        );
        return promise;
    };
    api.getVerifyNumber = function (para) {
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/cuinfo/InsertToken.action',
            // 'http://82.200.109.86:8080/OFSTCUST/cuinfo/InsertToken.action',
            'post',
            para
        );
        return promise;
    };
    api.changeTel = function (para) {
        var promise = requestNoRes(
            baseUrl + '/OFSTCUST/cuinfo/validatePwd.action',
            // 'http://82.200.109.86:8080/OFSTCUST/cuinfo/updateCuinfo.action',
            'post',
            para
        );
        return promise;
    };
    // api.geocoder = function (para) {
    //   para.ak = 'rYiHdeGPLQu0FnB1wR8K3Gjj';
    //   para.output = 'json';
    //   var promise = requestNoRes(
    //     'http://api.map.baidu.com/geocoder/v2/',
    //     'get',
    //     para
    //   );
    //   return promise;
    // };
    /*
     * 函数名称：base64加密
     * 参数说明：
     * str：字符串类型
     */
    api.base64_encode = function (str) {
        var c1, c2, c3;
        var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var i = 0, len = str.length, string = '';
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                string += base64EncodeChars.charAt(c1 >> 2);
                string += base64EncodeChars.charAt((c1 & 0x3) << 4);
                string += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                string += base64EncodeChars.charAt(c1 >> 2);
                string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                string += base64EncodeChars.charAt((c2 & 0xF) << 2);
                string += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            string += base64EncodeChars.charAt(c1 >> 2);
            string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            string += base64EncodeChars.charAt(c3 & 0x3F);
        }
        return string;
    };
    /*
     * 函数名称：base64解密
     * 参数说明：
     * str：字符串类型
     */
    api.base64_decode = function (str) {
        var c1, c2, c3, c4;
        var base64DecodeChars = new Array(
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57,
            58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6,
            7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
            25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
            37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1,
            -1, -1
        );
        var i = 0, len = str.length, string = '';
        while (i < len) {
            do {
                c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (
            i < len && c1 == -1
                );
            if (c1 == -1) break;
            do {
                c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (
            i < len && c2 == -1
                );
            if (c2 == -1) break;
            string += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
            do {
                c3 = str.charCodeAt(i++) & 0xff;
                if (c3 == 61)
                    return string;
                c3 = base64DecodeChars[c3];
            } while (
            i < len && c3 == -1
                );
            if (c3 == -1) break;
            string += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
            do {
                c4 = str.charCodeAt(i++) & 0xff;
                if (c4 == 61) return string;
                c4 = base64DecodeChars[c4];
            } while (
            i < len && c4 == -1
                );
            if (c4 == -1) break;
            string += String.fromCharCode(((c3 & 0x03) << 6) | c4);
        }
        return string;
    };
    api.base64 = new Base64();
    function Base64() {
        // private property
        _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        // public method for encoding
        this.encode = function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
            input = _utf8_encode(input);
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output +
                    _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                    _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
            }
            return output;
        };
        // public method for decoding
        this.decode = function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (i < input.length) {
                enc1 = _keyStr.indexOf(input.charAt(i++));
                enc2 = _keyStr.indexOf(input.charAt(i++));
                enc3 = _keyStr.indexOf(input.charAt(i++));
                enc4 = _keyStr.indexOf(input.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
            }
            output = _utf8_decode(output);
            return output;
        };
        // private method for UTF-8 encoding
        _utf8_encode = function (string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        };
        // private method for UTF-8 decoding
        _utf8_decode = function (utftext) {
            var string = "";
            var i = 0;
            var c = 0,
                c1 = 0,
                c2 = 0;
            while (i < utftext.length) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            return string;
        };
    }

    api.setCountdown = function (remaining, callback) {
        //todo
        //remaining = 2000;
        remaining = remaining - 0 || 0;
        if (remaining <= 0) {
            return;
        }
        callback = callback || function () {
                //debugger;
                //location.reload();
                try {
                    $scope.getList();
                } catch (e) {
                }
            };
        var countDownObj = {
            promise: null,
            //_start: now,
            //_end: remaining,
            hourUpper: 0,
            hour: 0,
            minuteUpper: 0,
            minute: 0,
            secondUpper: 0,
            second: 0,
            _go: function () {
                //var now = (new Date()).getTime();
                if (remaining <= 0) {
                    $interval.cancel(this.promise);
                    callback();
                    return;
                }
                var rest = remaining;
                var hour = Math.floor(rest / 3600);
                this.hour = Math.floor(hour / 10);
                this.hourUpper = hour % 10;
                var minute = Math.floor((rest - hour * 3600) / 60);
                this.minute = Math.floor(minute / 10);
                this.minuteUpper = minute % 10;
                var second = Math.floor(rest % 60);
                this.second = Math.floor(second / 10);
                this.secondUpper = second % 10;
                remaining -= 1;
            }
        };
        var countFn = function () {
            countDownObj.promise = $interval(function func() {
                return countDownObj._go.call(countDownObj);
            }, 1000);
        };
        countFn();
        return countDownObj;
    };
    api.getAwardList = function ($scope, callback) {
        return function () {
            $scope.loading = true;
            $scope.isEmpty = false;
            var para = {};
            if ($scope.mark === false) {
                $scope.list = [];
                $scope.e_row = 0;
            }
            para.s_row = $scope.e_row + 1 || 0;
            para.e_row = (para.s_row + $scope.page_size) || 1;
            para.invalid_status = $scope.status;
            $scope.e_row = para.e_row;
            api.getDailyGamble(para).then(function (data) {
                console.log('天天抽奖');
                console.log(data);
                // $scope.details = [];
                var length1 = $scope.details;
                data = data instanceof Array ? data : [data];
                for (var index = 0; index < data.length; index++) {
                    if (data[index].status === '') {
                        continue;
                    }
                    var detail = {
                        labelState: data[index].status == '0' ? 'HOT' : '已结束',
                        telePhone_url: data[index].imgUrl,
                        phoneTitle: data[index].prizeName,
                        number: "已参与" + (data[index].can_count || 0) + "人",
                        periods: data[index].activityName,
                        state: data[index].status,
                        drawCode: data[index].code,
                        drawType: data[index].cycle_type, //1天天抽 2周周抽 3月月抽
                        countDown: api.setCountdown(data[index].remaining_time, callback)
                    };
                    $scope.details.push(detail);
                }
                var length2 = $scope.details.length;
                if (length1 === length2) {
                    $scope.loadingMore = false;
                }
                if ((!$scope.details || $scope.details.length === 0)) {
                    // console.log('----------------------------');
                    // console.log($scope.details);
                    $scope.isEmpty = true;
                    $scope.loading = false;
                    $scope.mark = false;
                }
                $scope.loading = false;
                $scope.mark = false;
            }, function (data) {
                console.error("获取天天抽奖列表失败：" + data);
                $scope.isEmpty = true;
                $scope.details = [];
                $scope.loading = false;
                $scope.mark = false;
            });
        };
    };
    api.joinAward = function (para) {
        para.city_code = para.city_code || $cookieStore.get('city_code') || 110100;
        para.t_k = $rootScope.token;
        para.c_no = $cookieStore.get('c_no');
        //todo test code
        //para.t_k = '1d369086a70a4c30a1e90d168f2d4638';
        //para.c_no = '314';
        var promise = request(
            baseUrl + '/OFSTCUST/common/addLuckCus.action',
            'post',
            para
        );
        return promise;
    };
    api.doGPSLocation = function (callback) {
        //APP交互获取经纬度
        if (ICBCUtil.isElifeAndroid() || ICBCUtil.isAndroid() || localStorage.emulateAndroid) {
            elife_app.GetLocationAndroid();
        } else if (ICBCUtil.isElifeIos() || ICBCUtil.isIPhone()) {

            //调用地理位置
            ICBCUtil.nativeGetConfig({
                'key': 'getGPS',
                'callBack': 'GetLocationCallback'
            });
        } else {
            if (callback instanceof Function) {
                callback();
            }
        }
    };
    api.getStoreData = function (data, $scope) {
        if (data) {
            console.log("get store info");
            for (var i = 0; i < data.length; i++) {
                data[i].discount_role = api.resolveDiscountRole(data[i].discount_role);
                data[i].new_discount_role = [];
                data[i].PRStyle = {paddingRight: data[i].discount_role.length * 18 + 'px'};
                for (var z = 0; z < data[i].discount_role.length; z++) {
                    for (var m = 0; m < api.rolesArr.length; m++) {
                        var val = 'icon_' + api.rolesArr[m];
                        if (data[i].discount_role[z].trim() === val) {
                            data[i].new_discount_role[m] = (val);
                        }
                    }
                }
                data[i].new_discount_role = api.removeEmptyArrEleAndReverse(data[i].new_discount_role);
                var stars = [];
                for (var j = 0; j < 5; j++) {
                    if (j + 1 <= data[i].levels) {
                        stars[j] = {"type": "full"};
                    } else if (j - data[i].levels < 0) {
                        stars[j] = {"type": "half"};
                    } else {
                        stars[j] = {"type": "gray"};
                    }
                }
                data[i].levels = stars;
                data[i].bottomContent = '';
                if ((data[i].bottomContent.length <= 18) && data[i].district_name1 && data[i].district_name1 !== '') {
                    data[i].bottomContent += data[i].district_name1;
                    data[i].bottomContent += '/';
                }
                if ((data[i].bottomContent.length <= 18) && data[i].district_name2 && data[i].district_name2 !== '') {
                    data[i].bottomContent += data[i].district_name2;
                    data[i].bottomContent += '/';
                }
                if ((data[i].bottomContent.length <= 18) && data[i].district_name3 && data[i].district_name3 !== '') {
                    data[i].bottomContent += data[i].district_name3;
                    data[i].bottomContent += '/';
                }
                data[i].bottomContent = data[i].bottomContent.substring(0, data[i].bottomContent.length - 1) + ' ';
                if ((data[i].bottomContent.length <= 18) && data[i].small_name1 && data[i].small_name1 !== '') {
                    data[i].bottomContent += data[i].small_name1;
                    data[i].bottomContent += '/';
                }
                if ((data[i].bottomContent.length <= 18) && data[i].small_name2 && data[i].small_name2 !== '') {
                    data[i].bottomContent += data[i].small_name2;
                    data[i].bottomContent += '/';
                }
                if ((data[i].bottomContent.length <= 18) && data[i].small_name3 && data[i].small_name3 !== '') {
                    data[i].bottomContent += data[i].small_name3;
                    data[i].bottomContent += '/';
                }
                data[i].bottomContent = data[i].bottomContent.substring(0, data[i].bottomContent.length - 1);
                data[i].showdistance = data[i].distance + data[i].unit;
            }
        }
        console.log("试用门店信息");
        console.log(data);
        return data;
    };
    api.getDelFunc = function ($scope) {
        $scope.isEditing = false;
        // 待删除列表
        var deleteList = [];
        $scope.edit = function () {
            if ($scope.isEditing) {
                $scope.isEditing = false;
                //执行删除操作
            } else {
                $scope.isEditing = true;
                deleteList = [];
            }
        };
        return deleteList;
    };
    api.setSelectBtn = function ($scope) {
        $scope.isSelect = function (comment) {
            var index = $scope.deleteList.indexOf(comment);
            return index != -1;
        };
    };
    api.setMaskClick = function ($scope) {
        $scope.coIndexArry = [];
        var data = [];
        $scope.select = function (curData) {
            if ($scope.active == 1) {
                data = $scope.unpaidOrders;
            } else {
                data = $scope.paidOrders;
            }
            var coIndex = data.indexOf(curData);
            var index = $scope.deleteList.indexOf(curData);
            if (index === -1) {
                $scope.coIndexArry.push(coIndex);
                $scope.deleteList.push(curData);
            } else {
                $scope.coIndexArry.splice(coIndex, 1);
                $scope.deleteList.splice(index, 1);
            }
        };
    };
    api.cancelDel = function ($scope) {
        $scope.cancel = function () {
            $scope.isEditing = false;
            $scope.deleteList = [];
        };
        return $scope.deleteList;
    };
    api.promptDel = function ($scope, SharedState) {
        $scope.preDelete = function () {
            if ($scope.deleteList && $scope.deleteList.length > 0) {
                SharedState.turnOn('comment_del_modal');
            } else {
                SharedState.turnOn('comment_error_modal');
            }
        };
    };
    api.removeEmptyArrEleAndReverse = function (arr) {
        return arr.join().replace(/,{2,}/g, ',').replace(/^,/, '').split(',').reverse();
    };
    api.getOrderingIcons = function (listItem, API, $scope, i) {
        listItem.icons = API.resolveDiscountRole(listItem.discount_role);
        listItem.new_icons = [];
        // 右边距
        listItem.PRStyle = {paddingRight: listItem.icons.length * 18 + 'px'};
        for (var z = 0; z < listItem.icons.length; z++) {
            API.loopRoleIcons($scope, i, z);
        }
        listItem.new_icons = API.removeEmptyArrEleAndReverse(listItem.new_icons);
        return z;
    };
    api.getFilterRoles = function ($scope, icbc, discount) {
        $scope.discount_role = undefined;
        if (icbc && !discount) {
            $scope.discount_role = "11110000000000000000";
        } else if (!icbc && discount) {
            $scope.discount_role = "00001101000000000000";
        } else if (icbc && discount) {
            $scope.discount_role = "11111101000000000000";
        }
    };
    api.replaceBreakline = function (txt) {
        return txt.replace(/\n/g, '<br>');
    };
    return api;
}]);