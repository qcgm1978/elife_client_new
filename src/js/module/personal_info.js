elife.controller('PersonalInfoCtrl', ['$rootScope','SharedState','$scope','$http','$cookieStore','$timeout' ,'API','$interval', function ($rootScope,SharedState,$scope,$http,$cookieStore,$timeout,API,$interval) {
  if(ICBCUtil.isElifeIos()){
    ICBCUtil.nativeGetConfig({
        'key': 'tabbarhidden',
        'callBack': ''
    });
  }

  var errCode = {
    '2000001' : '没有查到该用户',
    '2000010' : '用户不是非实名用户',
    '2100000' : '统一通行证非实名用户验证接口用户名不存在',
    '2100001' : '统一通行证非实名用户验证接口用户登录密码错误',
    '2100002' : '统一通行证非实名用户验证接口账户被锁定',
    '2100003' : '统一通行证非实名用户验证接口用户无效',
    '2100004' : '统一通行证非实名用户验证接口存储过程出错',
    '2100005' : '统一通行证非实名用户验证接口其他错误',
    '1000003' : '必须传递的参数不全',
    '2100016' : '不允许60秒内重复请求发送验证码',
    '2100013' : '验证码发送失败',
    '1000001' : '程序报错',
    '2100011' : '验证码输入错误',
    '1200002' : '调用银行统一通行证修改手机号失败',
    '2100014' : '修改手机号失败',
    '2100012' : '旧密码不匹配',
    '2100015' : '账号重复更新失败'
  };
  var showErr = function (code) {
    if (!errCode[code]) {
      return false;
    }
    $rootScope.toast(errCode[code]);
  };


  // 返回按钮
  elife_app.SetReturnBtn();
  $scope.getGender = function () {
    if($scope.personalInfo.gender === '男'){
      return 0;
    }else if($scope.personalInfo.gender === '女'){
      return 1;
    }else{
      return 2;
    }
    //return $scope.personalInfo.gender === '男' ? 0 : 1;
  };
  $scope.SetGender = function(i){
    console.log($scope.getGender());
    if (i == $scope.getGender()) {
      return false;
    }
    var param = {
      't_k' : $cookieStore.get('t_k'),
      'c_no' : $cookieStore.get('c_no'),
      'req_type' : 'sex',
      'n_sex' : i
    };
    API.changePersonalInfo(param).then(function (data) {

      if (data.res == '0') {
        if (i===0) {
          $scope.personalInfo.gender="男";
        }
        else if(i===1){
          $scope.personalInfo.gender="女"; 
        }else{
          $scope.personalInfo.gender="未知";
        }
      }
    }, function(data){
      $scope.toast("请检查网络状况");
    });
  };
  $rootScope.oldPhone = '正在获取您的手机号...';
  // || 2015.5.4 ||
//获取用户信息

  API.getUserInfo({}).then(function(data){
    console.log(data);
    var info = data.data;
    console.log("个人信息");
    console.log(info);

    var _gender="";
    if(info.sex == '0'){
      _gender= "男";
    }else if(info.sex == '1'){
      _gender= "女";
    }else{
      _gender= "未知";
    }
    $scope.personalInfo = {
      nickname : info.nickName,
      gender : (_gender),
      phone : info.phone,
      address : info.address,
    };
    $scope.new_nickname = $scope.personalInfo.nickname;
    $rootScope.oldPhone = $scope.personalInfo.phone;
    $scope.personalInfo.headuri =  $rootScope.imgBaseUrl+info.headuri;
  
  },function(data){
     console.log("个人信息获取失败");
     $rootScope.oldPhone = '手机号码获取失败'; 
    $scope.toast("个人信息获取失败，请检查网络状况");
   }
  );


  // // 获取用户相关信息
  // $http.post('http://223.223.177.38:8082/OFSTCUST/cuinfo/findCuMoreById.action',{
  //   't_k' : $cookieStore.get('t_k'),
  //   'c_no' : $cookieStore.get('c_no')
  // })
  // .success(function (data) {
  // var info = data.data;
  // console.log(data);
  //   $scope.personalInfo = {
  //   nickname : info.nickName,
  //   gender : (info.sex == '0' ? '男' : '女'),
  //   phone : info.phone,
  //   address : info.address,
  //   headuri : info.headuri
  //   };
  //   $scope.new_nickname = info.nickName;
  //   $scope.imageTmp = $scope.personalInfo.headuri;
  //   $scope.defaultImg = 'http://127.0.0.1:8080/dist/images/avatar.png';
  //   $scope.personalInfo.headuri = $scope.defaultImg;
  //   $http.get('$scope.personalInfo.headuri').success(function(data){
  //   $scope.personalInfo.headuri = imageTmp;
  // });
  // });

  // 获取用户相关信息
  // API.getUserInfo().then(function(data){
  //   var info = data;
  //   console.log(info);
  //   $scope.personalInfo = {
  //   nickname : info.nickName,
  //   gender : (info.sex == '0' ? '男' : '女'),
  //   phone : info.phone,
  //   address : info.address,
  //   headuri : info.headuri
  //   };
  //   $scope.new_nickname = info.nickName;
  // },function(data){
  //   $scope.toast('请检查网络设置');
  //   console.log(data);
  // });

  // 修改昵称
  $scope.doSubmitNickname = function () {

    $scope.nickname_error_reg = /[^\u4E00-\u9FA5\w\b_]{1}/;
    $scope.nickName_error = 0;
    if ($scope.new_nickname === '' || $scope.new_nickname === undefined) {
      $scope.nickName_error = 1;
      $rootScope.toast('昵称不允许为空！');
      return false;
    }
    if ($scope.nickname_error_reg.test($scope.new_nickname)){
      $scope.nickName_error = 1;
      $rootScope.toast("昵称格式错误，昵称只能使用24个字符以内的字母，数字，中文，下划线");
      return false;
    }
    if($scope.new_nickname.length > 24){
      $scope.nickName_error = 1;
      $rootScope.toast("昵称修改失败，昵称长度不符合");
      return false;
    }

    if ($scope.new_nickname === $scope.personalInfo.nickname) {
      $rootScope.toast('您未修改昵称，请返回');
      return false;
    }

    // $rootScope.toast("正在修改昵称...");
    API.changePersonalInfo({
      't_k' : $cookieStore.get('t_k'),
      'c_no' : $cookieStore.get('c_no'),
      'req_type' : 'nick',
      'n_nikename' : $scope.new_nickname
    }).then(function(data){

      if (ICBCUtil.isElifeAndroid()) {
        elife_app.GetNativeFunctionAndroid({'keyword':'refresh'});
      }

      history.back();
    },function(data){
      $rootScope.toast("昵称修改失败，请检查网络状况");
    });
    // $http.post('http://223.223.177.38:8082/OFSTCUST/cuinfo/updateCuinfo.action',{
    //   't_k' : $cookieStore.get('t_k'),
    //   'c_no' : $cookieStore.get('c_no'),
    //   'req_type' : 'nick',
    //   'n_nikename' : $scope.new_nickname
    // })
    // .success(function (data) {
    //   console.log(data);
    //   var msg = '';
    //   switch (data.res) {
    //     case '0' :
    //     msg = '修改成功';
    //     break;
    //     default :
    //     msg = '修改失败';
    //   }
    //   $scope.postmsg = msg;
    //   $rootScope.Ui.turnOn('modify_success_modal');
    // });
  };

  //清空昵称
  $scope.doDeleteNickname = function(){
    $scope.new_nickname = '';
    $("#newName").attr("placeholder","请输入您新的昵称");
  };

  $scope.backToPersonalInfo = function () {
    if ($scope.new_nickname === '' || $scope.new_nickname === undefined || $scope.nickName_error == 1) {
      $rootScope.Ui.turnOff('modify_success_modal');
    } else {
      $rootScope.Ui.turnOff('modify_success_modal');
      history.back();
    }
  };


// app交互
$scope.GetPhoto = function(){
  // 调用相册
  if(ICBCUtil.isElifeAndroid()){
      // elif_app.GetLocationAndroid();
       elife_app.GetNativeFunction({'keyword':'getPhoto'});
     }
  if(ICBCUtil.isElifeIos()){
      //调用地理位置
    ICBCUtil.nativeGetConfig({
      'key' : 'getPhoto',
     'callBack' : GetPhotoIos
    });
  }

};
$scope.GetCamera = function(){
  // 调用相机

  if(ICBCUtil.isElifeAndroid()){
      // elif_app.GetLocationAndroid();
       elife_app.GetNativeFunction({'keyword':'getCamera'});
     }
  if(ICBCUtil.isElifeIos()){
      //调用地理位置
    ICBCUtil.nativeGetConfig({
      'key' : 'getCamera',
     'callBack' : GetCameraIos
    });
  }
  
};

var validate_mobile = /^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
var verifySTime,verifyETime;
// $scope.$watch('oldPhone', function(newVal, oldVal){
//   newVal = newVal + "";
//   console.log(newVal);
//   console.log(oldVal);
//   if(!newVal) {return;}
//   console.log("--");  if(newVal.length > 11) {
//     $rootScope.toast("输入的手机号已达11位啦！");
//     $scope.oldPhone = oldVal;
//   }
//   if(newVal.length === 11){
//     if(!validate_mobile.test(newVal)){
//       $rootScope.toast("输入的手机号格式有误，请重新输入");
//     }
//   }
// });


  var gettime = function () {
    var time = new Date(),
        h = time.getHours(),
        m = time.getMinutes(),
        s = time.getSeconds();
    h = h < 10 ? "0" + h : "" +h;
    m = m < 10 ? "0" + m : "" +m;
    s = s < 10 ? "0" + s : "" +s;
    return h + m + s;
  };
$scope.check_tel = function(){
  // 暂时干掉

    var phoneNum = $('#o_phone').val();

    if (!phoneNum) {
      $rootScope.toast('请输入手机号码');
      return false;
    }

    // if (!validate_mobile.test(phoneNum)||phoneNum.length !== 11) {
    if (phoneNum.length !== 11) {
      $rootScope.toast('请输入正确的手机号码');
      return false;
    } 

  // if(!$scope.pwd){
  //   $rootScope.toast("输入的密码不能为空");
  //   return;
  // }
  // if (!$('#pwd').val()) {
  //   $rootScope.toast("请输入密码");
  //   return;
  // }

  var para = {
    t_k : $cookieStore.get('t_k'),
    c_no : $cookieStore.get('c_no'),
    o_phone : $scope.oldPhone,
    pwd : $('#pwd').val(),
    passwdRule : $('input[name="pwdRule"]').val(),
    passwdChangeRule : $('input[name="pwdChangeRule"]').val(),
    mmTime : gettime()
  };
    if (!para.pwd) {
      $rootScope.toast('请输入密码');
    }
    if (!para.passwdRule) {
      $rootScope.toast('请使用安全键盘输入');
    }
  // 暂时写死
  // var para = {
  //   t_k : 'ff4769b52f9243e5b6287e047e83127d',
  //   c_no : '312',
  //   o_phone : '13994372014',
  //   pwd : '7F1B1C6355524B83496EE6B50F9B7FC768BAE2EC6B95709E6F5F914473A3EE6DD254BF73BB2A9F44E4C4ECE8ADC1F66C03146DA9F4B92520DB575693829DB3FB8423EF94A943C2C3733A49DE900F0FE162E8D3DA0CF21150AAB0F715F102B0B6201F04C17AE65FFA7786B0B890CBB5F29B11D25D25A3EF6EC2182D068DBEDAC7',
  //   passwdRule : '112234125237134250143274155258163221212121852291932402273246214326122522682164228',
  //   passwdChangeRule : '2290#1',
  //   mmTime : '101542'
  // };

  $cookieStore.put('o_phone',$scope.oldPhone);
  // 暂时跳走
  // location.hash = "/personal/personal_change_tel2";
  // alert('123请确认以下字段：\n' + JSON.stringify(para));
  API.checkTel(para).then(function (data){
    console.log(data);
    // 注意
    // location.hash = "/personal/personal_change_tel2";


    // alert(JSON.stringify(data));
    if (data.res === '0') {
      location.hash = "/personal/personal_change_tel2";
    } else {
      showErr(data.res);
      return;
    }

  },function (data) {
    console.error("验证失败！");
  });
};

// 60秒倒计时

$rootScope.startTimer = function () {
  
  $rootScope.initSecond = $rootScope.initSecond || 60;
  console.log($rootScope.initSecond);
  $rootScope.btnDisabled = true;
  var timer = $interval(function () {
    $rootScope.initSecond--;
    if ($rootScope.initSecond === 0 || $rootScope.initSecond < 0) {
      $interval.cancel(timer);
      $rootScope.btnDisabled = false;
    }
  },1000);
};


$scope.getVerifyNumber = function () {
  var para ={
    t_k : $cookieStore.get('t_k'),
    c_no : $cookieStore.get('c_no'),
    n_phone : $scope.num2
  };
  
  if ($rootScope.btnDisabled) {
    return false;
  }

  // var para ={
  //   t_k : 'ff4769b52f9243e5b6287e047e83127d',
  //   c_no : '312',
  //   n_phone : '15501271757'
  // };

    var phoneNum = $('#n_phone').val();

    if (!phoneNum) {
      $rootScope.toast('请输入手机号码');
      return false;
    }

    if (!validate_mobile.test(phoneNum)||phoneNum.length !== 11) {
      $rootScope.toast('请输入正确的手机号码');
      return false;
    }

  // alert('请确认以下字段：\n' + JSON.stringify(para));
  $rootScope.startTimer();
  // 记录时间 验证码有效期十分钟
  verifySTime = new Date().getTime();
  API.getVerifyNumber(para).then(function (data) {
    console.log(data);
    // alert(JSON.stringify(data));
    if (data.res === '0') {
      console.log('验证码已发送');
    } else {
      showErr(data.res);
      return;
    }
  },function (data) {
    console.error('获取验证码失败！');
  });
};


// 退出登陆
$scope.logout = function () {
  $timeout(function() {
    API.doLogout();
  },0);
};
    
  ICBCSafeKeyBoard.initSafeEdit();

  $scope.changeTel = function () {
    // modify_success_modal
    var para = {
      req_type : 'phone',
      t_k : $cookieStore.get('t_k'),
      c_no : $cookieStore.get('c_no'),
      o_phone : $cookieStore.get('o_phone'),
      n_phone : $scope.num2,
      mmTime : gettime(),
      validateNum : $scope.verifyNumber
    };
    verifyETime = $cookieStore.get('verifyETime') || new Date().getTime();
    if (verifyETime - verifySTime > 600000) {
      $rootScope.toast('验证码已过期');
      return false;
    }
    var phoneNum = $('#n_phone').val();
    var verifyNumber = $('#verifyNumber').val();

    if (!phoneNum) {
      $rootScope.toast('请输入手机号码');
      return false;
    }

    if (!validate_mobile.test(phoneNum)||phoneNum.length !== 11) {
      $rootScope.toast('请输入正确的手机号码');
      return false;
    }

    if (!verifyNumber) {
      $rootScope.toast('请输入验证码');
      return false;
    }

    if (verifyNumber.length !== 6 || /[^0-9]/.test(verifyNumber)) {
      $rootScope.toast('请输入正确的验证码');
      return false;
    }

    // var para = {
    //   req_type : 'phone',
    //   o_phone : '13994372014',
    //   mmTime : gettime(),
    //   validateNum : $scope.verifyNumber,
    //   t_k : 'ff4769b52f9243e5b6287e047e83127d',
    //   c_no : '312',
    //   n_phone : '15501271757'
    // };
    API.changeTel(para).then(function (data) {
      console.log(data);
      // alert(JSON.stringify(data));
      if (data.res === '0') {
        SharedState.turnOn('modify_success_modal');
      } else {
        showErr(data.res);
        return;
      }
    },function (data) {
      console.error('手机号码修改失败！');
    });
  };
  $scope.goBack = function () {
    $cookieStore.remove('o_phone');
    SharedState.turnOff('modify_success_modal');
    history.back();
  };
  // 82.200.109.86:8080/OFSTCUST/cuinfo/updateCuinfo.action
  $scope.changePwd = function () {
    
    console.log($('input[name="pwdRule"]').val());
    console.log($('input[name="pwdChangeRule"]').val());
    console.log($('input[name="n_pwdRule"]').val());
    console.log($('input[name="n_pwdChangeRule"]').val());
    console.log($('input[name="s_pwdRule"]').val());
    console.log($('input[name="s_pwdChangeRule"]').val());
    var para = {
      req_type : 'pwd', // 值未确定
      t_k : $cookieStore.get('t_k'),
      c_no : $cookieStore.get('c_no'),
      pwd : $('#pwd').val(),
      n_pwd : $('#n_pwd').val(),
      s_pwd : $('#s_pwd').val(),
      passwdRule : $('input[name="pwdRule"]').val(),
      passwdChangeRule : $('input[name="pwdChangeRule"]').val(),
      newPwdRule : $('input[name="n_pwdRule"]').val(),
      newPwdChangRule : $('input[name="n_pwdChangeRule"]').val(),
      surePwdRule : $('input[name="s_pwdRule"]').val(),
      surePwdChangeRule : $('input[name="s_pwdChangeRule"]').val(),
      mmTime : gettime()
    };
    if (!para.pwd || !para.n_pwd || !para.s_pwd) {
      $rootScope.toast('请输入密码');
      return false;
    }
    if (!para.passwdRule) {
      $rootScope.toast('请使用安全键盘输入');
      return false;
    }
    // alert('请确认以下字段：\n' + JSON.stringify(para));
    API.changePwd(para).then(function (data) {
      console.log(data);
      // alert(JSON.stringify(data));
      if (data.res === '0') {
        SharedState.turnOn('modify_success_modal');
      } else {
        showErr(data.res);
        return;
      }
    },function (data) {
      console.error('修改密码失败！');
    });
  };
  // 是否为融e联客户端
  $scope.isREL = ICBCUtil.isRELIphone() || ICBCUtil.isRELAndroid();
}]);