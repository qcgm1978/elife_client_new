elife.controller('PhotoEditCtrl', [
    'API',
    '$scope',
    '$rootScope',
    '$location',
    '$cookieStore',
    '$routeParams',
    function (API, $scope, $rootScope, $location, $cookieStore, $routeParams) {
        var KEY_PHOTO_ADDED_CACHE = "photoAddedCache";
        var KEY_SELECT_PHOTO = "selectPhoto";
        var imgTemp = $cookieStore.get(KEY_SELECT_PHOTO);
        $scope.store_id = $routeParams.store_id;
        $scope.image_id = imgTemp.id;
        $scope.image_url = imgTemp.url;
        console.log("图片list");

        // 照片旋转
        $scope.rotate = 0;
        $scope.doRotate = function(){
            $scope.rotate = ($scope.rotate + 1) % 4;
            console.log($scope.rotate);
        };
        //这边的t_k、c_no仅作测试用，写死了
        API.getStoreAlbums({
           'store_id': $scope.store_id
        }).then(function(data){
            console.log('商户相册');
            console.log(data);
            $scope.albumList = data.data;
            //测试
            // $scope.albumList = [
            //     {'aid': '2015060201061312001100001', "adesc":"相册描述", 'aname':'菜'},
            //     {'aid': '1', 'aname':'价目表'},
            //     {'aid': '2', 'aname':'环境'},
            //     {'aid': '3', 'aname':'全部'},
            //     {'aid': '4', 'aname':'饮食'}
            // ];
            console.log($scope.albumList);
            $scope.currentAlbum = $scope.albumList[0];
        }, function(data){
            console.log('获取商户相册失败');
            $scope.toast("请检查网络状况");
        });

        $scope.selectAlbum = function(album){
            $scope.currentAlbum = album;
        };

        $scope.confirm = function() {
            var photoCache = $cookieStore.get(KEY_PHOTO_ADDED_CACHE);
            photoCache = photoCache.map(function(photo) {
                if (photo.id === $scope.image_id) {
                    photo.desc = $scope.comment;
                    photo.type = $scope.currentAlbum;
                    photo.rotate =$scope.rotate;
                }
                return photo;
            });
            $cookieStore.remove(KEY_PHOTO_ADDED_CACHE);
            $cookieStore.put(KEY_PHOTO_ADDED_CACHE, photoCache);
            history.back();
        };

        // 删除本张照片
        $scope.doDelete = function(){
            // 执行删除本张照片操作（应该是从cookie或者local存储中删除）

            // 返回照片编辑页面
            //$location.path("/review/photo_added");
            API.deleteAlbumPhoto({
                "img_id": $scope.image_id
            }).then(function() {
                var photoCache = $cookieStore.get(KEY_PHOTO_ADDED_CACHE);
                photoCache = photoCache.filter(function(photo) {
                    if (photo.id !== $scope.image_id) {
                        return true;
                    }
                    return false;
                });
                $cookieStore.remove(KEY_PHOTO_ADDED_CACHE);
                $cookieStore.put(KEY_PHOTO_ADDED_CACHE, photoCache);
                history.back();
            });
        };
    }
]);