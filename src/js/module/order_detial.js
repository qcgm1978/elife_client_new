elife.controller('OrderDetailCtrl',['$scope','$http', '$cookieStore', '$routeParams', 'API', '$rootScope', function ($scope,$http, $cookieStore,$routeParams, API, $rootScope){
	
   // 返回按钮
  elife_app.SetReturnBtn();
	
  console.log('SDDDDSSSSSS');
  $scope.order_id=$routeParams.order_id;
  $scope.store_id=$routeParams.store_id;
  console.log($scope.order_id);
  console.log($scope.store_id); 
  
   API.getEWMDetial({
    'order_id' : $scope.order_id
  }).then(function(data){
    console.log('获取订单详情成功！');
    $scope.order_detial=data.data;  
    console.log($scope.order_detial);
  },function(data){
    $scope.toast('请检查网络状况');
  });
	
  }]);