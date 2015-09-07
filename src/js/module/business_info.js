elife.controller('BusinessInfoCtrl', ['$scope', '$http', '$cookieStore', '$routeParams', 'SharedState', 'API', '$rootScope', '$timeout', '$location',
    function ($scope, $http, $cookieStore, $routeParams, SharedState, API, $rootScope, $timeout, $location) {
        var KEY_COMMENT_IMG_LIST = "commentImgList";
        var ua = navigator.userAgent.toLowerCase();
        $scope.isAndroid = ua.indexOf('android') > -1;
        $scope.callphone = function (tel) {
            $timeout(function () {
                elife_app.GetNativeFunctionAndroid({'keyword': 'callPhone', 'tel': tel});
            }, 0);
        };
        // 返回按钮
        // elife_app.SetReturnBtn();
        $scope.busiInfo = {};
        // elife_app.SetStoreContactBtn();
        $scope.hideCustomersList = true;
        $scope.hideIcbcList = true;
        $scope.checkInfoIcbc = "查看更多";
        $scope.checkInfoCustomers = "查看更多";
        $scope.id = $routeParams.id;
        $scope.imgBaseUrl = $rootScope.imgBaseUrl;
        //工行卡优惠
        $scope.mark = false;
        //团购优惠
        $scope.mark2 = false;
        $scope.mark3 = false;
        //收藏需要替换url
        $scope.AddFavor = function () {
            $timeout(function () {
                // if (!$rootScope.token) {
                //     if (ICBCUtil.isElifeAndroid()) {
                //         elife_app.GetNativeFunctionAndroid({'keyword': 'getToken'});
                //     } else if (ICBCUtil.isElifeIos()) {
                //         ICBCUtil.nativeGetConfig({
                //             'key': 'getToken',
                //             'callBack': "GetTokenCallbackIos"
                //         });
                //     }
                //     return;
                // }
                console.error($rootScope.token);
                if (!API.isLogin()) {
                    console.log('未登录');
                    API.doLogin();
                    return;
                }
                console.log("开始收藏");
                if ($scope.busiInfo.fav_status === "1") {
                    API.deleteBusinessFavor({store_codes: $scope.busiInfo.store_code}).then(function (data) {
                        console.log('删除收藏商户');
                        console.log(data);
                        if (data.res === "0") {
                            $scope.busiInfo.fav_status = "0";
                            $scope.toast("取消收藏成功");
                        }
                    }, function (data) {
                        console.log('删除收藏商户失败');
                        $scope.toast("请检查网络状况");
                    });
                } else {
                    //收藏商户
                    API.addBusinessFavor({s_code: $scope.id}).then(function (data) {
                        console.log('收藏商户');
                        console.log('_________________________________???????????????');
                        console.log(JSON.stringify(data));
                        if (data.res === "0") {
                            $scope.busiInfo.fav_status = "1";
                            $scope.toast("收藏成功");
                        }
                        if (data.res === "2000002") {
                            $scope.busiInfo.fav_status = "1";
                            $scope.toast("您已经收藏过");
                        }
                    }, function (data) {
                        console.log('收藏商户失败');
                        $scope.toast("请检查网络状况");
                    });
                }
            }, 0);
        };
        $scope.onlineStatus = 'false';
        // 商户详情 2015-05-10 12:29:56
        API.getBusinessInfo({
            'store_code': $scope.id
        }).then(function (data) {
                console.log('store info_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-');
                console.log(data);
                $scope.onlineStatus = data.online_status;
                console.log(!!$scope.onlineStatus);
                var info = data;
                $scope.head_code = data.parent_store_code;
                $scope.busiInfo = {
                    "average_price": info.average_price,
                    "store_code": info.store_code,
                    "store_name": info.store_name,
                    "image_url": info.image_url,
                    "image_name": info.image_name,
                    "store_address": info.store_address,
                    'busihours': info.busihours,
                    "levels": info.levels,
                    "large_flag": info.large_flag,
                    "comment_url": '/review/comment/' + $scope.id + '/' + info.large_flag,
                    // "distance" : info.distance / 1000,
                    // "small_type" : info.small_type,
                    "people_consumption": info.people_consumption,
                    "sentiment_count": info.sentiment_count,
                    "praise_count": info.praise_count,
                    "view_count": info.view_count,
                    "tel_phone1": info.tel_phone1,
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
                console.log($scope.busiInfo.large_flag);
                $scope.busiInfo.tel_phone = [];
                if ($scope.busiInfo.tel_phone1) {
                    $scope.busiInfo.tel_phone.push($scope.busiInfo.tel_phone1);
                    if ($scope.busiInfo.tel_phone2) {
                        $scope.busiInfo.tel_phone.push($scope.busiInfo.tel_phone2);
                        if ($scope.busiInfo.tel_phone3) {
                            $scope.busiInfo.tel_phone.push($scope.busiInfo.tel_phone3);
                        }
                    }
                }
                console.log('????????????????????');
                console.log($scope.busiInfo.tel_phone);
                //设置平均星级
                var avg_stars = [];
                for (var j = 0; j < 5; j++) {
                    if (j + 1 <= $scope.busiInfo.levels) {
                        avg_stars[j] = {"type": "full"};
                    } else if (j - $scope.busiInfo.levels < 0) {
                        avg_stars[j] = {"type": "half"};
                    } else {
                        avg_stars[j] = {"type": "gray"};
                    }
                }
                $scope.avg_stars = avg_stars;
                // 小图标处理
                $scope.busiInfo.flags = API.resolveDiscountRole(info.discount_role);
                $scope.busiInfo.PRStyle = {paddingRight:$scope.busiInfo.flags.length * 22 + 'px'};
                console.log($scope.busiInfo.flags);
                $scope.busiInfo.new_flags = [];
                for (var i = 0; i < $scope.busiInfo.flags.length; i++) {
                    if ($scope.busiInfo.flags[i] === ' icon_yi') {
                        $scope.busiInfo.new_flags[1] = (' icon_yi');
                    }
                    if ($scope.busiInfo.flags[i] === ' icon_fen') {
                        $scope.busiInfo.new_flags[0] = (' icon_fen');
                    }
                    if ($scope.busiInfo.flags[i] === ' icon_shan') {
                        $scope.busiInfo.new_flags[3] = (' icon_shan');
                    }
                    if ($scope.busiInfo.flags[i] === ' icon_ji') {
                        $scope.busiInfo.new_flags[2] = (' icon_ji');
                    }
                }
                $scope.busiInfo.new_flags=API.removeEmptyArrEleAndReverse($scope.busiInfo.new_flags).reverse();
            },
            function (data) {
                console.log('商户详情获取失败');
                $scope.toast("请检查网络状况");
            });
//网友点评
        API.getComments({
            s_row: 0,
            e_row: 1,
            cmtType: 'Store',
            evaTargetCode: $scope.id
        }).then(function (data) {
            console.log('点评列表');
            console.log(data);
            $scope.count = data.count;
            if ($scope.count > 0) {
                $scope.review = data.review_list[0];
                console.log($scope.review);
                $scope.review.longEnough = $scope.review.review_content.length > 65 ? true : false;
                $scope.review.content = $scope.review.review_content.substr(0, 65);
                $scope.review.more = $scope.review.review_content.substr(65, $scope.review.review_content.length);
                //设置展示的星级
                var stars = [];
                for (var j = 0; j < 5; j++) {
                    if (j + 1 <= $scope.review.level) {
                        stars[j] = {"type": "full"};
                    } else if (j - $scope.review.level < 0) {
                        stars[j] = {"type": "half"};
                    } else {
                        stars[j] = {"type": "gray"};
                    }
                }
                $scope.stars = stars;
                //设置展示的图片
                $scope.imagelist = $scope.review.review_image_list || [];
                $cookieStore.remove(KEY_COMMENT_IMG_LIST);
                $cookieStore.put(KEY_COMMENT_IMG_LIST, $scope.imagelist);
            }
        }, function (data) {
            console.log('获取点评列表失败');
            $scope.toast("请检查网络状况");
        });
        $scope.getNearbyDiscount = function (distance) {
            var para = {};
//    para.t_k = $rootScope.token;
//    para.c_no = $cookieStore.get('c_no');
            para.city_code = $cookieStore.get('city_code');
            para.s_row = $scope.sRow || 1;
            para.e_row = $scope.eRow || 10;
            para.bs_row = $scope.bsRow || 1;
            para.be_row = $scope.beRow || 10;
//    if($scope.keyword){
//      para.keyword = $scope.keyword;
//    }
            para.query_distance = distance;
            para.latitude = $cookieStore.get('latitude');
            para.longitude = $cookieStore.get('longitude');
            //工行卡优惠
            //$scope.mark = false;
            API.getBusinessInfoICBC({store_code: $routeParams.id}).then(function (data) {
                console.log("工行卡优惠");
                console.log(data);
                $scope.cardOfferList = data;
                if (data.length > 0) {
                    $scope.mark = true;
                }
            }, function (data) {
                $scope.toast('请检查网络设置');
                console.error("列表获取失败：" + data);
            });
            //团购优惠
            $scope.mark2 = false;
            API.getStoreGpp({
                'store_code': $scope.id
            }).then(function (data) {
                console.log('获取商户详情团购优惠成功');
                console.log(data);
                if (parseInt(data.res) !== 0) {
                    return;
                }
                if (data.data.gpp_list.length > 0) {
                    $scope.mark2 = true;
                    $scope.storeGppList = data.data.gpp_list;
                }
                if (data.data.text_list.length > 0) {
                    $scope.mark3 = true;
                    $scope.storePrompList = data.data.text_list;
                }
            }, function (data) {
                $scope.toast('请检查网络设置');
                console.error("获取商户详情团购优惠失败" + data);
            });
            $scope.destination = $routeParams.destination;
            $scope.confirm = function () {
                $location.path('navigation/route/' + $scope.origin + "/" + $scope.busiInfo.store_address + "/" + $scope.busiInfo.store_name + "/" + $scope.busiInfo.longitude + "/" + $scope.busiInfo.latitude);
            };
//     //附近门店
//     API.getNearStoreDiscount(para).then(function(data){
//       var list = data;
//       // 解析商户图标
//       for (var i=0; i<list.length; i++) {
//           list[i].distance /= 1000;
//           list[i].distance = list[i].distance.toFixed(1);
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
//         }
//         $scope.discounts = list;
// //        if(list === undefined || list.length === 0){
// //          $scope.isEmpty = true;
// //        }
// //        $scope.loading = false;
//         console.log($scope.discounts);
//     }, function(data){
// //      $scope.toast('请检查网络状况');
// //      $scope.loading = false;
// //      $scope.isEmpty = true;
//     });
        };
        $scope.getNearbyDiscount();
        $scope.errorReport = function (type) {
            console.log('商户关闭和重复报错');
            console.log(type);
            console.log($scope.head_code);
            $scope.toast('正在提交报错信息...', 3000);
            var para = {
                'error_type': type,
                'store_code': $scope.id,
                'head_code': $scope.head_code,
                't_k': $cookieStore.get('t_k'),
                'c_no': $cookieStore.get('c_no')
            };
            switch (type) {
                case '06':
                    para.error_meg = 0;
                    break;
                case '09':
                    para.error_meg = 0;
                    break;
                default:
                    para.error_meg = null;
                    break;
            }
            console.log(para);
            API.reportError(para).then(function (data) {
                SharedState.turnOn('success_modal');
                console.log('提交成功');
                console.log(data);
            }, function (data) {
                $scope.toast('请检查网络状况');
                console.log('请检查网络5');
                console.log(data);
            });
        };
        /*app交互*/
// 返回按钮
// elife_app.SetReturnBtn();
        // 分享
// $scope.share = function(para){
//   $scope.toast("正在获取数据...",1000);
//   var shareInfo = {};
//   para.t_k = $rootScope.token;
//   para.c_no = $cookieStore.get('c_no');
//   API.getShare(para).then(function (data) {
//     console.log('正在获取分享信息...');
//     console.log(data);
//     shareInfo = {
//       PNGUrl : data.shareImageUrl,
//       ShareUrl : data.shareLink,
//       Title : data.shareTitle,
//       Content : data.shareContent,
//       UseChannel : 1,
//       backCallUrl : data.backCallUrl,
//       pkOfstTwShare : data.pkOfstTwShare,
//       shareCode : data.shareCode
//     };
//     shareInfo = JSON.stringify(shareInfo);
//     $timeout(function () {
//       if(ICBCUtil.isElifeAndroid()){
//          elife_app.GetNativeFunctionAndroid({'keyword':'getShare','shareInfo':API.base64.encode(shareInfo)});
//        }
//        if(ICBCUtil.isElifeIos()||ICBCUtil.isIPhone()){
//       /*dataString 需要base64转换*/
//         ICBCUtil.nativeGetConfig({
//           'key' : 'getShare',
//           'callBack' : "",
//           'dataString' : API.base64.encode(shareInfo)
//         });
//        }
//     },0);
//   },function (data) {
//     console.error('获取分享信息失败！');
//   });
//   };
        $scope.displayIconInfo = function (flag) {
            var prompt = flag;
            switch (flag) {
                case ' icon_yi':
                    prompt = '商户支持逸贷业务';
                    break;
                case ' icon_shan':
                     prompt = '商户支持“quickpass”银联卡非接快速支付';
                    break;
                case ' icon_ji':
                    prompt = '商户支持工行积分当钱用';
                    break;
                case ' icon_fen':
                    prompt = '商户支持分期付款';
                    break;
                case ' icon_gong':
                    prompt = '用工行卡在商户消费可享受优惠';
                    break;
                case ' icon_tuan':
                    prompt = '商户有团购优惠';
                    break;
                case ' icon_cu':
                    prompt = '商户有促销优惠';
                    break;
                case ' icon_ka':
                    prompt = '用商户会员卡可享受优惠（免费办理）';
                    break;
            }
            return $scope.toast(prompt);
        };
        // 20150702 测试登录 获取token
        // $cookieStore.remove('t_k');
        // $cookieStore.remove('c_no');
        // 融e联 联系商户(五月版不做！！！！)
        $scope.hidden = true;
        // $scope.sid = 90000002;
        // $scope.storeName = '测试';
        // $scope.contactStore = function (para) {
        //     $timeout(function () {
        //         if (ICBCUtil.isElifeAndroid()) {
        //             elife_app.GetNativeFunctionAndroid({'keyword':'chatWithStore','storeUserId': para.sid,'storeName':para.storeName});
        //         } else if (ICBCUtil.isElifeIos()){
        //             ICBCUtil.nativeGetConfig({
        //                 'key': 'chatWithStore',
        //                 'dataString' : '{"storeName":"'+ encodeURI(para.storeName)+'","storeUserId":"'+encodeURI(para.sid) +'"}',
        //                 'callBack': ""
        //             });
        //         }
        //     },0);
        // };
        $scope.validateLogin = function (url) {
            if (API.isLogin()) {
                if (url) {
                    location.hash = url;
                } else {
                    var new_url = document.getElementById("comment").getAttribute("link-data");
                    location.hash = new_url;
                }
            } else {
                API.doLogin();
            }
        };
        $scope.errComment = function () {
            if (!API.isLogin()) {
                API.doLogin();
                return;
            } else {
                SharedState.turnOn("error_modal");
            }
        };
    }]);