elife.controller('PhotoAddedCtrl',  [
    '$scope',
    '$location',
    '$anchorScroll',
    '$rootScope',
    '$http',
    '$routeParams',
    '$timeout',
    '$cookieStore',
    'API',
    'SharedState',
    function($scope, $location, $anchorScroll, $rootScope, $http, $routeParams, $timeout, $cookieStore, API, SharedState) {
        var KEY_PHOTO_ADDED_CACHE = "photoAddedCache";
        var KEY_SELECT_PHOTO = "selectPhoto";

        $scope.store_id = $routeParams.store_id;
        $scope.ablum_id = $routeParams.ablum_id;

        //上传照片
        $scope.imgs = $cookieStore.get(KEY_PHOTO_ADDED_CACHE) || [];
        console.log($scope.imgs);
        $scope.getPhoto = function (para) {
            if($scope.imgs && $scope.imgs.length >= 9){
                $rootScope.toast('最多一次支持上传9张');
                return;
            }
            $timeout(function () {
                if (ICBCUtil.isElifeAndroid() || ICBCUtil.isAndroid()) {
                    // elife_app.GetNativeFunctionAndroid({'keyword':'getPhoto'});
                    elife_app.GetNativeFunctionAndroid({'keyword':'getPhoto','msg':para});
                } else if (ICBCUtil.isElifeIos()) {
                    ICBCUtil.nativeGetConfig({
                        'key': 'getPhoto',
                        'dataString': para,
                        'callBack': "GetPhotoCallback"
                    });
                } else {
                    GetPhotoCallback({"id": "123456", "url": "add_photo.png"});
                }
            },0);

            obs._on('photoCallback',function () {
                // 返回null的时候
                if (!callbackPhoto) {
                    return;
                }
                if (typeof callbackPhoto === "object") {
                    data = callbackPhoto;
                } else if (typeof callbackPhoto === "string") {
                    data = JSON.parse(callbackPhoto);
                }
                if (Array.isArray(data)) {
                    console.log("adfasdf");
                    $scope.imgs = $scope.imgs.concat(data);
                } else {
                    $scope.imgs.push(data);
                }
                if($scope.imgs && $scope.imgs.length > 9) {
                    $rootScope.toast('最多一次支持上传9张');
                    $scope.imgs.splice(9);
                }
                // alert(JSON.stringify($scope.imgs));
                $cookieStore.remove(KEY_PHOTO_ADDED_CACHE);
                $cookieStore.put(KEY_PHOTO_ADDED_CACHE, $scope.imgs);
                // $location.path("/review/photo_edit/" + $scope.store_id + "/" + data.bid + "/" + data.url);
                // reset global
                global = {};
            });
        };

        $scope.goBack = function(data){
             
            SharedState.turnOff('success_modal');
            $cookieStore.remove(KEY_PHOTO_ADDED_CACHE);
            if(ICBCUtil.isElifeIos() || ICBCUtil.isElifeAndroid()){

    
          // 
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
                SharedState.turnOn('back_modal');
        };
    
        //如果正在输入点评内容 不提交
        // $scope.preSubmit = function(){
        //     if($scope.isTyping){
        //         return;
        //     }else{
        //         $scope.submitImage();
        //     }
        // };
    
        $scope.submitImage = function () {
            if($scope.imgs.length === 0){
                $rootScope.toast('请上传照片');
                return;
            }
            var param = {};
            param.store_id = $scope.store_id;   
            var image_data = $scope.imgs.map(function(img) {
                console.log(img);
                var imgInfo = {};
                imgInfo.imgid = img.id;
                //imgInfo.imgid = '200';
               //imgInfo.imgid = new Date().getMilliseconds()+"";
                imgInfo.desc = img.desc || '';
                imgInfo.type = img.type ? img.type.aid : $scope.ablum_id;
                return imgInfo;
            });
            param.image_data = JSON.stringify(image_data);
            console.log(param);
            API.saveAlbumImgs(param).then(function (data) {
                $cookieStore.remove(KEY_PHOTO_ADDED_CACHE);
                if (data.res === '0') {
                    SharedState.turnOn('success_modal');
                }
            },function (data) {
                $scope.toast('照片上传失败！');
            });

            //上传
            // API.addImgs(param).then(function(data){
            //  console.log("上传成功");
            //  SharedState.turnOn('success_modal');
            // },function(data){
            //  console.error(data);
            // });
        };

        $scope.toPhotoEdit = function(id, url){
            var imgTemp = {id : id, url : url};
            $cookieStore.remove(KEY_SELECT_PHOTO);
            $cookieStore.put(KEY_SELECT_PHOTO, imgTemp);
            location.href = '#/review/photo_edit/'+$scope.store_id;
        };
    }
]);