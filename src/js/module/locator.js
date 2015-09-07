//定位选择页面js
elife.controller('LocatorCtrl', ['$scope','$http', '$routeParams', 'API', '$anchorScroll','$cookieStore','$timeout','$rootScope','_serarchCity', function($scope,$http, $routeParams, API, $anchorScroll,$cookieStore,$timeout,$rootScope,_serarchCity){
  
  // 返回按钮
  // elife_app.SetReturnBtn();
  if($routeParams.no){
    $scope.no = $routeParams.no;
  }
  var scrollable = document.getElementById('LocatorScrollableContent');
  // var scrollableContentController = elem.controller('scrollableContent');

  if (!localStorage.getItem('lat') || !localStorage.getItem('lng') || !localStorage.getItem('city_name')) {
    $rootScope.toast('正在获取您的地理位置');
    $timeout(function() {
      API.doGPSLocation();
    },0);

    obs._on('positionCallback', function(){
      $timeout(function(){
        if(callbackPosition){
          getLocation(callbackPosition.latitude, callbackPosition.longitude);
        }
      }, 0);
    });
  }

  var alphas= [];
  for(var i =0, n = 26; i< n; i++){
    alphas.push(String.fromCharCode(65 + i));
  }

  $scope.getAlphas = function(){
    return alphas;
  };

  // 字母快速定位
  $scope.locate = function(id){
    var target = document.getElementById(id);
    if(scrollable && target){
      var offset = target.offsetTop - scrollable.offsetTop;
      scrollable.scrollTop = offset;
    }
  };

  //搜索面板的显示和展开
  $scope.searchPaneShow = false;
  $scope.toggleearchPane = function(show){
      console.log("焦点失去。。"+show);
      $scope.searchPaneShow = show || false;
  };

  // || 2015.5.4 ||

  // 获取热门城市
  API.getHotSearchCity({}).then(function(data){
    $scope.hotCity = data.data;
    console.log("获取热门城市");
    console.log($scope.hotCity);
  },function(data){
    $rootScope.toast("请检查网络状况");
  });
  // $http.post('http://223.223.177.38:8082/OFSTCUST/area/hotCity.action',{
  //   't_k' : $rootScope.token,
  //   'c_no' : $cookieStore.get('c_no'),
  //   'country_code' : ''
  // }).success(function (data) {
  //   console.log(data);
  //   if (data.res == "0") {
  //     $scope.hotCity = data.data;
  //   }
  // });
  
  //设置历史城市记录
  var setHistoryCity = function(cityName, cityCode){
    var old = "";
    if(localStorage.getItem('historyCity')) {
      old = localStorage.getItem('historyCity');
    }
    var oldCitys = [];
    if(old !== "")
      oldCitys = old.split(",");
    var cityTemp = cityName + "-" + cityCode;
    //判断点击的城市是否存在
    for(var i=0, ocLength = oldCitys.length; i<ocLength; i++ ) {
      //若存在赋值给当前变量
      if (cityTemp == oldCitys[i]) {
        cityTemp = oldCitys.splice(i, 1);
        break;
      }
    }
    //将当前点击的城市添加到数组第一项
    oldCitys.splice(0, 0, cityTemp); 

    //若添加完超过10个，删除第11个
    if(oldCitys.length > 10) {
      oldCitys.pop(10, 1);
    }
    var now = oldCitys.join(',');
    localStorage.setItem('historyCity',now);
    getHistoryCity();
  };
  //个人信息
  var myCity = function (cityName, cityCode) {
    setHistoryCity(cityName, cityCode);
    //返回个人信息
    history.back();
    // $location.path('/personal/personal_info');
  };
  //首页
  var indexCity = function (cityName, cityCode) {
    setHistoryCity(cityName, cityCode);
    //返回首页
    localStorage.setItem('city_name', cityName);
    localStorage.setItem('city_code', cityCode);
    $cookieStore.put('city_name', cityName);
    $cookieStore.put('city_code', cityCode);
    if(!checkChooseCity(cityName)){
      $rootScope.toast("暂不支持该城市");
      return;
    }
    location.href = '#/home/index';
  };
  //检查当前城市
  function checkChooseCity(cityName){
    for(var i=0; i<$scope.searchResultList.length; i++){
      if(cityName === $scope.searchResultList[i].name){
        return true;
      }
    }
    return false;
  }

  // 获取城市列表
  if($scope.no){
    API.getAllCity({}).then(function(data){
      console.log(data);
      $scope.areaInfo = data;
      var citys = [];
      for(var i=0; i<26; i++) {
        citys = citys.concat(data[alphas[i]]);
      }
      $scope.searchResultList = citys;
    },function(data){
      //do nothing
    });
  } else {
    API.getCity({}).then(function(data){
      console.log(data);
      $scope.areaInfo = data;
      var citys = [];
      for(var i=0; i<26; i++) {
        citys = citys.concat(data[alphas[i]]);
      }
      $scope.searchResultList = citys;
    },function(data){
      //do nothing
    });
  }
    
  // $http.post('http://223.223.177.38:8082/OFSTCUST/area/showAlphaCity.action',{
  //   't_k' : $rootScope.token,
  //   'c_no' : $cookieStore.get('c_no'),
  //   'country_code' : 'CN'
    
  // })
  // .success(function (data) {
  //   if (data.res == '0') {
  //     // success
      
  //     $scope.areaInfo = data.data[0];
  //     console.log(data.data[0].A[0]);
  //     var citys = data.data;
  //     $scope.allCity = citys;
  //   }
  // });

  // 修改常住地


  $scope.doSubmitAddress = function (city_name, city_code) {
    API.changePersonalInfo({
      't_k': $cookieStore.get('t_k'),
      'c_no' : $cookieStore.get('c_no'),
      'req_type' : 'address',
      'n_address' : city_name
    }).then(function(){
      myCity(city_name, city_code);
    },function(){
      $rootScope.toast("地址修改失败，请检查网络状况");
    });
    //将当前城市存入cookie
    // $http.post('http://223.223.177.38:8082/OFSTCUST/cuinfo/updateCuinfo.action',{
    //   't_k' : $rootScope.token,
    //   'c_no' : $cookieStore.get('c_no'),
    //   'req_type' : 'address',
    //   'n_address' : city_name
    // })
    // .success(function (data) {
    //   console.log(data);
    //   if (data.res == '0') {
    //     console.log('修改成功！');
    //     history.back();
    //   }
    // });
    return;
  };
  //修改定位城市
  $scope.doChooseAddress = function (city_name, city_code) {
    // $http.post('http://118.144.88.162:8082/OFSTCUST/cuinfo/updateCuinfo.action',{
    //   't_k' : $rootScope.token,
    //   'c_no' : $cookieStore.get('c_no'),
    //   'req_type' : 'address',
    //   'c_code' : city_code
    // })
    // .success(function (data) {
    //   console.log(data);
    //   if (data.res == '0') {
    //     console.log('修改成功！');
    //     $cookieStore.put('city_code',city_code);
    //     $cookieStore.put('city_name', city_name);
    //     history.back();
    //   }
    // });

    //将当前城市存入localStorage
    indexCity(city_name, city_code);
  };
    // var timer;
    // $scope.$watch('cityKeyword',function (newVal) {
    //   if (newVal) {
    //     if (timer) {
    //       $timeout.cancel(timer);
    //     }
    //     timer = $timeout(function () {
    //       var url = $rootScope.baseUrl + 'OFSTCUST/area/search.action';
    //       $http.post(url,{
    //         't_k' : $rootScope.token,
    //         'c_no' : $cookieStore.get('c_no'),
    //         'country_code' : 'CN',
    //         'keyword' : newVal
    //       })
    //       // _serarchCity
    //       .success(function (data) {
    //         console.log(data);
    //         $scope.searchResultList = data.data;
    //       });
    //     },500);
    //   }
    // });
  //获取历史搜索记录
  function getHistoryCity() {
    var hcity = [];
    if(localStorage.getItem('historyCity')){
       hcity = localStorage.getItem('historyCity').split(',');
    }
    var historyCity = [];
    for(var j=0, hlength=hcity.length; j<hlength; j++) {
      var temp = hcity[j].split('-');
      var tempCity = {city_name : temp[0], city_code : temp[1]};
      historyCity.push(tempCity);
    }
    $scope.historyCitys = historyCity;
  }
  getHistoryCity();
  
  //后台返回定位城市
  var getLocation = function(latitude, longitude) {
    console.log('2');
    // var latitude = document.getElementById('latitude').value;
    // var longitude = document.getElementById('longitude').value;
    API.getCityCodeByGPS({
      'latitude': latitude,
      'longitude': longitude
    }).then(function(data){
      if(data.res === '0'){
        $scope.locationName = data.data.city_name;
        $scope.locationCode = data.data.city_code;
        $scope.doChooseAddress(data.data.city_name, data.data.city_code);
      }else if(data.res ==='1000005'){
        $scope.toast('无法定位到您所在的城市');
      }else{
        $scope.toast('系统异常');
      }
    },function(data){
      
    });
    return;
  };


  obs._on('positionCallback',function () {
    $timeout(function(){
      // alert(callbackPosition);
      if(callbackPosition){
        var backPosition = callbackPosition;
        if(typeof(callbackPosition) === 'string') {
          var backPhoto = JSON.stringify(callbackPhoto);
        }
        localStorage.setItem('lat', backPosition.latitude);
        localStorage.setItem('lng', backPosition.longitude);
        getLocation(backPosition.latitude, backPosition.longitude);
      }
    }, 0);
  });
}]);