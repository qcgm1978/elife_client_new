elife.controller('SearchFilterCtrl', ['$scope', function ($scope) {
    $scope.isRight=true;
    $scope.isSlide=true;
	$scope.switch_btn=false;
	
	$scope.check_icbc=false;
	$scope.check_discount=false;
	$scope.check_reserve=true;


	$scope.map_toggle = function(){
		if($scope.switch_btn===true){
			$scope.switch_btn=false;
			$scope.isRight=false;
			$scope.isSlide=false;
		}
		else{
			$scope.switch_btn=true;
			$scope.isRight=true;
			$scope.isSlide=true;
		}
	};
	//是否选择所有
	$scope.check_toggle_all = function(){
    $scope.check=($scope.check_reserve)&&($scope.check_icbc)&&($scope.check_discount);
		if($scope.check===true){
      // console.log($scope.check);
			$scope.check_icbc=false;
			$scope.check_discount=false;
			$scope.check_reserve=false;
		}
		else{
			// console.log($scope.check);
			$scope.check_icbc=true;
			$scope.check_discount=true;
			$scope.check_reserve=true;
		}

	};
	

    
}])
.controller("Ctrl", ['$scope', function($scope) {

	$scope.slider = {
		left: {
			value: 100
		},
		middle: {
			value: 200
		},
		right: {
			value: 700
		}
	};
}]);

