elife.controller('ReloadFixCtrl', ['$rootScope','$timeout', function($rootScope,$timeout){
	$rootScope.toast('正在刷新数据',1000);
	history.back();
}]);