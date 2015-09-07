elife.controller('MoreIndexCtrl',['$scope', '$http', '$cookieStore', '$timeout', '$rootScope', 'SharedState', 'API','$location', function($scope, $http, $cookieStore, $timeout, $rootScope, SharedState,API,$location){
  console.log($location);
  if(ICBCUtil.isElifeIos()){
    ICBCUtil.nativeGetConfig({
        'key': 'tabbarhidden',
        'callBack': ''
    });
  }
  var ua = navigator.userAgent.toLowerCase();
  $scope.isAndroid = ua.indexOf('android') > -1;
  $scope.callphone = function (tel) {
    $timeout(function () {
        elife_app.GetNativeFunctionAndroid({'keyword':'callPhone','tel':tel});
    },0);
  };
  // 返回按钮
  elife_app.SetReturnBtn();

}]);