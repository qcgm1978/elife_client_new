// 团购详情，团购添加页面js
elife.controller('CustomersMoreCtrl', ['$scope','$rootScope','SharedState', '$http', '$cookieStore', '$routeParams','API',function($scope, $rootScope, SharedState, $http, $cookieStore,$routeParams,API){

  $scope.code = $routeParams.code;
  $scope.price = $routeParams.price;
  $scope.gppCode = $routeParams.gppCode;
  $scope.storeId = $routeParams.storeCode;

  $scope.validateLogin = function () {
    if (API.isLogin()) {
      if (!$scope.gppInfoDetail) {
        return false;
      }
      location.hash = '/discount/customers_add_order/' + $scope.storeId + '/' + $scope.gppCode + '/' + $scope.gppInfoDetail.promotions_price;
    } else {
      API.doLogin();
    }
  };
  // 获取团购图文详情
  API.getGppInfoDetail({
    'group_code': $scope.gppCode
  })
 .then(function(data){
   console.log('获取团购优惠详情更多成功');
   $scope.gppInfoDetail = data.data[0];
 },function(data){
   $scope.toast('请检查网络状况');
   console.error('获取团购优惠详情更多失败: ' + data);
 });
}]);