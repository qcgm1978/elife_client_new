elife.controller('PayOrderCtrl',['$scope','$timeout','$http', '$cookieStore', '$routeParams', 'API', '$rootScope', function ($scope,$timeout,$http, $cookieStore,$routeParams, API, $rootScope){

  $scope.ec_code=null;
  $scope.ec_code=$rootScope.ec_code || 0;
  $scope.ec_price=$rootScope.ec_price || null;
  $scope.baseUrl = $rootScope.baseUrl;
  console.log($scope.ec_code);
  console.log($scope.ec_price);

  $scope.entry = $routeParams.entry;
	$scope.tokenNo = $cookieStore.get('t_k');
  $scope.channelId = $cookieStore.get('c_no');
  $scope.storeId = $routeParams.store_id;
  $scope.ecoupon_id = ''; //电子券默认为空
  $scope.tranWay = $routeParams.tran_way; // tran_way(1:商户二维码，2:订单二维码，3:普通买单，-1：二次支付二维码订单)
  $scope.orderAmt = $routeParams.order_amt;
  $scope.orderId = $routeParams.order_id;
  $scope.total_money = $routeParams.order_amt;
  // 临时加的
  // $scope.baseUrl = 'http://82.200.109.84:8080';


  // 匹配电子券
  var matchECoupons = function (num,arr) {
    var tArr = [];
    arr.map(function (a) {
      if (parseFloat(a.Effect_price) <= num) {
        tArr.push(a);
      }
    }); 
    var tmp = tArr.sort(function (a,b) {
      return b.Effect_price - a.Effect_price;
    });
    return tmp[0];
  };

  $scope.getEcoupon = function () {
    if (!$scope.total_money) {
      return;
    }
    // $rootScope.toast('正在获取相关电子券信息',500);
      //获取电子券
      // $scope.showEcoupons = true;
    var validReg = /^\d{0,8}\.{0,1}(\d{1,2})?$/;

    if (!validReg.test($scope.total_money)) {
      $rootScope.toast('请输入正确的金额');
      return false;
    }
    var para = {
      store_code : $scope.storeId
    };
    API.getMyECoupons(para).then(function(data){

    if (data.res === '0') {
      // $scope.showEcoupons = true;
      var info = data.data;
      console.log(info);
      
      $scope.ECoupons = [];
      console.log($scope.ECoupons.length);
      if (info === '[]') {
        $scope.noECoupons = '没有可用的电子券';
        return false;
      }
      for (var i=0; i < info.length; i ++){
        $scope.ECoupons[i] = {
          "Ec_name" : info[i].ec_name,
          "Ec_code" : info[i].ec_code,
          "Ec_img" : info[i].ec_image_url,
          "Ec_type" : info[i].pft_type,
          "Ec_invalid" : info[i].invalid_status,
          "Effect_beginDate" : info[i].effect_beginDate.substr(0,10),
          "Effect_endDate" : info[i].effect_endDate.substr(0,10),
          "Effect_content" : info[i].effect_content,
          "Effect_state" : info[i].effect_state,
          "Effect_price" : info[i].effect_price
        };
      }
 
      $scope.noECoupons = '没有合适的电子券';
      // 选出最合适的电子券
      $scope.ecoupon = $scope.ec_price || matchECoupons($scope.total_money, $scope.ECoupons);
      $scope.ecoupon_code = $scope.ec_code || ecoupon.Ec_code;
    } else {
      //alert('获取电子券信息失败' + JSON.stringify(data));
    }
    
    }, function(data){
      console.log('我的电子券获取失败: ' + data);
      $scope.toast('请检查网络状况');
    });
  };
  
  // 清除购买类型
  $cookieStore.get('payType') && ($cookieStore.remove('payType'));

  /*
   *  入口：
   *  1：商户详情 -- 买单按钮
   *  2：二次支付
   *  3：团购支付
   *  4：二维码
   */

  switch ($routeParams.entry) {
    case '1' :
    console.log('买单');
    $('#payForm').prop('action', $scope.baseUrl + '/OFSTCUST/order/appOrder.action');
    // 买单无订单号
    // $scope.orderId = $routeParams.order_id === 'undefined' ? '' : $routeParams.order_id;
    $cookieStore.put('payType','1');
    break;

    case '2' :
    console.log('二次支付');
    $scope.isSecondOrder = true;
    $('#payForm').prop('action', $scope.baseUrl + '/OFSTCUST/order/secondOrder.action');
    if ($scope.tranWay === '1') {
      $cookieStore.put('payType','1');
    } else if ($scope.tranWay === '-1') {
      $cookieStore.put('payType','3');
    }
    break;

    // 团购支付已分离，但是入口标志 ‘3’ 请不要使用
    // case '3' :
    // console.log('团购支付');
    // $('#payForm').prop('action', $scope.baseUrl + '/OFSTCUST/order/gppOrder.action');
    // break;

    case '4' : 
    console.log('二维码');
    $scope.getEcoupon();
    $scope.isQROrder = $routeParams.tran_way === '2' ? true : false;
    if ($routeParams.tran_way === '1') {  // 商户二维码
      $scope.total_money = '';
    }
    $cookieStore.put('payType','3');
    $('#payForm').prop('action', $scope.baseUrl + '/OFSTCUST/order/appOrder.action');

  } 
/*
  // 来源：从商户详情点击买单按钮后 或者 点击我的订单中的未支付的订单
  $scope.order_id=$routeParams.order_id === 'undefined' ? '' : $routeParams.order_id;
  $scope.store_id=$routeParams.store_id;
  console.log($scope.order_id);
  console.log($scope.store_id);
  if ($routeParams.money) {
    $scope.money = true;
    $scope.total_money = $routeParams.money;
    $scope.qrType = '2';
  }

  // 来源：从扫一扫扫完之后
  if ($routeParams.scanData) {
    $routeParams.scanData = JSON.parse($routeParams.scanData);
    var data = $routeParams.scanData.data;
    $scope.orderAmt = data.orderamt;
    $scope.qrType = data.qrtype;
    $scope.orderId = data.orderid;
    $scope.storeId = data.shopid;
    if ($scope.orderAmt) {
      var money = $scope.orderAmt;
      console.log(money);
      $scope.total_money = money;
    }
  }

  $scope.storeId = $scope.store_id || $scope.storeId;
  $scope.orderId = $scope.order_id || $scope.orderId;
  $scope.payAmt = $scope.total_money ? $scope.total_money - $scope.ec_price : 0;
  $scope.tranWay = $scope.qrType || '3';

  if ($cookieStore.get('tranWay')) {
    $cookieStore.remove('tranWay');
  }
  $cookieStore.put('tranWay',$scope.tranWay);
*/
  API.getEWMDetial({
    'order_id' : $scope.order_id
  }).then(function(data){
    console.log('获取订单详情成功！');
    console.log(data);
    $scope.list=data.data;
    console.log($scope.list);
  },function(data){
    $scope.toast('请检查网络状况');
  });
  
  $scope.clearScope=function(){
    $rootScope.ec_code=null;
    $rootScope.ec_price=0;
    history.back();
  };





  // 临时加上的
  // $scope.tokenNo = 'e6ab84b6f1994addbb9c46c4a4e31b5f';
  // $scope.channelId = "312";
  // $scope.storeId = '02000000046'; 

  // $('#payForm').prop('action',$scope.baseUrl + '/OFSTCUST/order/appOrder.action');http://elife.icbc.com.cn
  // 买单、二维码
  // $('#payForm').prop('action', 'http://82.200.109.84:8080/OFSTCUST/order/appOrder.action');
  // 团购
  // $('#payForm').prop('action', 'http://82.200.109.84:8080/OFSTCUST/order/gppOrder.action');
  // 二次支付
  // $('#payForm').prop('action', 'http://82.200.109.84:8080/OFSTCUST/order/secondOrder.action');
  // $('#payForm').prop('action', $rootScope.baseUrl + '/OFSTCUST/order/appOrder.action');

  $('#payForm').on('submit',function (e) {

      var tMoney = $('#totalMoney').val();

      $('#payAmt').val($scope.ecoupon ? tMoney - $scope.ecoupon.Effect_price : tMoney);

      var payAmt = $('#payAmt').val();

      if (tMoney === '0' || parseFloat(tMoney) === 0 ||  tMoney === '') {
        $rootScope.toast('请输入金额');
        return false;
      }

      var validReg = /^\d{0,8}\.{0,1}(\d{1,2})?$/;

      if (!tMoney || !payAmt || (parseFloat(tMoney) - $scope.ec_price < 0) || !validReg.test(tMoney)) {
        $rootScope.toast('请输入正确的金额');
        return false;
      }

     $('#totalAmt').val(tMoney);
      var obj = {
        t_k : $('#t_k').val(),
        c_no : $('#c_no').val(),
        store_code : $('#store_code').val(),
        order_id : $('#order_id').val(),
        pay_amt : $('#payAmt').val(),
        tran_way : $('#tran_way').val(),
        total_amt : $('#totalAmt').val(),
        ecoupon_id : $('#ecoupon_id').val()
      };

  });

  $scope.submitOrder = function () {
    $('#payForm').trigger('submit');
  };


}]);