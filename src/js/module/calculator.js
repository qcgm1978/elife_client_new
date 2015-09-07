elife.controller('Calculator', ['$scope', function ($scope){
      

  // 选择器方法
  $scope.Minus= function(n){
    if($scope.num>=n){
       $scope.num=  $scope.num-1;
        $scope.total_price =  $scope.num*$scope.price;
    }
  
  };
  $scope.Plus= function(m){
    if($scope.num<=m){
       $scope.num=  $scope.num+1;
       $scope.total_price =  $scope.num*$scope.price;
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
   $scope.default= function(){
    if(isNaN($scope.num)){
      $scope.num = 1;
    }
  };

}]);