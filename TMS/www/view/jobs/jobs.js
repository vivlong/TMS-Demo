'use strict';
app.controller('JobsCtrl',
    ['ENV', '$log', '$scope', '$state', '$ionicPopup', 'ApiService',
    function (ENV, $log, $scope, $state, $ionicPopup, ApiService) {
        var alertPopup = null;
        var alertPopupTitle = '';
        var RecordCount = 0;
        var dataResults = new Array();
        $scope.List = {
            CanLoadedMoreData: true
        };
        var strDriverName = sessionStorage.getItem('strDriverName');
        var strPhoneNumber = sessionStorage.getItem('strPhoneNumber');
        if (strDriverName != null && strDriverName.length > 0) {
            $scope.strName = strDriverName;
        } else {
            $scope.strName = "Driver";
        }
        if (strPhoneNumber === null) {
            strPhoneNumber = '5888865';
        }
        $scope.strItemsCount = "loading...";
        $scope.returnMain = function () {
            $state.go('main', {}, { reload: true });
        };
        $scope.GoToDetail = function (Job) {
            $state.go('jobList', { 'JobNo': Job.JobNo, 'TrxNo': Job.TrxNo }, { reload: true });
        };
        $scope.loadMore = function() {
            var strUri = '/api/tms/jmjm1/sps?RecordCount=' + RecordCount;
            ApiService.GetParam(strUri, false).then(function success(result) {
                if (result.data.results.length > 0) {
                    dataResults = dataResults.concat(result.data.results);
                    $scope.Jobs = dataResults;
                    $scope.List.CanLoadedMoreData = true;
                    RecordCount = RecordCount + 20;
                } else {
                    $scope.List.CanLoadedMoreData = false;
                    RecordCount = 0;
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        };
        var funcShowList = function () {
            if(!ENV.mock){
                $scope.Jobs = [
                    {
                        JobNo: 'SI0106-00172/28',
                        ContainerCounts:"3",
                        TaskDoneCounts:"1"
                    }
                ];
                if ($scope.Jobs.length === 1) {
                    //$state.go('list', { 'JobNo': $scope.Jobs[0].JobNo }, { reload: true });
                } else if ($scope.Jobs.length < 1) {
                    alertPopupTitle = 'No Tasks.';
                    alertPopup = $ionicPopup.alert({
                        title: alertPopupTitle,
                        okType: 'button-calm'
                    });
                    alertPopup.then(function(res) {
                        $log.debug(alertPopupTitle);
                    });
                    return;
                }
            }else{
                var strUri = '/api/tms/jmjm1/sps?RecordCount=' + RecordCount;
                ApiService.GetParam(strUri, true).then(function success(result){
                    $scope.Jobs = result.data.results;
                    if (response.data.results.length === 1 && $stateParams.blnForcedReturn === 'N') {
                        $state.go('list', { 'JobNo': response.data.results[0].JobNo }, { reload: true });
                    } else if (response.data.results.length < 1) {
                        alertPopupTitle = 'No Tasks.';
                        alertPopup = $ionicPopup.alert({
                            title: alertPopupTitle,
                            okType: 'button-calm'
                        });
                        alertPopup.then(function(res) {
                            $log.debug(alertPopupTitle);
                        });
                        return;
                    }
                });
            }
        };
        //funcShowList();
    }]);
