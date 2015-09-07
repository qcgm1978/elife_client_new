elife.controller('DiscountInfoCtrl', ['$scope', '$http', '$cookieStore', '$routeParams', 'API', '$rootScope', function ($scope, $http, $cookieStore, $routeParams, API, $rootScope) {
    $scope.toast = $rootScope.toast;
    var KEY_COMMENT_IMG_LIST = "commentImgList";
    
    $scope.id = $routeParams.id;
    $scope.isbank = $routeParams.bank;
    $scope.code = $routeParams.code;
    $scope.bankInfo = {};
    if ($scope.isbank === 'bank') {
        //银行优惠
        // 获取银行优惠详情
        API.getBankDiscountInfo({
            'bank_code': $scope.id
        }).then(function (data) {
            console.log("银行优惠详情");
            console.log(data);
            //var bankInfo = data.data;
            $scope.bankInfo = data.data;
            $scope.bankInfo.fav_status = $scope.bankInfo.fav_status || 0;
            //test code
            //$scope.bankInfo.content='<a>link</a>' +
            //    '\n'+
            //    '<br>break line';
            $scope.bankInfo.content = API.replaceBreakline($scope.bankInfo.content);
            $scope.bankInfo.use_explain = API.replaceBreakline($scope.bankInfo.use_explain);

        }, function (data) {
            $scope.toast("请检查网络状况");
            console.error("银行优惠详情获取失败：" + data);
        });
        API.getSuitStoreList({
            'pft_code': $scope.id,
            'type': 'BANK'
        }).then(function (data) {
            $scope.bankStoreList = API.getStoreData(data, $scope);
            console.log("适用门店列表");
            console.log($scope.bankStoreList);

        }, function (data) {
            $scope.toast("请检查网络状况");
        });
        //获取网友点评
        API.getComments({
            's_row': 0,
            'e_row': 1,
            'cmtType': 'Bank',
            'evaTargetCode': $scope.id
        }).then(function (data) {
            console.log("点评列表");
            console.log(data);
            $scope.count = data.count;
            if ($scope.count > 0) {
                $scope.commentList = data.review_list[0];
                console.log($scope.commentList);
                if ($scope.commentList.review_content) {
                    $scope.commentList.longEnough = $scope.commentList.review_content.length > 65 ? true : false;
                    $scope.commentList.content = $scope.commentList.review_content.substr(0, 65);
                    $scope.commentList.more = $scope.commentList.review_content.substr(65, $scope.commentList.review_content.length);
                }
                //设置展示的星级
                var stars = [];
                for (var j = 0; j < 5; j++) {
                    if (j + 1 <= $scope.commentList.level) {
                        stars[j] = {"type": "full"};
                    } else if (j - $scope.commentList.level < 0) {
                        stars[j] = {"type": "half"};
                    } else {
                        stars[j] = {"type": "gray"};
                    }
                }
                $scope.stars = stars;
                //设置展示的图片
                $scope.imagelist = $scope.commentList.review_image_list || [];
                $cookieStore.remove(KEY_COMMENT_IMG_LIST);
                $cookieStore.put(KEY_COMMENT_IMG_LIST, $scope.imagelist);
            }
        }, function (data) {
            $scope.toast("请检查网络状况");
            console.error("银行优惠点评列表获取失败：" + data);
        });
    } else {
        //商户优惠
        $scope.id = $routeParams.id;
        //获取商户优惠详情
        $scope.stid = $routeParams.stid;
        API.getBusinessDiscountInfo({
            'pft_code': $scope.code,
            'store_code' : $scope.id
        }).then(function (data) {
            if(data.res!=='0'){
                return;
            }
            $scope.businessInfo = data.data;
            var large_flag = data.data.large_flag || 'other';
            $scope.businessInfo.comment_url = "/discount/comment/"+$scope.code+"/"+$scope.stid+'/'+$scope.id+'/'+large_flag;
        //    todo test data
        //    $scope.businessInfo.pro_promotions_content='<a>link</a>' +
        //            '\n'+
        //        '<br>break line';
            $scope.businessInfo.pro_promotions_content=API.replaceBreakline($scope.businessInfo.pro_promotions_content);
        }, function (data) {
            $scope.toast("请检查网络状况");
            console.error("商户优惠详情获取失败：" + data);
        });
        if (API.isLogin()) {
        } else {
            console.log('未登录');
            $scope.businessInfo = {};
            $scope.businessInfo.fav_status = undefined;
        }
        API.getSuitStoreList({
            'pft_code': $scope.code,
            'type': 'STORE'
        }).then(function (data) {
            console.log('suitable stores1');
            console.log(data);
            $scope.businessStoreList = data;
            if (data) {
                console.log("sss");
                $scope.businessStoreList = API.getStoreData(data, $scope); 

            }
        }, function (data) {
            $scope.toast("请检查网络状况");
        });
        //网友点评
        API.getComments({
            's_row': 0,
            'e_row': 1,
            'cmtType': 'StoreTxt',
            'evaTargetCode': $scope.code
        }).then(function (data) {
            console.log("点评列表1");
            console.log(data);
            $scope.bcount = data.count;
            if ($scope.bcount === '0') {
                return;
            }
            $scope.businessList = data.review_list[0];
            console.log($scope.businessList);
            $scope.businessList.longEnough = $scope.businessList.review_content.length > 65 ? true : false;
            $scope.businessList.content = $scope.businessList.review_content.substr(0, 65);
            $scope.businessList.more = $scope.businessList.review_content.substr(65, $scope.businessList.review_content.length);
            //设置展示的星级
            var stars = [];
            for (var j = 0; j < 5; j++) {
                if (j + 1 <= $scope.businessList.level) {
                    stars[j] = {"type": "full"};
                } else if (j - $scope.businessList.level < 0) {
                    stars[j] = {"type": "half"};
                } else {
                    stars[j] = {"type": "gray"};
                }
            }
            $scope.stars = stars;
            //设置展示的图片
            $scope.imagelist = $scope.businessList.review_image_list || [];
            $cookieStore.remove(KEY_COMMENT_IMG_LIST);
            $cookieStore.put(KEY_COMMENT_IMG_LIST, $scope.imagelist);
        }, function (data) {
            $scope.toast("请检查网络状况");
            console.error("商户优惠点评列表获取失败：" + data);
        });
    }
    //收藏商户(文本)优惠
    $scope.addBusinessFavor = function () {
        console.log("收藏商户优惠");
        if (!API.isLogin()) {
            API.doLogin();
        } else {
            if ($scope.businessInfo.fav_status == "1") {
                //var code = $routeParams.id + "#1";
                API.deleteDiscountFavor({store_codes: $scope.code + "#1"}).then(function (data) {
                    console.log(data);
                    if (data.res === '0') {
                        $scope.businessInfo.fav_status = "0";
                        $scope.toast("取消收藏成功");
                    }
                    if (data.res === '1000002') {
                        $scope.businessInfo.fav_status = "0";
                        $scope.toast("取消收藏失败");
                    }
                }, function (data) {
                    $scope.toast("请检查网络状况");
                });
            } else {
                API.addBusinessTextFavor({
                    'pft_code': $scope.code,
                    'store_code' : $scope.id
                }).then(function (data) {
                    console.log('收藏商户');
                    console.log(data);
                    if (data.res === "0") {
                        $scope.businessInfo.fav_status = "1";
                        $scope.toast("收藏成功");
                    }
                    if (data.res === "2000002") {
                        $scope.businessInfo.fav_status = "1";
                        $scope.toast("您已经收藏过");
                    }
                }, function (data) {
                    console.log('收藏商户失败');
                    $scope.toast("请检查网络状况");
                });
            }
        }
    };
    // 收藏银行优惠
    $scope.addBankFavor = function () {
        console.log($scope.bankInfo);
        if (!API.isLogin()) {
            API.doLogin();
        } else {
            if ($scope.bankInfo.fav_status == "1") {
                //var code = $routeParams.id + "#2";
                API.deleteDiscountFavor({store_codes: $scope.id + "#2"}).then(function (data) {
                    console.log(data);
                    if (data.res === '0') {
                        $scope.bankInfo.fav_status = "0";
                        $scope.toast("取消收藏成功");
                    }
                    if (data.res === '2000002') {
                        $scope.bankInfo.fav_status = "0";
                        $scope.toast("您已成功取消收藏");
                    }
                }, function (data) {
                    $scope.toast("请检查网络状况");
                });
            } else {
                API.addBankCountFavor({
                    'b_code': $routeParams.id
                }).then(function (data) {
                    console.log("收藏银行优惠详情");
                    console.log(data.res);
                    if (data.res === '0') {
                        $scope.toast("收藏成功");
                        $scope.bankInfo.fav_status = '1';
                    }
                    if (data.res === '2000002') {
                        $scope.toast("您已经收藏过");
                        $scope.bankInfo.fav_status = '1';
                    }
                }, function (data) {
                    $scope.toast("请检查网络状况");
                });
            }
        }
    };
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
}]);
elife.controller('DiscountStoreListCtrl', ['$scope', '$http', '$cookieStore', '$routeParams', 'API', '$rootScope', function ($scope, $http, $cookieStore, $routeParams, API, $rootScope) {
    $scope.toast = $rootScope.toast;
    // 返回按钮
   
    $scope.ptf_code = $routeParams.ptf_code;
    $scope.type = $routeParams.type;
    $scope.mark = false;
    //获取文本优惠适用门店
    // API.getSuitStoreList({
    //     'pft_code': $scope.ptf_code,
    //     'type': $scope.type
    // }).then(function (data) {
    //     console.log('获取适用门店');
    //     console.log(data);
    //     $scope.businessStoreList = API.getStoreData(data, $scope);
    // }, function (data) {
    //     $scope.toast("请检查网络状况");
    // });



       $scope.loadingMore = true;
        $scope.list = [];
        $scope.e_row = 0;
        $scope.page_size = 9;

    $scope.showLoading = function () {
      $scope.mark = true;
      $scope.loadingMore = true;
    };

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
        para.pft_code = $scope.ptf_code;
        para.type = $scope.type;

        API.getSuitStoreList(para).then(function (data) {
        console.log('获取适用门店');
        console.log(data);
            if ($scope.load_timer) {
              $timeout.cancel($scope.load_timer);
            }
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
                   $scope.isEmpty = true;
                }
                else{
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
                        // $scope.list[i].distance /= 1000;
                        // $scope.list[i].distance = $scope.list[i].distance.toFixed(1);
                        $scope.list[i].icons = API.resolveDiscountRole($scope.list[i].discount_role);
                        $scope.list[i].new_icons = [];
                        $scope.list[i].PRStyle = {paddingRight : $scope.list[i].icons.length * 18 + 'px'};
                        for (var z = 0; z < $scope.list[i].icons.length; z++) {
                            API.loopRoleIcons($scope, i, z);
                        }
                        $scope.list[i].new_icons = API.removeEmptyArrEleAndReverse($scope.list[i].new_icons);
                        $scope.list[i].showdistance = $scope.list[i].distance + $scope.list[i].unit;
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
                        $scope.list[i].bottomContent = $scope.list[i].bottomContent.substring(0, $scope.list[i].bottomContent.length - 1) + ' ';
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
                    }
                    console.log($scope.list);
                     
                }
                $scope.e_row = $scope.list.length;
                $scope.loading = false;
                $scope.mark = false;
                $scope.businessStoreList = $scope.list;
               

              

    }, function (data) {
        $scope.toast("请检查网络状况");
    });
    };
    $scope.getList();
}]);
