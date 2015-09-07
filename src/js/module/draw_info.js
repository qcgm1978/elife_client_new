elife.controller('DrawInfoCtrl', ['$scope', '$rootScope', 'SharedState', 'API', '$routeParams', '$window', function ($scope, $rootScope, SharedState, API, $routeParams, $window) {
    $scope.drawCode = $routeParams.id;
    $scope.winnerName = '';
    $scope.winnerNumber='';
    $scope.winnerId='';
    //$rootScope.Ui.turnOff('test_modal');
    API.getDrawDetail({
        code: $scope.drawCode
    }).then(function (data) {
        console.log('抽奖详情');
        console.log(data);
        $scope.countDown = API.setCountdown(data.remaining_time);
        $scope.detail = {
            code: data.code,
            phone_url: data.imgUrl,
            phoneName: data.prizeName,
            number: '已参与' + (data.can_count || '0') + '人',
            title: data.activityName || '万一中了呢XX期',
            drawDetail: data.activityDetails,
            state: data.status,
            if_join: data.if_join,
            if_win: data.if_win,
            if_prizeInfo: data.if_prizeInfo,
        };
        $scope.updateBtn();
    }, function (data) {
        console.error("获取抽奖详情失败：" + data);
    });
    $scope.drawButton = function () {
        switch ($scope.detail.eventType) {
            case '1':
                //查看中奖名单
                $window.location.href = '#/draw/winnerlist/' + $scope.detail.code;
                break;
            case '2':
                //抽奖
                if (!API.isLogin()) {
                    console.log('未登录');
                    API.doLogin();
                    return;
                }
                API.joinAward({
                    'code': $scope.detail.code
                }).then(function (data) {
                    var res = data.res;
                    if (res === '0') {
                        $scope.toast('抽奖成功');
                        $scope.detail.if_join = '1';
                    } else if (res == '100008') {
                        $scope.toast('请不要重复抽奖');
                        $scope.detail.if_join = '1';
                    } else if (res == '1000009') {
                        $scope.toast('抽奖已经结束');
                        $scope.detail.state = '2';
                    }
                    $scope.updateBtn();
                }, function (data) {
                    console.error("参与抽奖错误");
                    $scope.toast('网络异常');
                });
                break;
            case '3':
                //填写中奖信息

                $rootScope.Ui.turnOn('test_modal');
                $scope.updateBtn();
                break;
            case '4':
                //无响应
                break;
            default:
                break;
        }
    };
    //$rootScope.Ui.turnOn('test_modal');
    $scope.updateBtn = function () {
        $scope.detail.red = true;
        if ($scope.detail.if_join == '1' && $scope.detail.status == '2') {
            $scope.detail.red = false;
        }
        if ($scope.detail.state == '0') {
            $scope.detail.labelState = 'HOT';
        } else {
            $scope.detail.labelState = '已结束';
        }
        //设定按钮内容 您中奖了 查看中奖名单 我要抽奖 已参与抽奖
        //设定按钮的事件类型：1 查看中奖名单 2 抽奖 3 填写中奖信息 4无响应
        if ($scope.detail.if_win == '1') {
            $scope.detail.btnContent = '您中奖了';
            $scope.detail.eventType = '3';
            if ($scope.detail.if_prizeInfo == '1') {//已录入信息
                $scope.detail.btnContent = '查看中奖名单';
                $scope.detail.eventType = '1';
            }
        } else if ($scope.detail.if_join == '1') {
            if ($scope.detail.state == '0') {
                $scope.detail.red = false;
                $scope.detail.btnContent = '已参加抽奖';
                $scope.detail.eventType = '4';
            } else {
                $scope.detail.btnContent = '查看中奖名单';
                $scope.detail.eventType = '1';
            }
        } else {
            if ($scope.detail.state == '0') {
                $scope.detail.btnContent = '我要抽奖';
                $scope.detail.eventType = '2';
            } else {
                $scope.detail.btnContent = '查看中奖名单';
                $scope.detail.eventType = '1';
            }
        }
    };
}]);
elife.controller('fillInAwardForm', function($scope,$rootScope,API){
    $scope.submitInfo = function () {
        console.log($scope.winnerNumber);

        if (!$scope.winnerName || $scope.winnerName === '') {
            $scope.toast("请填写您的姓名");
            return;
        }
        if (!$scope.winnerNumber || $scope.winnerNumber === '') {
            $scope.toast("请填写您的手机号码");
            return;
        }
        if (!$scope.winnerId || $scope.winnerId === '') {
            $scope.toast("请填写您的身份证号");
            return;
        }
        $rootScope.Ui.turnOff('test_modal');
        API.submitInfo({
            'code': $scope.detail.code,
            'real_name': $scope.winnerName,
            'phone': $scope.winnerNumber,
            'card_no': $scope.winnerId,
            'if_win': '1'
        }).then(function (data) {
            console.log(data);
            var res = data.res;
            if (res === '0') {
                //填写成功
                $scope.detail.if_prizeInfo = '1';
                $scope.toast('填写成功');
            }//TODO 增加其他状态码
            $scope.updateBtn();
        }, function (data) {
            console.error("提交中奖人员信息错误");
            $scope.toast('网络异常');
        });
    };

});