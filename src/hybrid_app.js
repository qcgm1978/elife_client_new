/*app交互调用全局方法*/
// 全局对象封装调用方法
hybrid_app = function () {
};
var elife_app = new hybrid_app();
function Observe() {
};
var global = {};
Observe.prototype._on = function (evt, fn) {
    !global[evt] && (global[evt] = []);
    global[evt].push({'execute': fn});
};
Observe.prototype._fire = function (evt) {
    if (!global[evt]) {
        return;
    }
    try {
        for (var i = 0; i < global[evt].length; i++) {
            global[evt][i].execute();
        }
    } catch (e) {
    }
};
var obs = new Observe();
// 返回按钮
hybrid_app.prototype.SetReturnBtn = function () {
    if (ICBCUtil.isElifeIos() || ICBCUtil.isElifeAndroid()) {

        // if( document.getElementsByClassName("return_btn")[0].id=="removeAllCookies"){
        //   $cookieStore.remove(KEY_STORE_FILTER_MODE);
        //   $cookieStore.remove(KEY_STORE_FILTER_DISTANCE);
        //   $cookieStore.remove(KEY_STORE_FILTER_DISTRICT);
        //   $cookieStore.remove(KEY_STORE_FILTER_CITY_DISTRICT);
        //   $cookieStore.remove(KEY_STORE_FILTER_TYPE);
        //   $cookieStore.remove(KEY_STORE_FILTER_BIG_TYPE);
        //   $cookieStore.remove(KEY_STORE_ORDER_KEY);
        //   $cookieStore.remove(KEY_STORE_ORDER_NAME);
        // }
        document.getElementsByClassName("return_btn")[0].setAttribute("href", "javascript:void(0)");
        document.getElementsByClassName("return_btn")[0].addEventListener("click", function () {
            // window.history.back();
            setTimeout(function () {
                if (ICBCUtil.isElifeAndroid()) {
                    elife_app.GetNativeFunctionAndroid({'keyword': 'return_btn'});
                } else if (ICBCUtil.isElifeIos()) {
                    ICBCUtil.nativeGetConfig({
                        'key': 'return_btn',
                        'callBack': ''
                    });
                }
            }, 0);
        });
    }
};
obs._on('returnBack', function () {
    if (ICBCUtil.isElifeAndroid()) {
        elife_app.GetNativeFunctionAndroid({'keyword': 'return_btn'});
    } else if (ICBCUtil.isElifeIos()) {
        ICBCUtil.nativeGetConfig({
            'key': 'return_btn',
            'callBack': ''
        });
    }
});
// 联系商户按钮
// hybrid_app.prototype.SetStoreContactBtn = function(){
//   if(ICBCUtil.isElifeIos() || ICBCUtil.isElifeAndroid()){
//     console.log(1);
//     document.getElementsByClassName("e_financial")[0].style.display='none';
//     document.getElementsByClassName("telephone_num")[0].style.border = '0px solid #dcdcd4';
//    }
// };
/**************************弹窗设置**********************************
 *********************************************************************/
//显示弹窗，para为字符串
hybrid_app.prototype.OpenDialog = function (para) {
    if (document.getElementById("toast").style.zIndex > 0) {
        this.CloseDialog();
    }
    angular.element(document.getElementById("toast")).html(para);
    document.getElementById("toast").style.zIndex = "999";
};
hybrid_app.prototype.CloseDialog = function () {
    document.getElementById("toast").style.zIndex = "-999"
}
//显示弹窗并在1s后关闭
hybrid_app.prototype.CreateDialog = function (para) {
    if (document.getElementById("toast").style.zIndex > 0) {
        this.CloseDialog();
    }
    angular.element(document.getElementById("toast")).html(para);
    document.getElementById("toast").style.zIndex = "999";
    setTimeout(function () {
        document.getElementById("toast").style.zIndex = "-999";
    }, 1000);
};
newWebview = function (url) {
    elife_app.GetNativeFunctionAndroid({'keyword': 'newPage', 'url': url});
};
/***************************APP回调的方法****************************
 *********************************************************************/




