elife.controller('ReviewCommentCtrl', ['$scope','$location','$anchorScroll','$rootScope','$http','$routeParams','$timeout','$cookieStore','API','SharedState', function($scope,$location,$anchorScroll,$rootScope,$http,$routeParams,$timeout,$cookieStore,API,SharedState){
	$scope.isTyping = false;
	$scope.globalStar = 0;
	$scope.tasteStar = 0;
	$scope.environmentStar = 0;
	$scope.serviceStar = 0;
	$scope.loading = false;
	//输入框点击时
	$scope.onCommentFocus = function() {
		$scope.isTyping = true;
		setTimeout(function() {
			// $location.hash('');
			$anchorScroll();
			}, 200);};
			
	$scope.hideAvg = 1;
	$scope.imgList = [];
	// 评价描述-类型1
	$scope.des = ['差', '不满意', '一般', '满意', '非常满意'];
	// 评价描述-类型2
	$scope.des2 = ['差', '一般', '好', '很好', '非常好'];
	$scope.id=$routeParams.id;
	$scope.rank = $routeParams.type;
	//是否显示相应星级标记
	$scope.tasteFlag = 0;
	$scope.environmentFlag = 0;
	$scope.serviceFlag = 0;
	if($scope.rank === 'food') {
		$scope.tasteFlag = 1;
		$scope.environmentFlag = 1;
		$scope.serviceFlag = 1;
		$scope.hideAvg = 0;
	} else if($scope.rank == 'hotel') {
		$scope.environmentFlag = 1;
		$scope.serviceFlag = 1;
		$scope.hideAvg = 0;
	} else if ($scope.rank == 'other') {
		$scope.hideAvg = 0;
	}
	if($routeParams.id.length === 32) {
		API.getCommentDetail({'dcmt_id' : $scope.id}).then(function(data){
			console.log(data);
			$scope.imgList = data.image_list || [];
			$scope.globalStar = data.dcmt_level;
			$scope.comment = data.dcmt_content;
			console.log(data.dcmt_list && data.dcmt_list.ambient);
			if(data.dcmt_list && data.dcmt_list.flavor){
				$scope.tasteStar = data.dcmt_list.flavor;
			}
			if(data.dcmt_list && data.dcmt_list.ambient){
				$scope.environmentStar = data.dcmt_list.ambient;
			}
			if(data.dcmt_list && data.dcmt_list.service){
				$scope.serviceStar = data.dcmt_list.service;
			}
			if(data.avg_price){
				$scope.AvgMoney = data.avg_price;
			}
		},function(data){
			console.error('获取网友点评失败，错误代码:'+data);
		});
	}
	$scope.$watch('comment', function(newVal, oldVal){	
		
		if(newVal && newVal.length>500) {
			$scope.comment = oldVal;
			$rootScope.toast('您的评价长度不能超过500汉字');
		}
	});
	
	//如果正在输入点评内容 不提交
	$scope.preSubmit = function(){
		if($scope.isTyping){
			return;
		}else{
			$scope.submitComment();
		}
	};
   $scope.submitComment = function () {
	if($scope.loading){
		return;
	}
	// console.log($scope.comment);
	//校验用户是否输入内容
	var param = {
		evaTargetCode : $scope.id,
		merserial_no : $scope.id,
		cmtType : "Store",
		ranks : $scope.rank
	};
	if($scope.globalStar === 0){
		$rootScope.toast('请评价总体印象');
		return;
	}
	if($scope.rank === 'food'){
		if($scope.tasteStar === 0) {
			$rootScope.toast('请评价口味');
			return;
		}
		if($scope.environmentStar === 0) {
			$rootScope.toast('请评价环境');
			return;
		}
		if($scope.serviceStar === 0) {
			$rootScope.toast('请评价服务');
			return;
		}
		param.flavor = $scope.tasteStar;
		param.ambient = $scope.environmentStar;
		param.service = $scope.serviceStar;

	} else if($scope.rank === 'hotel'){
		if($scope.environmentStar === 0) {
			$rootScope.toast('请评价环境');
			return;
		}
		if($scope.serviceStar === 0) {
			$rootScope.toast('请评价服务');
			return;
		}
		param.ambient = $scope.environmentStar;
		param.service = $scope.serviceStar;
	}
	if (!$scope.comment) {
		$rootScope.toast('请填写评价信息!');
		return;
	}
	if ($scope.comment.length<5) {
		$rootScope.toast('评价长度不能小于5个汉字');
		return;
	}
	if($scope.rank === 'food' || $scope.rank === 'hotel' || $scope.rank === 'other'){
		if($scope.AvgMoney){
		if(isNaN($scope.AvgMoney)){
			$rootScope.toast('请输入符合规范的数字人均消费!');
			return;
		}else if($scope.AvgMoney>999999 || $scope.AvgMoney<0){
			$rootScope.toast('人均最大限额度为6位数');
			return;
		}
		}
		param.AvgMoney = $scope.AvgMoney;
	}
	$scope.allowShow = false;
	$scope.loading = true;
	param.dcmt_level = $scope.globalStar;
	param.dcmt_content = $scope.comment;
	param.imagelist = '';
	$scope.imgList = $scope.imgList || []; 
	for (var i = 0; i < $scope.imgList.length; i++) {
		if($scope.imgList[i].id){
			param.imagelist = param.imagelist + ',' + $scope.imgList[i].id;
		}
	}
	if(param.imagelist[0] == ','){
		param.imagelist = param.imagelist.slice(1);
	}
	console.log(param);
	API.addComment(param).then(function(data){
		console.log("点评成功");
		$scope.loading = false;
		SharedState.turnOn('success_modal');
	},function(data){
		$scope.loading = false;
		$scope.allowShow = true;
		console.error(data);
		if(data === '2000001') {
			$rootScope.toast('未登录，请登录后再点评！');
		}
	});
   };

//如果正在输入点评内容 不提交
	$scope.preUpdate = function(){
		if($scope.isTyping){
			return;
		}else{
			if (!API.isLogin()) {
				$timeout(function() {
					API.doLogin();
				},0);
				return;
			}
			$scope.updateComment();
		}
	};

   $scope.updateComment = function(){
	if($scope.loading){
		return;
	}
	$scope.loading = true;
	var param = {
		dcmt_id : $scope.id
	};
	if($scope.globalStar === 0){
		$rootScope.toast('请评价总体印象');
		return;
	}
	if($scope.rank === 'food'){
		if($scope.tasteStar === 0) {
			$rootScope.toast('请评价口味');
			return;
		}
		if($scope.environmentStar === 0) {
			$rootScope.toast('请评价环境');
			return;
		}
		if($scope.serviceStar === 0) {
			$rootScope.toast('请评价服务');
			return;
		}
		param.flavor = $scope.tasteStar;
		param.ambient = $scope.environmentStar;
		param.service = $scope.serviceStar;

	} else if($scope.rank === 'hotel'){
		if($scope.environmentStar === 0) {
			$rootScope.toast('请评价环境');
			return;
		}
		if($scope.serviceStar === 0) {
			$rootScope.toast('请评价服务');
			return;
		}
		param.ambient = $scope.environmentStar;
		param.service = $scope.serviceStar;
	}
	if (!$scope.comment) {
		$rootScope.toast('请填写评价信息!');
		return;
	}
	if($scope.rank === 'food' || $scope.rank === 'hotel' || $scope.rank === 'other'){
		param.AvgMoney = $scope.AvgMoney;
	}
	if ($scope.comment.length<5) {
		$rootScope.toast('评价长度不能小于5个汉字!');
		return;
	}
	param.dcmt_level = $scope.globalStar;
	param.dcmt_content = $scope.comment;
	param.imagelist = '';
	for (var i = 0; i < $scope.imgList.length; i++) {
		console.log($scope.imgList);
		if($scope.imgList[i].id){
			param.imagelist = param.imagelist + ',' + $scope.imgList[i].id;
		}
	}
	if(param.imagelist[0] === ','){
		param.imagelist = param.imagelist.slice(1);
	}
	console.log(param);
	API.updateComment(param).then(function(data){
		console.log("修改点评成功");
		$scope.loading = false;
		SharedState.turnOn('success_modal');
	},function(data){
		console.error(data);
		$scope.loading = false;
		if(data === '2000001') {
			$rootScope.toast('未登录，请登录后再点评！');
		}
	});
   }; 
	
	$scope.goBack = function (data) {
		SharedState.turnOff('success_modal');

		if(ICBCUtil.isElifeIos() || ICBCUtil.isElifeAndroid()){
          setTimeout(function () {
            if(ICBCUtil.isElifeAndroid()){ 
              
              elife_app.GetNativeFunctionAndroid({'keyword':'return_btn'});
            } else if (ICBCUtil.isElifeIos()){
              ICBCUtil.nativeGetConfig({
                'key' : 'return_btn',
                'callBack' : ''
              });
            }
          },0);
       }
       else{
       window.history.back();
       }
     
	};

	//点评时返回按钮操作
	$scope.back = function () {
		console.log($scope.isTyping);
		if(!$scope.isTyping){
			SharedState.turnOn('back_modal');
		}
			
	};
	//修改点评时返回按钮操作
	$scope.updateBack = function () {
		if($scope.isTyping){
			return;
		}else{
			history.back();
		}
	};
	
/*	获取到评论类型之后进行不同的显示
	large_flag==food-美食
	large_flag==hotal-酒店
	large_flag==other-银行
**/
	//初始化显示条件
	$scope.tastShow=true;$scope.enShow=true;$scope.serShow=true;
	$scope.large_flag="hotal";
	if($scope.large_flag==="other"){
		$scope.tastShow=false;$scope.enShow=false;$scope.serShow=false;
	}else if($scope.large_flag==="hotal"){
		$scope.tastShow=false;
	}
	
	//上传照片
	$scope.getPhoto = function (para) {
		// $scope.imgs.push({"bid":"123","url":"xxx.jpg"});
		if($scope.imgList && $scope.imgList.length >= 9) {
			$rootScope.toast('最多一次支持上传9张');
			return;
		}

		$timeout(function() {

			var photoList;
			console.log('正在调用系统相机！');
			if (ICBCUtil.isElifeAndroid() || ICBCUtil.isAndroid()) {
				elife_app.GetNativeFunctionAndroid({'keyword':'getPhoto','msg':para});
			}
			if (ICBCUtil.isElifeIos()||ICBCUtil.isIPhone()) {
				ICBCUtil.nativeGetConfig({
					'key' : 'getPhoto',
					'callBack' : "GetPhotoCallback"
				});
			}
			// test
			// GetPhotoCallback([{"url":"xxx.jpg"},{"url":"yyy.jpg"}]);

		},0);
	};
	console.log(Observe);

	
	obs._on('photoCallback',function () {
		$timeout(function () {
			var photoTemp = '';
			$scope.imgList = $scope.imgList || [];
			if (!callbackPhoto) {
                return;
            }
            if (typeof callbackPhoto === "object") {
                photoTemp = callbackPhoto;
            } else if (typeof callbackPhoto === "string") {
                photoTemp = JSON.parse(callbackPhoto);
            }
            if (Array.isArray(photoTemp)) {
                $scope.imgList = $scope.imgList.concat(photoTemp);
            } else {
                $scope.imgList.push(photoTemp);
            }
            if($scope.imgList && $scope.imgList.length > 9){
				$rootScope.toast('最多一次支持上传9张');
				$scope.imgList.splice(9);
            }
		},0);
	});



}]);