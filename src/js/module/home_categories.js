elife.controller('HomeCategoriesCtrl', ['$scope', '$http', '$rootScope', '$cookieStore', 'API', function ($scope, $http, $rootScope, $cookieStore, API) {
    $scope.showList = [];
    elife_app.SetReturnBtn();
    API.getAllType({}).then(function (data) {
        $scope.categoryInfo = data;
        //test / handling
        //$scope.categoryInfo[0].small_industry_list[0].small_name='中式烧烤/烤串/aaa';
        console.log('全部类别');
        console.log($scope.categoryInfo);
    }, function (data) {
        console.error("全部分类获取失败：" + data);
    });
    API.getHotIndustry({}).then(function (data) {
        console.log('热门分类获取成功' + data);
        console.log(data);
        //data[0].small_name += '/test';
        $scope.hotCategoryInfo = data;
    //    test data
    //    $scope.hotCategoryInfo[0].small_name='汤/粥/炖';

    }, function (data) {
        console.error("热门分类获取失败" + data);
    });
    for (i = 0; i < 5; i++) {
        $scope.showList[i] = false;
    }
//商户信息报错中选择商户类型
    $scope.setErrorType = function (small_code, small_name) {
        console.log('商户信息报错');
        // $rootScope.small_code = small_code;
        //  $rootScope.small_name = small_name;
        console.log('SSDS');
        $cookieStore.put('SMALL_CODE', small_code);
        $cookieStore.put('SMALL_NAME', small_name);
        console.log('END');
        history.back();
    };
}]);