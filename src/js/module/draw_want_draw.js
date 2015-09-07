elife.controller('WantDrawCtrl',['$scope','$rootScope','SharedState',function ($scope,$rootScope,SharedState) {
$scope.detail={
	phone_url : "images/draw_moble.png",
	phoneName : "ipad air2",
	number : "以参与1300人",
	time : "剩余29分25秒",
	introduce : "ipad air2 ipad air2 ipad air2 ipad air2 ipad air2 ipad air2",
	rule : "ipad air2 ipad air2 ipad air2 ipad air2 ipad air2 ipad air2 ipad air2"
};
	$rootScope.Ui.turnOff('test_modal');
}]);