elife.controller('ErrorCtrl', ['$scope', '$rootScope', '$routeParams', '$cookieStore', '$http', 'API', 'SharedState', 'mapService', '$q', function ($scope, $rootScope, $routeParams, $cookieStore, $http, API, SharedState, mapService, $q) {
    elife_app.SetReturnBtn();
    $scope.id = $routeParams.id;
    $scope.district_name = $cookieStore.get('DISTRICT_NAME');
    $scope.small_code = $cookieStore.get('SMALL_CODE');
    $scope.small_name = $cookieStore.get('SMALL_NAME');
    var markerPoint = null;
    $scope.setStoreName = function () {
        $cookieStore.put('STORE_NEW_NAME', $scope.busiInfo.store_name);
        $cookieStore.put('STORE_NEW_ADDRESS', $scope.busiInfo.store_address);
        $cookieStore.put('STORE_NEW_TEL', $scope.busiInfo.tel_phone1);
    };
    $scope.clearErrHistory = function () {
        setTimeout(function () {
            $cookieStore.remove('DISTRICT_NAME');
            $cookieStore.remove('DISTRICT_CODE');
            $cookieStore.remove('SMALL_CODE');
            $cookieStore.remove('SMALL_NAME');
            $cookieStore.remove('STORE_NEW_NAME');
            $cookieStore.remove('STORE_NEW_ADDRESS');
            $cookieStore.remove('STORE_NEW_TEL');
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
            else {
                window.history.back();
            }
        }, 0);
    };
    // 商户详情 2015-05-10 1  2:29:56
    var getSuccessCallback = function (data) {
        var info = data;
        console.log(info);
        $scope.head_code = data.parent_store_code;
        console.log($scope.head_code);
        $scope.busiInfo = {
            "average_price": info.average_price,
            "store_code": info.store_code,
            "store_name": $cookieStore.get('STORE_NEW_NAME') || info.store_name,
            "image_url": info.image_url,
            "image_name": info.image_name,
            "store_address": info.store_address || $cookieStore.get('STORE_NEW_ADDRESS'),
            'busihours': info.busihours,
            "levels": info.levels,
            "large_flag": info.large_flag,
            // "distance" : info.distance / 1000,
            // "small_type" : info.small_type,
            "people_consumption": info.people_consumption,
            "sentiment_count": info.sentiment_count,
            "praise_count": info.praise_count,
            "view_count": info.view_count,
            "tel_phone1": info.tel_phone1 || $cookieStore.get('STORE_NEW_TEL'),
            "tel_phone2": info.tel_phone2,
            "tel_phone3": info.tel_phone3,
            // "start_time" : info.start_time,
            // "end_time" : info.end_time,
            "longitude": info.longitude,
            "latitude": info.latitude,
            "is_wifi": info.is_wifi == "0" ? "_gray" : "",
            "is_free": info.is_free == "0" ? "_gray" : "",
            "is_credit_card": info.is_credit_card == "0" ? "_gray" : "",
            "fav_status": info.fav_status || 0
        };
        $scope.content = $scope.busiInfo.store_name;
        //generate map
        if (document.getElementById('map') && typeof BMap !== 'undefined') {
            var map = new BMap.Map("map");
            if ($scope.busiInfo.longitude < $scope.busiInfo.latitude) {
                var temp = $scope.busiInfo.longitude;
                $scope.busiInfo.longitude = $scope.busiInfo.latitude;
                $scope.busiInfo.latitude = temp;
            }
            var point = new BMap.Point($scope.busiInfo.longitude, $scope.busiInfo.latitude);
            var marker = new mapService.overlay(point, $scope.busiInfo.store_name, $scope.busiInfo.store_address);
            markerPoint = new BMap.Marker(point);
            map.centerAndZoom(point, 13);
            map.addOverlay(markerPoint);
            map.addOverlay(marker);
            markerPoint.enableDragging();
            $scope.geoc = new BMap.Geocoder();
        } else {
        }
    };
    //todo test code
    if (localStorage.zhl) {
        $http.get('../test/storeDetail.json').success(function (data) {
            getSuccessCallback(data.data);
        });
    } else {
        API.getBusinessInfo({
            'store_code': $scope.id
        }).then(getSuccessCallback,
            function (data) {
                console.log('商户详情获取失败');
                $scope.toast("请检查网络状况1");
            });
    }
    //报错
    $scope.content = '';
    $scope.isSuccess = false;
    $scope.errorReport = function (type) {
        if ($scope.content.trim() === '' && type != '07') {
            $scope.toast('请输入内容');
            return;
        }
        $scope.toast('正在提交报错信息...');
        var para = {
            'error_type': type,
            'store_code': $scope.id,
            'head_code': $scope.head_code,
            't_k': $cookieStore.get('t_k'),
            'c_no': $cookieStore.get('c_no')
        };
        var getReportPara = function (resolve, reject) {
            switch (type) {
                case '2':
                    resolve(para);
                    break;
                case '07':
                    var pos = markerPoint.getPosition();
                    $scope.geoc.getLocation(pos, function (rs) {
                        //var addComp = rs.addressComponents;
                        para.error_meg = rs.address;
                        resolve(para);
                    });
                    //para.error_meg = JSON.stringify(pos);
                    break;
                case '08':
                    para.error_meg = "store_name:" + $scope.busiInfo.store_name + "," + "store_address:" + $scope.busiInfo.store_address + "," + "tel_phone1:" + $scope.busiInfo.tel_phone1 + "," + "district_name:" + $scope.district_name + "," + "small_name:" + $scope.small_name;
                    resolve(para);
                    break;
                case '10':
                    para.error_meg = $scope.content;
                    resolve(para);
                    break;
                default:
                    para.error_meg = null;
                    resolve(para);
                    break;
            }
        };
        var promise = (function func() {
            return $q(getReportPara);
        })();
        promise.then(function (para) {
            API.reportError(para).then(function (data) {
                if (data.res === '0') {
                    SharedState.turnOn('success_modal');
                    history.back();
                    console.log('提交成功');
                    console.log(data);
                } else {
                    // alert("错误码：" + JSON.stringify(data));
                    console.log("错误码：" + JSON.stringify(data));
                    $scope.toast('提交出错');
                }
            }, function (data) {
                console.log('请检查网络');
                console.log(data);
            });
        });
    };
}]);