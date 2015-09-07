elife.controller('PayConfirmCtrl', ['$scope','$cookieStore','$location', function($scope,$cookieStore,$location){

	$scope.goList = function () {
		$location.path('/personal/orders').replace();
	};
}]);