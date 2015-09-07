elife.controller('DiscountCategoriesCtrl', [
    'API',
    '$scope',
    function (API, $scope) {
        $scope.showList = [];
        $scope.hotCategories = [];
        $scope.allCategories = [];
        $scope.showCategoriesMore = {};

        // 获取商户优惠热门分类
        API.getHotIndustry({
            s_row: 0,
            e_row: 8
        }).then(function(data) {
            console.log("获取商户优惠热门分类");
            console.log(data);
            $scope.hotCategories = data;
        }, function(data) {
            console.log("获取商户优惠热门分类失败");
            console.log(data);
        });

        // 获取商户优惠所有行业大小类
        API.getIndustryAllByCityCode().then(function(data) {
            console.log("获取商户优惠所有行业大小类");
            console.log(data);
            $scope.allCategories = data;
            data.map(function(d) {
                $scope.showCategoriesMore[d.largeCode] = false;
            });
        }, function(data) {
            console.log("获取商户优惠所有行业大小类失败");
            console.log(data);
        });
    }
]);