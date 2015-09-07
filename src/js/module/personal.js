elife.controller('PersonalCtrl', ['$scope', '$http','$timeout', '$cookieStore', 'API','$rootScope','$document', function ($scope, $http, $timeout, $cookieStore, API, $rootScope,$document) {
    // 弹窗交互数据
  // var aa = prompt('close');
  // document.getElementById("aa").innerHTML = aa;
  // if(aa=="closeIcon"){
  //   document.getElementById("foot").style.display = "none";
  //   document.getElementById("close_icon").style.display = "none";
  // }
  if(ICBCUtil.isElifeIos()){
    ICBCUtil.nativeGetConfig({
        'key': 'tabbar',
        'callBack': ''
    });
  }
  $scope.isLogin = true;
  $timeout(function () {
    $scope.isLogin = $cookieStore.get('t_k');
  },150);
  $scope.getUserInfo = function () {
    //获取用户信息
    API.getUserInfo({}).then(function(data){
       var info = data.data;
       
       console.log("个人信息");
        if (info instanceof Object) {
            if (info.sex === '0') {
              info.gender = '男';
            } else if (info.sex === '1') {
              info.gender = '女';
            } else {
              info.gender = '未知';
            }
            $rootScope.headuri =  $rootScope.imgBaseUrl+info.headuri;
            $scope.nickname = info.nickName || '您未设置昵称';
            $scope.address = info.address;
            $scope.gender = info.gender;
            $scope.phoneNum = info.phone;
            $rootScope.oldPhone = $scope.phoneNum;

        } else {
            $rootScope.nickname = '未获取到用户名';
        }
    },function(data){
       console.log("个人信息获取失败");
       $rootScope.oldPhone = '手机号码获取失败';
      $scope.toast("个人信息获取失败，请检查网络状况");
     });
  };

  global = {};
  obs._on('loginSuccess',function () {
    // alert('登陆成功');
    $cookieStore.put('t_k',elife_app.token);
    $scope.isLogin = $cookieStore.get('t_k');
    if (ICBCUtil.isElifeAndroid()) {
      prompt('callNativeMethod', "{obj:Native,func:DataConfigServiceServer,args:['refresh','']}");
    }
    // $timeout(function () {
    //   $rootScope.token = elife_app.token;
    //   if (ICBCUtil.isElifeAndroid()) {
    //     location.reload();
    //   }
    //   $scope.getUserInfo();
    // },0);    
  });


  // obs._on('doLogin',function () {
  //   $timeout(function () {
  //     $rootScope.token = elife_app.token;
  //   },0);
  //   $scope.getUserInfo();
  // });
  /*
  $scope.validateLogin = function () {
    $timeout(function() {
      if (!API.isLogin()) {
        API.doLogin();
        return;
      }
    });
  };
  */
  $scope.check= function(){
    var len  = document.getElementById("trade_return_content").value.length;
   if(len>999){
    $scope.content = $scope.content.substring(0, 999);
   }
  };
/*
    API.getHomeLargeCategory({
    e_row: 3
  }).then(function(data){
    console.log("行业大类：");
    console.log(data);
    $scope.largeCategory = data;
  }, function(data){
    $scope.largeCategory = []; 
    console.error("行业大类获取失败：" + data);
    $scope.toast('请检查网络状况');
  });
*/  
/*
  //获取用户信息
  API.getUserInfo({}).then(function(data){
     var info = data.data;
     console.log("个人信息");
     console.log(info);
     $scope.nickname = info.nickName;
     $scope.img =  $rootScope.imgBaseUrl+info.headuri;

  },function(data){
     console.log("个人信息获取失败");
    $scope.toast("个人信息获取失败，请检查网络状况");
   }
  );
*/
  // 获取我的电子券
  $scope.e_coupon_url = "#/personal/e_coupon";


  // API.getECoupon({
  //   't_k' : $rootScope.token,
  //   'c_no' : $cookieStore.get('c_no')
  // }).then(function(data){
  //    console.log("成功");
  //     console.log(data);
  //     var info = data.data;
  //     if(angular.isUndefined(info)){
  //     $scope.e_coupon_url = "#/personal/e_coupon_blank";
  //   }
  // },function(data){
  //     $scope.toast("电子券获取失败，请检查网络状况");
  //     console.log("获取电子券失败");
  //   });

  if (API.isLogin()) {
    $scope.getUserInfo();
  } else {
    $rootScope.token = undefined; 
  }
  
  // $rootScope.$watch('lotout',function (nVal,oVal) {
  //   if (!nVal) {
  //     location.reload();
  //   }
  // });
  $http.post($rootScope.baseUrl + '/OFSTCUST/info/showEleTicket.action',{
    't_k' : $cookieStore.get('t_k'),
    'c_no' : $cookieStore.get('c_no')
  })
  .success(function (data) {
    console.log("我的电子券信息");
    console.log(data);
    var info = data.data;
    if(angular.isUndefined(info)){
      $scope.e_coupon_url = "#/personal/e_coupon_blank";
    }
  });

   //app交互判断是不是e生活的客户端
   // if(ICBCUtil.isElifeIos() || ICBCUtil.isElifeAndroid()){
   //  var hideEle = document.querySelectorAll('.foot,.close_icon,.about_us,.about_us_border');
   //  _(hideEle).css('display','none');
   // }
   $scope.isElifeClient = ICBCUtil.isElifeIos() || ICBCUtil.isElifeAndroid();
   // $document.ready(function () {
   //  var androidFix = document.querySelectorAll('.android_fix');
   //    _(androidFix).on('click',function () {
   //      var url = _(this).attr('href') || _(this).attr('data-href');
   //          _(this).removeAttr('href');
   //          _(this).attr('data-href',url);
   //      if (ICBCUtil.isElifeAndroid() || ICBCUtil.isElifeIos()) {
   //        $timeout(function() {
   //          if (!API.isLogin()) {
   //            API.doLogin();
   //            return;
   //          } else {
   //            if (ICBCUtil.isElifeAndroid()) {
   //              elife_app.GetNativeFunctionAndroid({'keyword':'newPage','url':url});
   //            } else {
   //              location.hash = url.slice(1);
   //            }
   //          }
   //        },0);
   //      }
   //    });
   //  });
  $scope.verifyLogin = function (url) {
    $timeout(function () {
      if (!API.isLogin()) { // 如果未登录
        API.doLogin();      // 登陆
        return false;
      } else {              // 如果已登录
        if (ICBCUtil.isElifeAndroid()) {      // 如果是安卓
          elife_app.GetNativeFunctionAndroid({'keyword':'newPage','url':url});
          return;
        } 
        // 融e联，pc模拟器，elifeIos
        location.hash = url.slice(1);
      }
    },0);
    return false;
  };

  var ua = navigator.userAgent.toLowerCase();
  $scope.isAndroid = ua.indexOf('android') > -1;
  $scope.callphone = function (tel) {
    $timeout(function () {
        elife_app.GetNativeFunctionAndroid({'keyword':'callPhone','tel':tel});
    },0);
  };

}]);