//ios调用定位方法返回
// GetLocationCallbackIos =  function(para){
//   // prompt(para);
//   // 错误代码
//    if(para === "10001"){
//       elife_app.CreateDialog("获取地理位置失败");  
//     }
//     else{
//       elife_app.longitude = (para.longitude)? para.longitude : para.lastLongitude;
//       elife_app.latitude = (para.latitude)? para.latitude : para.lastLatitude;
//       if(elife_app.longitude){
//         // elife_app.CreateDialog("获取地理位置成功"+elife_app.longitude+"//"+ elife_app.latitude); 
//         elife_app.CreateDialog("获取地理位置成功"); 
//       }
//       else{
//          elife_app.CreateDialog("获取地理位置失败");
//       }
//     }
// };
// codeNum
// 100 正常
// 200 未开启定位
// 300 网络不给力
//android/Ios调用定位方法返回
var callbackPosition = "";
GetLocationCallback = function (para) {
    try {
        if (localStorage.emulateAndroid) {
            para = '{"longitude":116.4459430000,"latitude":39.9725240000,"codeNum" : "100"}'
        }
        if (para == 10001) {
            elife_app.CreateDialog("获取地理位置失败");
            return;
        }
        if (typeof para === "object") {
            para = para;
        } else if (typeof para === "string") {
            para = JSON.parse(para);
        }
        if (para === null) {
            elife_app.CreateDialog("定位失败，请点击重试");
        }else if(para.codeNum == "200"){
            elife_app.CreateDialog("请在系统设置中开启定位服务");
        }else if(para.codeNum == "300"){
            elife_app.CreateDialog("网络不给力");
        }
        else if(para.codeNum == "100"||para.longitude){
            //para = JSON.parse(para);
            elife_app.longitude = (para.longitude) ? para.longitude : para.lastLongitude;
            elife_app.latitude = (para.latitude) ? para.latitude : para.lastLatitude;
            // document.getElementById("aa").innerHTML =  elife_app.longitude+"??"+elife_app.latitude;
            if (elife_app.longitude) {
                //alert('fire registered evt');
                callbackPosition = {longitude: elife_app.longitude, latitude: elife_app.latitude};
                para && (obs._fire('positionCallback'));
                // elife_app.CreateDialog("获取地理位置成功"+elife_app.longitude+"//"+ elife_app.latitude);
                elife_app.CreateDialog("获取地理位置成功");
                var injector = angular.element(document.body).injector();
                var cookieInjector=injector.get('$cookieStore');
                cookieInjector.put('longitude',callbackPosition.longitude);
                cookieInjector.put('latitude',callbackPosition.latitude);
            } else {
                elife_app.CreateDialog("获取地理位置失败");
            }
        }
    } catch (e) {
        elife_app.CreateDialog("获取地理位置失败");
    }
};
//android调用个人信息获取
GetPersonalInfoCallbackAndroid = function (para) {
    /*待定*/
};
//Ios调用个人信息获取
GetPersonalInfoCallbackIos = function (para) {
    /*待定*/
};
//android调用相册返回
GetPhotoCallbackAndroid = function (para) {
    /*待定*/
};
GetPhotoCallbackIos = function (para) {
    /*待定*/
    // 上传出错码10002,取消上传10001，成功上传10000
    // if(para="10001"){}
    // if(para="10002"){}
    // if(para="10000"){
    //   window.location.href ="http://www.baidu.com";
    // }
};
var callbackPhoto = '';
GetPhotoCallback = function (para) {
    //console.log('相机通用回调！');
    if (typeof para !== 'string') {
        para = JSON.stringify(para);
    }
    callbackPhoto = para;
    para && (obs._fire('photoCallback'));
};
//android调用摄像头返回
GetCameraCallbackAndroid = function (para) {
    /*待定*/
};
GetCameraCallbackIos = function (para) {
    /*待定*/
    // 上传出错码10002,取消上传10001，成功上传10000
    // if(para="10001"){}
    // if(para="10002"){}
    // if(para="10000"){
    //   window.location.href ="http://www.baidu.com";
    // }
};
//android调用分享返回
GetShareCallbackAndroid = function (para) {
    /*待定*/
};
//IOS调用分享返回
GetShareCallbackIos = function (para) {
    /*待定*/
};
GetScanCallback = function (para) {
    if (!para && ICBCUtil.isIPhone()) {
        history.back();
        return false;
    }
    elife_app.scanResult = para;
    obs._fire('ScanCallback');
}
GetScanCallbackIos = function (para) {
    if (!para && ICBCUtil.isAndroid()) {
        history.back();
        return false;
    }
    elife_app.scanResult = para;
    obs._fire('ScanCallback');
}
GetTokenCallback = function (para) {
    para = JSON.parse(para);
    if (!para || !para.t_k) {
        obs._fire('loginFailed');
        return false;
        console.log('不该进入此方法');
    }
    elife_app.token = para.t_k;
    localStorage.setItem('t_k', para.t_k);
    document.cookie = 't_k=' + encodeURIComponent('"' + para.t_k + '"');
    obs._fire('loginSuccess');
}
GetTokenCallbackIos = function (para) {
    if (!para || !para.t_k) {
        obs._fire('loginFailed');
        return false;
    } else {
        elife_app.token = para.t_k;
        localStorage.setItem('t_k', para.t_k);
        document.cookie = 't_k=' + encodeURIComponent('"' + para.t_k + '"');
        obs._fire('loginSuccess');
    }
}
GetNetworkStatusCallback = function (para) {
    if (typeof para === "string") {
        para = JSON.parse(para);
    }
    elife_app.networkInfo = {
        'user_select': para.user_select,
        'is_wifi': para.is_wifi
    };
    obs._fire('networkInfoCallback');
}
// 获取城市代码
GetCityCodeCallbackIos = function (para) {
    document.cookie = 'city_code=' + encodeURIComponent('"' + para.c_code + '"');
    elife_app.city_code = para.c_code;
    obs._fire('getCityCodeSuccess');
}
GetCityCodeCallbackAndroid = function (para) {
    typeof para === "string" && (para = JSON.parse(para));
    document.cookie = 'city_code=' + encodeURIComponent('"' + para.c_code + '"');
    elife_app.city_code = para.c_code;
    obs._fire('getCityCodeSuccess');
}
GetChannelCallback = function (channelNo) {
    document.cookie = 'c_no=' + encodeURIComponent('"' + channelNo + '"');
}
/***************************调用APP的方法****************************
 *********************************************************************/




