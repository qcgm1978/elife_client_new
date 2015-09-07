elife.controller('DistrictListCtrl', ['$scope', '$rootScope','API','$cookieStore', function ($scope, $rootScope,API,$cookieStore) {

$scope.setErrorDistrict = function(code, name){
	// $rootScope.district_code = code;
	// $rootScope.district_name = name;
    $cookieStore.put('DISTRICT_CODE',code);
    $cookieStore.put('DISTRICT_NAME',name);
	history.back();
};

    
 //获取所有城市   
 
     API.getAllDistrict({}).then(function (data) {
        $scope.hotCitys = data.top_list;
        console.log('全部商区');
        console.log(data.data);
        console.log($scope.hotCitys);
        $scope.citys = data.data;
        
        
        console.log('city');
        console.log($scope.citys);
    }, function (data) {
        $scope.toast("请检查网络状况");
        console.error("商区获取失败：" + data);
    });
}]);