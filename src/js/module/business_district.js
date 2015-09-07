elife.controller('BusinessDistrictInfoCtrl', ['$scope', '$rootScope', '$http', '$cookieStore', 'API', function ($scope, $rootScope, $http, $cookieStore, API) {

    // 返回按钮
    elife_app.SetReturnBtn();
    $scope.showItem0 = false;
    $scope.showItem1 = false;
    $scope.subDistrictArray = "";
    API.getAllDistrict({}).then(function (data) {
        $scope.districtInfo = data.data;
        console.log("全部商区");
        console.log($scope.districtInfo);
        for (var i = 0; i < $scope.districtInfo.length; i++) {
            console.log($scope.districtInfo[i].district_name);
            if (!$scope.districtInfo[i].community_list || $scope.districtInfo[i].community_list.length === 0) {
                $scope.districtInfo[i].subRegionContent = '';
            } else if ($scope.districtInfo[i].community_list.length === 1) {
                $scope.districtInfo[i].subRegionContent = $scope.districtInfo[i].community_list[0].community_name + '等';
            } else if ($scope.districtInfo[i].community_list.length === 2) {
                $scope.districtInfo[i].subRegionContent = $scope.districtInfo[i].community_list[0].community_name + '、';
                $scope.districtInfo[i].subRegionContent += $scope.districtInfo[i].community_list[1].community_name;
                $scope.districtInfo[i].subRegionContent += '等';
            } else {
                $scope.districtInfo[i].subRegionContent = $scope.districtInfo[i].community_list[0].community_name + '、';
                $scope.districtInfo[i].subRegionContent += $scope.districtInfo[i].community_list[1].community_name + '、';
                $scope.districtInfo[i].subRegionContent += $scope.districtInfo[i].community_list[2].community_name;
                $scope.districtInfo[i].subRegionContent += '等';
            }
        }
        $scope.topDistrict = data.top_list;
    }, function (data) {
        console.error("商区获取失败：" + data);
    });
    //   // 获取全部商区
    // $http.post('http://223.223.177.38:8082/OFSTCUST/businessdistrict/listDistrict.action',{
    //   't_k' : $rootScope.token,
    //   'c_no' : $cookieStore.get('c_no'),
    //   'Cn_code' : $cookieStore.get('cn_code'),
    //   'city_code' :  $cookieStore.get('city_code')
    // }).success(function (data) {
    //   console.log(data);
    //   console.log($cookieStore.get('cn_code'));
    //   console.log($cookieStore.get('city_name'));
    //   if (data.res == "0") {
    //    $scope.districtInfo = data.data;
    //    console.log($scope.districtInfo);
    //    $scope.topDistrict = data.top_list;
    //   }
    // });
}]);