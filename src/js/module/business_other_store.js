elife.controller('OtherStoreInfoCtrl', ['$scope', '$http', '$cookieStore', '$routeParams', 'SharedState', 'API', '$rootScope', function ($scope, $http, $cookieStore, $routeParams, SharedState, API, $rootScope) {
    $scope.imgBaseUrl = $rootScope.imgBaseUrl;
    // console.log('???????????????');
    // console.log( $scope.imgBaseUrl);
    $scope.store_code = $routeParams.id;



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
        para.parent_store_code = $scope.store_code;
       

        API.getOtherStores(para).then(function (data) {
        console.log('其他门店信息');
        console.log(data);
            if ($scope.load_timer) {
              $timeout.cancel($scope.load_timer);
            }
             var length1 = $scope.list.length;
                 data = data.data;
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
                    console.log("其他门店信息");
                    console.log($scope.list);
                     
                }
                $scope.e_row = $scope.list.length;
                $scope.loading = false;
                $scope.mark = false;
                $scope.otherStores = $scope.list;
    }, function (data) {
        $scope.toast("请检查网络状况");
    });
    };
    $scope.getList();

    // API.getOtherStores({'parent_store_code': $scope.store_code}).then(function (data) {
    //     console.log('其他商户');
    //     console.log(data);
    //     $scope.otherStores = data.data;
       
    //     if ($scope.otherStores.length > 0) {
           
    //         $scope.noResultlmg = false ;
    //         for (var i = 0; i < $scope.otherStores.length; i++) {
    //             $scope.otherStores[i].discount_role = API.resolveDiscountRole($scope.otherStores[i].discount_role);
    //             var stars = [];
    //             for (var j = 0; j < 5; j++) {
    //                 if (j + 1 <= $scope.otherStores[i].levels) {
    //                     stars[j] = {"type": "full"};
    //                 } else if (j - $scope.otherStores[i].levels < 0) {
    //                     stars[j] = {"type": "half"};
    //                 } else {
    //                     stars[j] = {"type": "gray"};
    //                 }
    //             }
    //             $scope.otherStores[i].levels = stars;
    //             $scope.otherStores[i].bottomContent = '';
    //             if (($scope.otherStores[i].bottomContent.length <= 18) && $scope.otherStores[i].district_name1 && $scope.otherStores[i].district_name1 !== '') {
    //                 $scope.otherStores[i].bottomContent += $scope.otherStores[i].district_name1;
    //                 $scope.otherStores[i].bottomContent += '/';
    //             }
    //             if (($scope.otherStores[i].bottomContent.length <= 18) && $scope.otherStores[i].district_name2 && $scope.otherStores[i].district_name2 !== '') {
    //                 $scope.otherStores[i].bottomContent += $scope.otherStores[i].district_name2;
    //                 $scope.otherStores[i].bottomContent += '/';
    //             }
    //             if (($scope.otherStores[i].bottomContent.length <= 18) && $scope.otherStores[i].district_name3 && $scope.otherStores[i].district_name3 !== '') {
    //                 $scope.otherStores[i].bottomContent += $scope.otherStores[i].district_name3;
    //                 $scope.otherStores[i].bottomContent += '/';
    //             }
    //             $scope.otherStores[i].bottomContent = $scope.otherStores[i].bottomContent.substring(0, $scope.otherStores[i].bottomContent.length - 1) + ' / ';
    //             if (($scope.otherStores[i].bottomContent.length <= 18) && $scope.otherStores[i].small_name1 && $scope.otherStores[i].small_name1 !== '') {
    //                 $scope.otherStores[i].bottomContent += $scope.otherStores[i].small_name1;
    //                 $scope.otherStores[i].bottomContent += '/';
    //             }
    //             if (($scope.otherStores[i].bottomContent.length <= 18) && $scope.otherStores[i].small_name2 && $scope.otherStores[i].small_name2 !== '') {
    //                 $scope.otherStores[i].bottomContent += $scope.otherStores[i].small_name2;
    //                 $scope.otherStores[i].bottomContent += '/';
    //             }
    //             if (($scope.otherStores[i].bottomContent.length <= 18) && $scope.otherStores[i].small_name3 && $scope.otherStores[i].small_name3 !== '') {
    //                 $scope.otherStores[i].bottomContent += $scope.otherStores[i].small_name3;
    //                 $scope.otherStores[i].bottomContent += '/';
    //             }
    //             $scope.otherStores[i].bottomContent = $scope.otherStores[i].bottomContent.substring(0, $scope.otherStores[i].bottomContent.length - 1);
    //             $scope.otherStores[i].showdistance = $scope.otherStores[i].distance + $scope.otherStores[i].unit;
    //         }
    //     }
    //     else{
    //         console.log("无其他商户");
    //         $scope.noResultlmg = true ;
    //     }
    // }, function (data) {
    //     console.log('获取其他商户失败');
    //     $scope.toast('请检查网络状况');
    // });

    





}]);