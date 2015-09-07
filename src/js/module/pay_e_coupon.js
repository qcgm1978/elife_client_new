elife.controller('PayECouponCtrl',['$scope','$rootScope', '$routeParams', '$http', '$cookieStore', 'API', 'SharedState', function ($scope,$rootScope, $routeParams, $http, $cookieStore, API, SharedState){
  
  // 返回按钮
  elife_app.SetReturnBtn();
  
  $scope.eCode = $routeParams.code;
  $scope.storeId = $routeParams.store_code;
  
  //列表排序选项开关
  $scope.filterToggle = function(n){
    if(n ===0){
      SharedState.turnOff('listFilter');
    }else{
      var index = SharedState.get('listFilterIndex') || 0;
      if(n === index){
        SharedState.toggle('listFilter');
      }else{
        SharedState.set({listFilterIndex:n});
        SharedState.turnOn('listFilter');
      };
    }
  };

  //2015-05-09
  //TODO 
  //获取我的电子券
  // $http.post($rootScope.baseUrl + '/OFSTCUST/info/showEleTicket.action',{
  //   't_k' : $rootScope.token,
  //   'c_no' : $cookieStore.get('c_no')
  // })
  // .success(function (data) {
  //   console.log(data);
  //   var info = data.data;
  //   console.log(info);
  //   $scope.ECoupons = [];
  //   for (var i=0; i < info.length; i ++){
  //     $scope.ECoupons[i] = {
  //       "Ec_name" : info[i].ec_name,
  //       "Ec_code" : info[i].ec_code,
  //       "Effect_beginDate" : info[i].effect_beginDate.substr(0,10),
  //       "Effect_endDate" : info[i].effect_endDate.substr(0,10),
  //       "Effect_content" : info[i].effect_content,
  //       "Effect_state" : info[i].effect_state
  //     };
  //   }
  // })
  // .error(function(data, status) {
  //     console.error("获取我的电子券失败：" + data);
  //     $scope.toast('请检查网络状况');
  // });

  if($scope.eCode === undefined){ 
    var para = {
      store_code : $scope.storeId
    };
  API.getMyECoupons(para).then(function(data){
    console.log('我的可用电子券获取成功');
    console.log(data);
    var info = data.data;
    if (info === '[]') {
      $scope.noECoupons = '没有可用的电子券';
    }
    $scope.ECoupons = [];
    for (var i=0; i < info.length; i ++){
      $scope.ECoupons[i] = {
        "Ec_name" : info[i].ec_name,                                  // 电子券名称
        "Ec_code" : info[i].ec_code,                                  // 电子券ID
        "Ec_img" : info[i].ec_image_url,                              // 电子券展示图片
        "Ec_type" : info[i].pft_type,                                 // 通用券or定向券？？？
        "Ec_invalid" : info[i].invalid_status,                        // 电子券是否可用
        "Effect_beginDate" : info[i].effect_beginDate.substr(0,10),   // 电子券有效起始日期
        "Effect_endDate" : info[i].effect_endDate.substr(0,10),       // 电子券有效截止日期
        "Effect_state" : info[i].effect_state,                        // 电子券状态
        "Effect_price" : info[i].effect_price                         // 电子券单价
      };
    }
  }, function(data){
    console.log('我的电子券获取失败: ' + data);
    $scope.toast('请检查网络状况');
  });
  }


 if($scope.eCode !== undefined){
//获取电子券适用门店
  API.getSuitStoreList({
  'pft_code' : $scope.eCode,
  'type' : 'ETC'
}).then(function(data){
  console.log('获取电子券适用门店成功');
  console.log(data);
    $scope.businessStoreList = data;
    if(data){
      console.log("sss");
        for(var i = 0; i < $scope.businessStoreList.length; i++){
           $scope.businessStoreList[i].discount_role =  API.resolveDiscountRole($scope.businessStoreList[i].discount_role); 
            $scope.businessStoreList[i].new_discount_role=[];
         for(var z=0;z<$scope.businessStoreList[i].discount_role.length;z++){
            if($scope.businessStoreList[i].discount_role[z]===' icon_yi'){
                  $scope.businessStoreList[i].new_discount_role.push(' icon_yi');
            }
             if($scope.businessStoreList[i].discount_role[z]===' icon_fen'){
                  $scope.businessStoreList[i].new_discount_role.push(' icon_fen');
            }
             if($scope.businessStoreList[i].discount_role[z]===' icon_shan'){
                  $scope.businessStoreList[i].new_discount_role.push(' icon_shan');
            }
             if($scope.businessStoreList[i].discount_role[z]===' icon_ji'){
                  $scope.businessStoreList[i].new_discount_role.push(' icon_ji');
            }
           
         }
          var stars=[];
          for(var j=0;j<5;j++)
          {
            if (j+1<=$scope.businessStoreList[i].levels)
            {
              stars[j] = {"type":"full"};
            }else if(j - $scope.businessStoreList[i].levels < 0)
            {
              stars[j] = {"type":"half"};
            }else {
              stars[j] = {"type" : "gray"};
            }
          }
          $scope.businessStoreList[i].levels = stars;

         $scope.businessStoreList[i].bottomContent = '';
      if(($scope.businessStoreList[i].bottomContent.length <= 18) && $scope.businessStoreList[i].district_name1 && $scope.businessStoreList[i].district_name1 !== ''){
        $scope.businessStoreList[i].bottomContent += $scope.businessStoreList[i].district_name1;
        $scope.businessStoreList[i].bottomContent += '/';
      }
      if(($scope.businessStoreList[i].bottomContent.length <= 18) && $scope.businessStoreList[i].district_name2 && $scope.businessStoreList[i].district_name2 !==''){
         $scope.businessStoreList[i].bottomContent += $scope.businessStoreList[i].district_name2;
        $scope.businessStoreList[i].bottomContent += '/';
      }
      if(($scope.businessStoreList[i].bottomContent.length <= 18) && $scope.businessStoreList[i].district_name3 && $scope.businessStoreList[i].district_name3 !==''){
         $scope.businessStoreList[i].bottomContent += $scope.businessStoreList[i].district_name3;
        $scope.businessStoreList[i].bottomContent += '/';
      }
       $scope.businessStoreList[i].bottomContent= $scope.businessStoreList[i].bottomContent.substring(0, $scope.businessStoreList[i].bottomContent.length-1)+' ';
      if(($scope.businessStoreList[i].bottomContent.length <= 18) && $scope.businessStoreList[i].small_name1 && $scope.businessStoreList[i].small_name1 !==''){
        $scope.businessStoreList[i].bottomContent += $scope.businessStoreList[i].small_name1;
         $scope.businessStoreList[i].bottomContent += '/';
      }
      if(($scope.businessStoreList[i].bottomContent.length <= 18) && $scope.businessStoreList[i].small_name2 && $scope.businessStoreList[i].small_name2 !==''){
        $scope.businessStoreList[i].bottomContent += $scope.businessStoreList[i].small_name2;
         $scope.businessStoreList[i].bottomContent += '/';
      }
      if(($scope.businessStoreList[i].bottomContent.length <= 18) && $scope.businessStoreList[i].small_name3 && $scope.businessStoreList[i].small_name3 !==''){
        $scope.businessStoreList[i].bottomContent += $scope.businessStoreList[i].small_name3;
         $scope.businessStoreList[i].bottomContent += '/';
      }
       $scope.businessStoreList[i].bottomContent= $scope.businessStoreList[i].bottomContent.substring(0, $scope.businessStoreList[i].bottomContent.length-1);
       $scope.businessStoreList[i].showdistance=$scope.businessStoreList[i].distance+$scope.businessStoreList[i].unit;
       
      }          
        
      }
},function(data){
 console.log('获取电子券适用门店失败');
  console.log(data);
});
}

//传递电子卷的id和价格
$scope.pay_e = function(code, price){
  console.log('SS');
	$rootScope.ec_code = code;
	$rootScope.ec_price = price;
  console.log(code);
  console.log(price);
	history.back();
}; 

}]);