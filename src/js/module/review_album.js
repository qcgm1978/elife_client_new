elife.controller('ReviewAlbumCtrl', [
    '$scope',
    '$http',
    '$cookieStore',
    '$routeParams',
    'SharedState',
    'API',
    '$rootScope',
    function($scope, $http, $cookieStore,$routeParams, SharedState, API,$rootScope) {
        elife_app.SetReturnBtn();

        $scope.id = $routeParams.id;
        $scope.imgBaseUrl = $rootScope.imgBaseUrl;

        console.log($scope.id);

        API.getStoreAlbums({
            "store_id": $scope.id
        }).then(function(data){
            console.log('商户相册');
            console.log(data);

            $scope.albumList = data.data || [];
            //测试
            // $scope.albumList = [
            //     {'aid': '1','aname':'菜'},
            //     {'aid': '2', 'aname':'价目表'},
            //     {'aid': '3', 'aname':'环境'},
            //     {'aid': '4', 'aname':'全部'},
            //     {'aid': '5', 'aname':'饮食'}
            // ];
            var tabCount = $scope.albumList.length/4;
            if ($scope.albumList.length%4){
                tabCount += 1;
            }
            tabCount = parseInt(tabCount);
            var mainCategory = [];
            var tabIndex = "1";
            $scope.albumList.map(function(album) {
                album.tabIndex = tabIndex + "";
                tabIndex++;
            });
            for (var i = 0; i < tabCount; i++){
                var category = $scope.albumList.slice(i*4, (i+1) > tabCount ? tabCount*4 : (i+1)*4);
                mainCategory[i] = {
                    'category' : category
                };
            }

            $scope.mainCategory = mainCategory;
            $scope.activeTab = 1;

            console.log($scope.albumList);
            console.log($scope.mainCategory);

            // 获取第一个相册的图片
            if ($scope.albumList.length > 0) {
                $scope.getPhotoList($scope.albumList[0]);
            }
        }, function(data){
            console.log('获取商户相册失败');
            $scope.toast("请检查网络状况");
        });

        $scope.showPhoto = function(img) {
            $scope.imgTemp = img;
        };
      //t_k\c_no写死做测试
        $scope.getPhotoList = function(album){
            $scope.currentAlbumId = album.aid;
            API.getAlbumPhotos({
                "album_id": album.aid,
                "s_row": 0,
                "e_row": 20
            }).then(function(data){
                console.log('第一个相册图片');
                console.log(data);

                $scope.photoList = data.data || [];
                console.log($scope.photoList);
            });
        };
        //document.getElementsByClassName('album_image').style.padding = '10px';
        $scope.validateLogin = function (url) {
            if (API.isLogin()) {
                location.hash = url.slice(1);
            } else {
                API.doLogin();
                return;
            }
        };
        $scope.toAddPhoto = function () {
            var new_url = document.getElementById("toAddPhoto").getAttribute("link-data");
            location.hash = new_url;
        };
    }
]);


elife.controller('ReviewCommentAlbumCtrl', [
    '$scope',
    '$cookieStore',
    'SharedState',
    'API',
    '$rootScope',
    function($scope, $cookieStore, SharedState, API,$rootScope) {
        elife_app.SetReturnBtn();
        var KEY_COMMENT_IMG_LIST = "commentImgList";

        $scope.imgs = $cookieStore.get(KEY_COMMENT_IMG_LIST) || [];

        $scope.showPhoto = function(img) {
            $scope.imgTemp = img;
        };
    }
]);
