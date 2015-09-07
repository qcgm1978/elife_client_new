elife.controller('specialOfferCtrl', ['$scope', '$timeout', '$cookieStore', '$http', 'API', function($scope, $timeout, $cookieStore, $http, API){

  // API.getMoreSpecialOffer({
  //   count: 20
  // }).then(function(data){
  //     $scope.merchantsList = data.data.merchants_list;
  //     $scope.groupList = data.data.group_list;
  //     $scope.bankList = data.data.bank_list;
  // }, function(data){
  //   console.error("精选优惠页面获取失败：" + data);
  // });
elife_app.SetReturnBtn();
//更多精选优惠
  API.getMoreSpecialOffer({}).then(function(data){
    console.log("更多精选优惠");
    console.log(data);
    $scope.merchantsList = data;
    //$scope.merchantsList.info=
  }, function(data){
    console.error("更多精选优惠获取失败：" + data);
    $scope.toast("请检查网络状况");
  });


    // $scope.merchantsList = [
    //     {
    //         "pft_code": "111111",
    //         "image_url": "",
    //         "title": "商户优惠标题",
    //         "pft_type": "满2000减500",
    //         "buss_area_code": "110100",
    //         "buss_area_name": "海淀区",
    //         "small_code": "11111",
    //         "small_name": "家常菜",
    //         "view_count": "17",
    //         "distance": "12"
    //     },
    //     {
    //         "pft_code": "111111",
    //         "image_url": "",
    //         "title": "商户优惠标题",
    //         "pft_type": "满2000减500",
    //         "buss_area_code": "110100",
    //         "buss_area_name": "海淀区",
    //         "small_code": "11111",
    //         "small_name": "家常菜",
    //         "view_count": "17",
    //         "distance": "12"
    //     }
    // ];

    // $scope.groupList = [
    //     {
    //         "group_code": "111111",
    //         "group_image_url": "",
    //         "group_title": "团购优惠标题",
    //         "group_pft": "代金券",
    //         "old_price": "200",
    //         "n_price": "1",
    //         "buy_count": "2000",
    //         "distance": "700"
    //     },
    //     {
    //         "group_code": "111111",
    //         "group_image_url": "",
    //         "group_title": "团购优惠标题",
    //         "group_pft": "代金券",
    //         "old_price": "200",
    //         "n_price": "1",
    //         "buy_count": "2000",
    //         "distance": "700"
    //     }
    // ];

    // $scope.bankList = [
    //     {
    //         "pft_code": "22222",
    //         "image_url": "",
    //         "title": "工行优惠标题1",
    //         "pft_type": "闪酷卡消费",
    //         "o_price": "300",
    //         "n_price": "200",
    //         "view_count": "2000",
    //         "distance": "800"
    //     },
    //     {
    //         "pft_code": "22222",
    //         "image_url": "",
    //         "title": "工行优惠标题1",
    //         "pft_type": "闪酷卡消费",
    //         "o_price": "300",
    //         "n_price": "200",
    //         "view_count": "2000",
    //         "distance": "800"
    //     }
    // ];


}]);