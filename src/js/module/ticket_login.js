elife.controller('TicketLoginCtrl', ['$scope', '$location','$http', '$routeParams', 'API', '$cookieStore', '$rootScope', function ($scope,$location, $http, $routeParams, API, $cookieStore, $rootScope) {
    $scope.ticket = $routeParams.ticket;
    $scope.prefixUrl = location.href.match(/.*(?=\/ticket)/);
    $scope.originUrl = $scope.prefixUrl + '/home/index';
    API.loginByTicket({
        'ticket': $scope.ticket
    }).then(function (data) {
        //TODO 请求成功的处理 设置cookie和location.href
        console.log(data);
        if (data.res === '0') {
            $cookieStore.put('t_k', data.data.tokenNo);
            var url = data.url;
            url = url.split('#')[1];
            $location.path(url).replace();
            // 测试用
            //window.location.href = "192.168.2.35:8080/dist/#/home/index";
        } else {
            console.error('获取token失败！' + data.res);
        }
    }, function (data) {
        //TODO 请求失败的处理 未定
    });
}]);