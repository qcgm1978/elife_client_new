
elife.controller('MyCommentCtrl',['$scope', '$http', '$cookieStore', '$timeout', '$rootScope', 'SharedState', 'API','$location', function($scope, $http, $cookieStore, $timeout, $rootScope, SharedState,API,$location){
  console.log($location);
  if(ICBCUtil.isElifeIos()){
    ICBCUtil.nativeGetConfig({
        'key': 'tabbarhidden',
        'callBack': ''
    });
  }
  // 返回按钮
  elife_app.SetReturnBtn();
// (function (){
//    getCommentList();
// })();
  $scope.loading = true;
  $scope.mark = false;
  $scope.loadingMore = true;

  $scope.reviews = [];
  $scope.e_row = 0;
  $scope.page_size = 9;
  
  $scope.getCommentList =  function(){
    $scope.loading = true;
    $scope.mark = true;
    $scope.notip = false;
    // var para = {
    //     's_row' : 1,
    //     'e_row' : 10
    //   };
    var para= {};
    para.s_row = $scope.e_row + 1;
    para.e_row = para.s_row + $scope.page_size;
    $scope.e_row = para.e_row;
    
    API.getUserComment(para).then(function(data){
      console.log("点评详情");
      console.log(data);
      if ($scope.load_timer) {
          $timeout.cancel($scope.load_timer);
      }
      // $scope.commentList = data;
      if(data.length === 0){
        $scope.loadingMore = false;
      }
      $scope.reviews = $scope.reviews.concat(data ? data : null);
      console.log('?????????????????????????????');
      console.log($scope.reviews);
      if($scope.reviews.length === 0) {
        $scope.notip = true;
      }
      for(var i=0; i<$scope.reviews.length; i++) {
        $scope.reviews[i].longEnough=$scope.reviews[i].dcmt_content.length>65?true:false;
        $scope.reviews[i].content = $scope.reviews[i].dcmt_content.substr(0, 65);
        $scope.reviews[i].more = $scope.reviews[i].dcmt_content.substr(65, $scope.reviews[i].dcmt_content.length);
        $scope.reviews[i].detailPath = $scope.reviews[i].big_type === "Store" ? "business/index/"+$scope.reviews[i].cis_num :
            $scope.reviews[i].big_type === "Bank" ? "discount/card_offer/"+$scope.reviews[i].cis_num:
            $scope.reviews[i].big_type === "StoreTxt" ? "discount/business_offer/"+$scope.reviews[i].cis_num:
            "discount/customers/" + $scope.reviews[i].cis_num;
        $scope.reviews[i].detailPath2 = $scope.reviews[i].detailPath;
        if( $scope.reviews[i].big_type === "Bank"){
          $scope.reviews[i].detailPath2 += '/bank';
        }
        if( $scope.reviews[i].big_type === "StoreTxt"){
          $scope.reviews[i].detailPath2 = "discount/business_offer/"+$scope.reviews[i].store_no+'/'+$scope.reviews[i].cis_num + '/store';
        }
        if($scope.reviews[i].big_type === "Group"){
          $scope.reviews[i].detailPath2 = "discount/customers/" + $scope.reviews[i].store_no+'/'+$scope.reviews[i].cis_num;
        }
      }
      $scope.e_row = $scope.reviews.length;
      $scope.loading = false;
      $scope.load_timer = $timeout(function(){
          $scope.mark = false;
      }, 1000);
      console.log($scope.reviews);
    },function(data){
      $scope.e_row = 0;
      $scope.loading = false;
      $scope.mark = false;
      console.error('获取网友点评失败，错误代码:'+data);
    });
  };
  $scope.isEditing =false;
  // 待删除列表
  var deleteList = [];
  $scope.edit = function(){
    if($scope.isEditing){
      $scope.isEditing = false;
      //执行删除操作
    }else{
      $scope.isEditing = true;
      deleteList = [];
    }
  };
  $scope.coIndexArry=[];
  $scope.select = function(comment){
    var coIndex=$scope.reviews.indexOf(comment);
    var index  = deleteList.indexOf(comment);
    if(index === -1){
      $scope.coIndexArry.push(coIndex);
      deleteList.push(comment);
    }else{
      $scope.coIndexArry.splice(coIndex,1);
      deleteList.splice(index, 1);
    }
  };

  $scope.isSelect = function(comment){
    var index  = deleteList.indexOf(comment);
    return index != -1;
  };
  $scope.cancel = function(){
    $scope.isEditing = false;
    deleteList = [];
  };

  $scope.preDelete = function(){
    if(deleteList && deleteList.length > 0){
      SharedState.turnOn('comment_del_modal');
    }else{
      SharedState.turnOn('comment_error_modal');
    }
  };
  $scope.delete = function(){
    var deleteId = [];
    for(var i=0, n= deleteList.length; i<n; i++){
      // var index  = $scope.commentList.indexOf(deleteList[i]);
      // if(index != -1){
      //   var temp = $scope.commentList.splice(index, 1);
      //   deleteId.push(temp.Id);
      // }
      deleteId.push(deleteList[i].Id);

    }
    $scope.isEditing = false;
    if(deleteId.length > 0) {
      $http.post($rootScope.baseUrl + '/OFSTCUST/comment/deleteComments.action',{
        't_k' : $cookieStore.get('t_k'),
        'c_no' : $cookieStore.get('c_no'),
        'dcmt_id' : deleteId.join(",")
      }).success(function(data){
        console.log("删除成功~~~~");
        $scope.coIndexArry = [];
        deleteList = [];
        // $scope.reviews = $scope.reviews.slice(deleteId.length);
        $rootScope.toast("删除成功");
        $scope.reviews = [];
        $scope.e_row = 0;
        $scope.getCommentList();
        //$scope.getCommentList();
        if(data.res != "0") {
          $rootScope.toast("删除失败");
        }
      }).error(function (data) {
        console.error('获取网友点评失败，错误代码:'+data);
      });
    }
  };
  
  $scope.getCommentList();
  $scope.showLoading = function () {
      $scope.mark = true;
      $scope.loadingMore = true;
  };
  $scope.toAblum = function(imagelist){
    var image_list = [];
    for(var i=0; i<imagelist.length; i++){
      image_list[i] = {};
      image_list[i].review_image_url = imagelist[i].image_url;
    }
    var KEY_COMMENT_IMG_LIST = "commentImgList";
    $cookieStore.remove(KEY_COMMENT_IMG_LIST);
    $cookieStore.put(KEY_COMMENT_IMG_LIST, image_list);

    location.href = "#/review/album";
  };
  
}]);

elife.controller('MyCommentDetailCtrl',['$scope', '$http', '$cookieStore', 'API', 'SharedState', '$routeParams', function($scope, $http, $cookieStore, API, SharedState, $routeParams){
  // 返回按钮
  elife_app.SetReturnBtn();
  
  if($routeParams.a !== "business"){
    $routeParams.c += '/bank';
  }
  $scope.id = $routeParams.id;
  $scope.a = $routeParams.a;
  $scope.b = $routeParams.b;
  $scope.c = $routeParams.c;
  $scope.detailPath = $scope.a + '/' + $scope.b + '/' + $scope.c;
  API.getCommentDetail({'dcmt_id' : $scope.id}).then(function(data){
    console.log(data);
    $scope.comment = data;
    $scope.comment.small_type = $scope.comment.small_type || "dis";
    $scope.imgs = $scope.comment.image_list || [];
  },function(data){
    console.error('获取网友点评失败，错误代码:'+data);
  });
  $scope.des = ['差', '一般', '好', '很好', '非常好'];

}]);