'use strict';
app.controller('JobListCtrl',
    ['ENV', '$log', '$scope', '$state', '$stateParams', '$ionicPopup', 'ApiService',
    function (ENV, $log, $scope, $state, $stateParams, $ionicPopup, ApiService) {
        var alertPopup = null;
        var alertPopupTitle = '';
        $scope.JobNo = $stateParams.JobNo;
        $scope.TrxNo = $stateParams.TrxNo;
        var strTrxNo = $scope.TrxNo;
        var strPhoneNumber = sessionStorage.getItem('strPhoneNumber');
        var strCustomerCode = sessionStorage.getItem("strCustomerCode");
        var strRole = sessionStorage.getItem("strRole");
        if (strCustomerCode === null) {
            strCustomerCode = '';
        }
        if (strPhoneNumber === null) {
            strPhoneNumber = '5888865';
        }
        if (strRole === null) {
            strRole = 'Driver/Ops';
        }
        $scope.shouldShowDelete = false;
        if (strRole === 'Driver/Ops') {
            $scope.listCanSwipe = true;
        } else {
            $scope.listCanSwipe = false;
        }
        $scope.returnJobs = function () {
            $state.go('jobs', {}, { reload: true });
        };
        $scope.funcShowRole = function (roleType) {
            if (roleType === 1) {
                if (strRole === 'Driver/Ops') {
                    return true;
                } else {
                    return false;
                }
            }
            else if (roleType === 2) {
                if (strRole === 'Customer') {
                    return true;
                } else {
                    return false;
                }
            }
            else if (roleType === 3) {
                if (strRole === 'Transporter') {
                    return true;
                } else {
                    return false;
                }
            }
        };
        $scope.funcShowTruckType = function (task) {
            if (task.JobType === 'IM') {
                return 'In';
            } else if (task.JobType === 'EX' || task.JobType === 'TP') {
                return 'Out';
            } else {
                return '';
            }
        };
        $scope.funcShowLoadType = function (task) {
            if (task.JobType === 'IM') {
                return 'Unload';
            } else if (task.JobType === 'EX' || task.JobType === 'TP') {
                return 'Load';
            } else {
                return '';
            }
        };
        $scope.funcShowDatetime = function (utc) {
            return moment(utc).format('DD-MMM-YYYY HH:mm');
        };
        $scope.showContainerNo = function (task) {
            if (typeof (task.ContainerNo) === 'undefined') {
                return false;
            } else {
                if (task.ContainerNo.length > 0) {
                    return true;
                } else {
                    return false;
                }
            }
        };
        var checkEventOrder = function (task) {
            for (var i = 0; i <= $scope.tasks.length - 1; i++) {
                if ($scope.tasks[i].JobLineItemNo < task.JobLineItemNo && $scope.tasks[i].AllowSkipFlag != 'Y') {
                    if($scope.tasks[i].DoneFlag != 'Y'){
                        return false;
                    }
                }
            }
            return true;
        };
        $scope.slideDone = function (task, type) {
            if (type === 'OPEN') {
                $state.go('jobDetail', { 'Type': 'OPEN', 'ContainerNo': task.ContainerNo, 'JobNo': $scope.JobNo, 'TrxNo': task.TrxNo, 'LineItemNo': task.LineItemNo, 'Description': task.GoodsDescription01, 'Remark': task.CntrRemark, 'DoneFlag': task.CargoStatusCode });
            } else if (type === 'UPDATE') {
                $state.go('jobDetail', { 'Type': 'UPDATE', 'ContainerNo': task.ContainerNo, 'JobNo': $scope.JobNo, 'TrxNo': task.TrxNo, 'LineItemNo': task.LineItemNo, 'Description': task.GoodsDescription01, 'Remark': task.CntrRemark, 'DoneFlag': task.CargoStatusCode });
            } else {
                //if (checkEventOrder(task)) {
                    $state.go('jobDetail', { 'Type': 'DONE', 'ContainerNo': task.ContainerNo, 'JobNo': $scope.JobNo, 'TrxNo': task.TrxNo, 'LineItemNo': task.LineItemNo, 'Description': task.GoodsDescription01, 'Remark': task.CntrRemark, 'DoneFlag': task.CargoStatusCode });
                //} else {
                //    alertPopup = $ionicPopup.alert({
                //        title: 'Previous event not Done.<br/>Not allow to do this one.',
                //        okType: 'button-assertive'
                //    });
                //}
            }
        };
        var getTasks = function () {
            if(!ENV.mock){
                $scope.tasks = [
                    {
                        JobNo:          'SI0106-00172/28',
                        JobLineItemNo:  2,
                        LineItemNo:     1,
                        ContainerNo:    'CN-160303A',
                        Description:    'DHL',
                        Remark:         'Fast',
                        ItemName:       'DHL Package',
                        AllowSkipFlag:  'Y',
                        DoneFlag:       'Y'
                    },
                    {
                        JobNo:          'SI0106-00172/28',
                        JobLineItemNo:  2,
                        LineItemNo:     2,
                        ContainerNo:    'CN-160303B',
                        Description:    'Amazon',
                        Remark:         'Slow',
                        ItemName:       'Amazon Package',
                        AllowSkipFlag:  'Y',
                        DoneFlag:       ''
                    },
                    {
                        JobNo:          'SI0106-00172/28',
                        JobLineItemNo:  2,
                        LineItemNo:     3,
                        ContainerNo:    'CN-160303C',
                        Description:    'Taobao',
                        Remark:         'Transfer',
                        ItemName:       'Taobao Package',
                        AllowSkipFlag:  'Y',
                        DoneFlag:       ''
                    }
                ];
            }else{
                var strUri = "/api/tms/sibl2/list?TrxNo=" + strTrxNo;
                ApiService.GetParam(strUri, true).then(function success(result){
                    $scope.tasks = result.data.results;
                    if (result.data.results.length == 0) {
                        alertPopup = $ionicPopup.alert({
                            title: 'No Tasks.',
                            okType: 'button-calm'
                        });
                    }
                });
            }
        };
        getTasks();
    }
]);
