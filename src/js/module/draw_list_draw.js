elife.controller('ListDrawCtrl',['$scope','$rootScope','$routeParams','API',function ($scope,$rootScope,$routeParams,API) {

$scope.code = $routeParams.id;
API.submitInfo({
	code: $scope.code,
	if_win: 0
}).then(function(data){
	console.log(data);
	$scope.details = data.data;
	if($scope.details && $scope.details.length > 0){
		$scope.title = $scope.details[0].activityName || '天天抽第365期';
	}else{
		$scope.title = '天天抽第366期';
	}
},function(data){
	console.error('获取中奖名单失败');
	$scope.toast('网络异常');
});
}]);