elife.controller('TestCtrl', ['$scope','$http', function ($scope, $http) {
   $scope.aa="11";

      $http({
          method: 'post',
          url: 'http://115.28.109.25/h5_json/home/banner.php',
          data: $scope.aa,
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function(data, status, headers, config) {
          if(data.success){
               $scope.img = data;
               console.log("aaa");
               console.log(data);
          }
        });


}]);