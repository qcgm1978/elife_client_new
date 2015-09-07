elife.controller('ScanFixCtrl', ['$scope','$cookieStore','$timeout','$routeParams','API','$rootScope','$location', function($scope,$cookieStore,$timeout,$routeParams,API,$rootScope,$location){

	// 如果未登录 要先登录，因为扫出来的可能是订单二维码

	global={};
	obs._on('ScanCallback',function () {
		var rxp = /^(elife:\*\$\*)\w+/;
		if (!rxp.test(elife_app.scanResult)) {
			$rootScope.toast('二维码错误');
			return false;
		}
		// alert(elife_app.scanResult);
		if (!API.isLogin()) {
			$cookieStore.put('qrinfo',elife_app.scanResult);
			$timeout(function () {
				if (ICBCUtil.isElifeAndroid()) {
					elife_app.GetNativeFunctionAndroid({'keyword':'newPage','url':'#/scan_login'});
				} else if (ICBCUtil.isElifeIos()) {
					// location.hash = "/scan_login";
					$location.path('/scan_login').replace();
				}
			},0);
			return;
		}
		console.log($cookieStore.get('t_k'));
		$timeout(function () {
			console.log('扫一扫，进入回调方法');
			$scope.scanResult = elife_app.scanResult;
			$rootScope.toast('正在处理二维码，请稍后...');
			API.decryptQrcode({
				t_k : $cookieStore.get('t_k'),
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
				var data = data.data;
				data.orderid = data.orderid || 'null';
				data.orderamt = data.orderamt || 'null';
				console.log(data.qrtype);
				if (ICBCUtil.isElifeAndroid()) {
					elife_app.GetNativeFunctionAndroid({'keyword':'scanResultPage','url':'#/personal/pay_orders/4/' + data.shopid + '/' + data.orderid + '/' + data.orderamt + '/' + data.qrtype});
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
			// API.scan 发送加密字符串
			// 接收解密字符串（有一下两种情况）
			// 成功或者失败给端上返回标志
			// 1.成功解密（又分以下两种）
			//		1).如果是支付，先将订单信息传到待付款的页面，先显示提示框，并在待付款的页唤起app。
			//		2).如果是商户详情，跳转到商户详情页面。
			// 2.解密失败，直接弹出提示框。
			$scope.testData = $scope.scanResult;
		},0);
	});

	if ($routeParams.encryptStr) {
		elife_app.scanResult = $routeParams.encryptStr;
		obs._fire('ScanCallback'); 
	}

	$scope.getScan = function () {
        console.log('融e联扫一扫');
        $timeout(function () {
            if (ICBCUtil.isAndroid()) {
                elife_app.GetNativeFunctionAndroid({
                    'keyword': 'getScan',
                    'callback' : 'GetScanCallback'
                });
            }
            if (ICBCUtil.isIPhone()) {
                ICBCUtil.nativeGetConfig({
                    'key': 'getScan',
                    'callBack': 'GetScanCallbackIos'
                });
            }
        },0);
    };

    $scope.getScan();
    
    // 订单二维码
	// elife:*$*484ffe67e34f96a9cd58901620adfe69d2d859a4997350f6687222ae6c9d21f81546c2670d6fe23710785d534dd2cf72760f9fbb33352022e7b375805383f73bcd77b5ea2425dee4e219557ced98f7d38b8ada6bf86f1b6f730609802f2a0a61cdac844d2c6959243a93ffda4b7efbf647b2064da5eff02779ddc04c7de84de3e6db66351dd9871dd070df92be1c434d65464e3eb4840b96e598a04a1106c9f47011bb50e90ea7b60315f83e414d77a2

	// 商户二维码
	// elife:*$*484ffe67e34f96a9cd58901620adfe69d2d859a4997350f616d49d28849899a416f744a7916e25cab8d042fbbc36469c07d2900099e96f050628b7b48cf1b4b85733b3528e1d1cfe3c05a18d560542813660883e62c28ed824b5e26595ce2ccaa29ce08cb79ab8e8ee10f8f408b784ba
	
	// 模拟触发扫描结果 
	// elife_app.scanResult = 'elife:*$*484ffe67e34f96a9cd58901620adfe69d2d859a4997350f6687222ae6c9d21f81546c2670d6fe23710785d534dd2cf72760f9fbb33352022e7b375805383f73bcd77b5ea2425dee4e219557ced98f7d38b8ada6bf86f1b6f730609802f2a0a61cdac844d2c6959243a93ffda4b7efbf647b2064da5eff02779ddc04c7de84de3e6db66351dd9871dd070df92be1c434d65464e3eb4840b96e598a04a1106c9f47011bb50e90ea7b60315f83e414d77a2'; 
	// obs._fire('ScanCallback');
	/*
	data = {
		orderamt : "",
		orderid : "",
		qrtype : "1",
		shopid : "02000000002"
	};
	location.hash = '/personal/pay_orders/' + JSON.stringify(data);
	*/
}]);