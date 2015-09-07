// 团购详情，团购添加页面js
elife.controller('CustomersAddOrderCtrl', ['$scope','$rootScope','SharedState', '$http', '$cookieStore', '$routeParams','API',function($scope, $rootScope, SharedState, $http, $cookieStore,$routeParams,API){
  // var customer_code = $routeParams.id;
  
  $scope.code = $routeParams.code;
  $scope.price = $routeParams.price;
  $scope.gppCode = $routeParams.gppCode;

  $scope.num=1;
  $scope.gppCount =1;






 // 选择器方法
 $scope.Minus= function(){
    if($scope.num>=2){
       $scope.num=  $scope.num-1;
        $scope.gppCount = $scope.num; 
    }
  
  };
  $scope.Plus= function(){
    if($scope.num<=99){
       $scope.num = $scope.num+1;
      $scope.gppCount = $scope.num;
    }
   
  };
  $scope.Total= function(){
    if(isNaN($scope.num)){
      return 0;
    }
    else{
         $scope.total = ($scope.num*$scope.price).toString();
         $scope.totalAmt = $scope.total;
         $scope.payAmt = $scope.total - $scope.ec_price;
        return $scope.total;
    }
  };
   $scope.default= function(event){
    if(isNaN($scope.num) || $scope.num <= 0){
      $scope.num = 1;
    }
    // 个数不能含有小数点
    if ($scope.num+''.indexOf('.')) {
    	$scope.num = Math.floor($scope.num);
    }
    $scope.gppCount = $scope.num;
    // console.log(event);
    event.target.value = $scope.num;
  };

  // $('#gppForm').prop('action', 'http://82.200.109.84:8080/OFSTCUST/order/gppOrder.action');
  $('#gppForm').prop('action', $rootScope.baseUrl + '/OFSTCUST/order/gppOrder.action');

  // 清除购买类型
  $cookieStore.get('payType') && ($cookieStore.remove('payType'));
  $cookieStore.put('payType','2');

  // 团购券暂时不支持使用电子券，暂时设置为0，可能以后会支持。
  $scope.ec_price = 0;
  $scope.gppActId = $routeParams.code;
  $scope.totalAmt = $scope.Total();
  $scope.payAmt = $scope.totalAmt - $scope.ec_price;
  $scope.storeId = $routeParams.storeCode;
  $scope.tranWay = '3';
  $scope.tokenNo = $cookieStore.get('t_k');
  $scope.channelId = $cookieStore.get('c_no');
  
  $scope.gppPrice = $scope.price;

  // $scope.tokenNo = 'e6ab84b6f1994addbb9c46c4a4e31b5f';
  // $scope.channelId = "312";

  $('#gppForm').on('submit',function () {
    var tel = $('#userTel').val();
    var validate_mobile = /^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
    if (!tel) {
      $rootScope.toast('请输入手机号码');
      return false;
    }

    if (!validate_mobile.test(tel)||tel.length !== 11) {
      $rootScope.toast('请输入正确的手机号码');
      return false;
    }

  });
  
  $scope.submitOrder= function(){
  	if (!API.isLogin()) {
  		API.doLogin();
  		return;
  	}
   $('#gppForm').trigger('submit');
  };



  /*
if(!$routeParams.gppCode){
 //获取商户团购优惠详情
 API.getGppInfo({
   'group_code' :  $scope.code
 }).then(function(data){
   console.log('获取商户团购优惠详情');
   $scope.gppInfo = data.data[0];
   console.log($scope.gppInfo);
 }, function(data){
    $scope.toast("请检查网络状况");
   console.error("获取商户团购优惠详情失败" + data);
 });   

  



  $scope.validateLogin = function () {
    if (API.isLogin()) {
      if (!$scope.gppInfo) {
        return false;
      }
      location.hash = '/discount/customers_add_order/' + $scope.storeId + '/' + $scope.code + '/' + $scope.gppInfo.n_price;
    } else {
        API.doLogin();
    }
  };

  

 if(!$routeParams.price){
  // API.getBusinessDiscountInfo({
  //   pft_code : customer_code
  // }).then(function(data){
  //   console.log(data);
  //   // $scope.busdisInfo = {
  //   //   fav_status : data.fav_status
  //   // };
  //   $scope.busdisInfo = data.data;
  //   $scope.busdisInfo.fav_status = $scope.busdisInfo.fav_status || 0;
  // },function(data){});
   
  //  // //获取团购适用门店
  //  // API.getSuitStoreList({
  //   //  'pft_code' : $scope.busdisInfo.code,
  //   //  'type' : 'GROUP'
  //  // }).then(function(data){
  //   //     console.log(data);
  //   //     $scope.suitStoreList = data.data[0];
  //   //   }, function(data){
  //   //     $scope.toast("请检查网络状况");
  //   //   });
   
   // 收藏团购
  $scope.addCustomerFavor = function(){
    console.log("收藏商户优惠");
    if($scope.gppInfo.fav_status == "1") {
      API.deleteDiscountFavor({store_codes : $scope.code + "#3"}).then(function(data){
        console.log(data);
        if(data.res === '0'){
          $scope.gppInfo.fav_status = "0";
          $scope.toast("取消收藏成功");
        }
        if(data.res === '2000002') {
          $scope.gppInfo.fav_status = "0";
          $scope.toast("您已成功取消收藏");
        }
      }, function(data){
        $scope.toast("请检查网络状况");
      });
    } else {
      API.addBankCountFavor({
        'Group_code' : $scope.code
      }).then(function(data){
        console.log("收藏商会优惠详情");
        console.log(data.res);
        if(data.res === '0'){
           $rootScope.toast("收藏成功");
           $scope.gppInfo.fav_status = "1";
        }
        if(data.res ==='2000002'){
          console.log("您已经收藏过");
          $rootScope.toast("您已经收藏过");
          $scope.gppInfo.fav_status = "1";
        }
      }, function(data){
        $scope.toast("请检查网络状况");
        console.error("银行优惠详情获取失败：" + data);
      });
    }

  //   $http.post('http://223.223.177.38:8082/OFSTCUST/cuinfo/findCuMoreById.action ',{
  // 't_k' : $rootScope.token,
  // 'c_no' : $cookieStore.get('c_no'),
  // 't_code' : '11'
  // })
  // .success(function (data) {
  //   if(data.res === 0){
  //     console.log("成功");
  //   }
  //   if(data.res === 1000002){
  //     console.log("失败");
  //   }
  //   if(data.res === 1000003){
  //     console.log("缺少参数");
  //   }

  // });
  };
 }
}else{
  
}

*/
}]);