elife.controller('MyCustomersCtrl', ['$scope', '$routeParams', '$rootScope', 'API', function ($scope, $routeParams, $rootScope, API){
  $scope.gpp_actId = $routeParams.gppActId;
  $scope.gpp_code = $routeParams.gppCode;
  $scope.gpp_status = $routeParams.gppStatus;
  // 返回按钮
  elife_app.SetReturnBtn();

  // 导航栏
  //$scope.active = 1;
  //发送团购券check按钮
  //$scope.send_check = -1;
   //退款check按钮
  $scope.drawbackCheck=[false,false];
  
  //选择器初始值
  $scope.num = 1;
  $scope.price = 17;
  //状态信息
  $scope.status = ['','待消费','已消费','','已退款','','过期已退款','','','','待付款'];
  //我的团购券详情
  API.getMyGroupDetail({
    groupActId : $scope.gpp_actId
  }).then(function(data){
    console.log(data);
    $scope.myGroupDetail = data;
    if(data.gpp_status === "1" || data.gpp_status === "10")
        data.isRed = true;
      else
        data.isRed = false;
    data.s_date = data.begin_time.split(" ")[0];
    data.e_date = data.end_time.split(" ")[0];
  }, function(data){
    $scope.toast("请检查网络状况");
    console.error("我的团购详情获取失败：" + data);  
  });

  //团购适用门店
  API.getSuitStoreList({
    'pft_code' : $scope.gpp_actId,
    'type' :  'GROUP'
   }).then(function(data){
    console.log(data);
    $scope.suitList = data;
    $scope.suitStore = data[0];
    //星级
    var stars=[];
    for(var j=0;j<5;j++) {
      if (j+1<=$scope.suitStore.levels)
      {
        stars[j] = {"type":"full"};
      }else if(j - $scope.suitStore.levels < 0)
      {
        stars[j] = {"type":"half"};
      }else {
        stars[j] = {"type" : "gray"};
      }
    }
    $scope.suitStore.levels = stars;
    //商区和行业小类
    $scope.suitStore.bottomContent = '';
    if ($scope.suitStore.district_name1) {
        $scope.suitStore.bottomContent += $scope.suitStore.district_name1;
        $scope.suitStore.bottomContent += '/';
    }
    if ($scope.suitStore.district_name2) {
        $scope.suitStore.bottomContent += $scope.suitStore.district_name2;
        $scope.suitStore.bottomContent += '/';
    }
    if ($scope.suitStore.district_name3) {
        $scope.suitStore.bottomContent += $scope.suitStore.district_name3;
        $scope.suitStore.bottomContent += '/';
    }
    if ($scope.suitStore.small_name1) {
        $scope.suitStore.bottomContent += $scope.suitStore.small_name1;
        $scope.suitStore.bottomContent += '/';
    }
    if ($scope.suitStore.small_name2) {
        $scope.suitStore.bottomContent += $scope.suitStore.small_name2;
        $scope.suitStore.bottomContent += '/';
    }
    if ($scope.suitStore.small_name3) {
        $scope.suitStore.bottomContent += $scope.suitStore.small_name3;
        $scope.suitStore.bottomContent += '/';
    }
    $scope.suitStore.bottomContent = $scope.suitStore.bottomContent.substring(0, $scope.suitStore.bottomContent.length - 1);
   }, function(data){
    $scope.toast("请检查网络状况");
    console.error("我的团购使用门店获取失败：" + data);  
   });

 // 选择器方法
 $scope.Minus= function(){
    if($scope.num>=2){
       $scope.num=  $scope.num-1;
        
    }
  
  };
  $scope.Plus= function(){
    if($scope.num<=99){
       $scope.num=  $scope.num+1;
      
    }
   
  };
  $scope.Total= function(){
    if(isNaN($scope.num)){
      return 0;
    }
    else{
         $scope.total = ($scope.num*$scope.price).toString();
         $scope.total =  "￥"+$scope.total +".00";
        return $scope.total;
    }
  };

  // 自动纠错
  $scope.default= function(event){
    if(isNaN($scope.num)){
      $scope.num = 1;
    }
    event.target.value = $scope.num;
  };
  
}]);