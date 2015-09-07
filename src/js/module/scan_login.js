elife.controller('ScanLoginCtrl', ['$scope','API','$timeout','$rootScope','$cookieStore','$location', function($scope,API,$timeout,$rootScope,$cookieStore,$location){
	
	// elife_app.scanResult = localStorage.getItem('qrinfo');
	elife_app.scanResult = $cookieStore.get('qrinfo');
	$cookieStore.remove('qrinfo');
	global = {};
	obs._on('loginSuccess',function () {
		$scope.scanResult = elife_app.scanResult;
		$rootScope.toast('正在处理二维码，请稍后...');
		API.decryptQrcode({
			t_k : localStorage.getItem('t_k'),
			c_no : $cookieStore.get('c_no'),
			qrcode : elife_app.scanResult
		}).then(function (data) {
			
			if (data.res && data.res !== '0') {
				// alert('二维码解密失败,错误码：\n' + JSON.stringify(data));
				switch (data.res) {
					case '2000001' : 
					// $rootScope.toast('(' + data.res + ')用户不存在');
					alert('(' + data.res + ')用户不存在');
					break;
					case '2000003' :
					alert('(' + data.res + ')商铺不存在');
					// $rootScope.toast('(' + data.res + ')商铺不存在');
					break;
				}
				// $rootScope.toast('二维码解密失败,错误码：' + data.res);
				return false;
			}
			if (ICBCUtil.isElifeAndroid()) {
				elife_app.GetNativeFunctionAndroid({'keyword':'scanResultPage','url': '#/personal/pay_orders/4/' + data.shopid + '/' + data.orderid + '/' + data.orderamt + '/' + data.qrtype});
			} else if (ICBCUtil.isElifeIos()) {
				location.hash = '/personal/pay_orders/4/' + data.shopid + '/' + data.orderid + '/' + data.orderamt + '/' + data.qrtype;
			} else {
				// location.hash = '/personal/pay_orders/' + JSON.stringify(data);
				$location.path('/personal/pay_orders/4/' + data.shopid + '/' + data.orderid + '/' + data.orderamt + '/' + data.qrtype).replace();
			}
			console.log(data);
		},function (data) {
			console.error(data);
		});
	});
	$scope.doLogin = function () {
		$timeout(function () {
			API.doLogin();
		});
	};
}]);