//调用android定位方法
hybrid_app.prototype.GetLocationAndroid = function (para) {
    hybrid_app.prototype.OpenDialog("正在获取您的地理位置");
    var android_location;
    setTimeout(function () {
        //判断android是否支持prompt方法
        if (ICBCUtil.isSupportAndroidNewInterface) {

            //prompt('callNativeMethod','{obj:Native,func:openGPS,args:["elife"]}');
            try {
                android_location = prompt('callNativeMethod', "{obj:Native,func:DataConfigServiceServer,args:['getGPS','android']}");
            } catch (e) {
                //alert(e.message);
            }

            GetLocationCallback(android_location);
        }
        else {

            Native.getGPS('{"func":"GetLocationCallback"}');
        }
    }, 300);
};
//打开相册,相机，分享,获取个人信息 para ={ "keyword":"getPhoto",data:{....}}
hybrid_app.prototype.GetNativeFunctionAndroid = function (para) {
    var res;
    if (ICBCUtil.isSupportAndroidNewInterface) {
        switch (para.keyword) {
            case 'refresh':
                res = prompt('callNativeMethod', "{obj:Native,func:DataConfigServiceServer,args:['refresh','']}");
                break;
            case 'getChannel' :
                res = prompt('callNativeMethod', "{obj:Native,func:DataConfigServiceServer,args:['getChannel','']}");
                break;
            case 'callPhone' :
                res = prompt('callNativeMethod', "{obj:Native,func:DataConfigServiceServer,args:['callPhone','" + para.tel + "']}");
                break;
            case 'return_btn' :
                res = prompt('callNativeMethod', "{obj:Native,func:DataConfigServiceServer,args:['return_btn','']}");
                break;
            case 'getShare' :
                res = prompt('callNativeMethod', "{obj:Native,func:DataConfigServiceServer,args:['getShare','" + para.shareInfo + "']}");
                break;
            case 'getScan' :
                res = prompt('callNativeMethod', "{obj:Native,func:DataConfigServiceServer,args:['getScan',''],callBack:" + para.callback + "}");
                break;
            case 'closeWebview' :
                res = prompt('callNativeMethod', "{obj:Native,func:DataConfigServiceServer,args:['closeWebview','']}");
                break;
            // para.msg:
            // headPortrait : 头像
            // comment : 评论
            // album : 相册
            case 'getPhoto' :
                callbackPhoto = prompt('callNativeMethod', "{obj:Native,func:DataConfigServiceServer,args:['getPhoto','" + para.msg + "']}");
                obs._fire('photoCallback');
                break;
            case 'newPage' :
                prompt('callNativeMethod', "{obj:Native,func:DataConfigServiceServer,args:['newPage','" + para.url + "']}");
                break;
            case 'scanResultPage' :
                prompt('callNativeMethod', "{obj:Native,func:DataConfigServiceServer,args:['scanResultPage','" + para.url + "']}");
                break;
            case 'getNetworkStatus' :
                // 获取网络状况
                res = prompt('callNativeMethod', "{obj:Native,func:DataConfigServiceServer,args:['getNetworkStatus','']}");
                GetNetworkStatusCallback(res);
                break;
            case 'getToken' :
                res = prompt('callNativeMethod', "{obj:Native,func:DataConfigServiceServer,args:['getToken','" + para.showLoginFlag + "']}");
                // res && (document.cookie = 't_k='+ encodeURIComponent('"'+res.t_k+'"'),document.cookie='c_no='+ encodeURIComponent('"'+res.c_no+'"'),elife_app.token=JSON.stringify(res),obs._fire('doLogin'));
                res && GetTokenCallback(res);
                break;
            case 'logout' :
                prompt('callNativeMethod', "{obj:Native,func:DataConfigServiceServer,args:['logout','']}");
                break;
            case 'getCityCode':
                res = prompt('callNativeMethod', "{obj:Native,func:DataConfigServiceServer,args:['getCityCode','']}");
                GetCityCodeCallbackAndroid(res);
                break;
            case 'chatWithStore' :
                res = prompt('callNativeMethod', "{obj:Native,func:DataConfigServiceServer,args:['chatWithStore','" + para.sid + "','" + para.storeName + "']}");
                break;
        }
    } else {
        switch (para.keyword) {
            case 'getChannel' :
                Native.getChannel('{"func":"GetChannelCallback"}');
                break;
            case 'callPhone' :
                Native.callPhone(para.tel);
                break;
            case 'getPhoto' :
                Native.getPhoto('{"func":"GetPhotoCallback","entry":"' + para.msg + '"}');
                break;
            case 'return_btn' :
                break;
            case 'getShare' :
                Native.getShare('{"shareInfo" : "' + para.shareInfo + '"}');
                break;
            case 'getScan' :
                break;
            case 'closeWebview' :
                break;
            case 'getToken' :
                Native.getToken('{"func":"GetTokenCallback"}');
                break;
            case 'getNetworkStatus' :
                //TODO
                Native.getNetworkStatus('{"func":"GetNetworkStatusCallback"}');
                break;
            case 'logout' :
                Native.logout();
                break;
            case 'getCityCode' :
                Native.getCityCode('{"func":"GetCityCodeCallbackAndroid"}');
                break;
            case 'newPage' :
                Native.newPage('{"url":"' + para.url + '"}');
                break;
        }
    }
};
// channelId,userId,deviceId,headId,userType,registChannelCode,phoneNum,nickname
