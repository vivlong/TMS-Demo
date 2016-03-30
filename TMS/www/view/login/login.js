'use strict';
app.controller('LoginCtrl',
    ['ENV', '$log', '$scope', '$http', '$state', '$stateParams', '$ionicPopup', '$timeout', '$cordovaToast', '$cordovaFile', '$cordovaAppVersion', 'ApiService',
    function (ENV, $log, $scope, $http, $state, $stateParams, $ionicPopup, $timeout, $cordovaToast, $cordovaFile, $cordovaAppVersion, ApiService) {
        var alertPopup = null;
        var alertPopupTitle = '';
        $scope.logininfo = {
            strPhoneNumber:     '',
            strCustomerCode:    '',
            strJobNo:           '',
            strRole:            'Driver/Ops',
            CurRole:            '1',
            NewRole:            '1'
        };
        $scope.roles = [
            { text: 'Driver/Ops', value: '1' },
            { text: 'Customer', value: '2' },
            { text: 'Transporter', value: '3' }
        ];
        $scope.funcChangeRole = function () {
            var myPopup = $ionicPopup.show({
                template: '<ion-radio ng-repeat="role in roles" ng-value="role.value" ng-model="logininfo.NewRole">{{ role.text }}</ion-radio>',
                title: 'LOGIN AS',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancel',
                        onTap: function (e) {
                            $scope.logininfo.NewRole = $scope.logininfo.CurRole;
                        }
                    },
                    {
                        text: 'Select',
                        type: 'button-positive',
                        onTap: function (e) {
                            for (var r in $scope.roles) {
                                if ($scope.logininfo.NewRole === $scope.roles[r].value) {
                                    $scope.logininfo.CurRole = $scope.logininfo.NewRole;
                                    $scope.logininfo.strRole = $scope.roles[r].text;
                                    if (window.cordova) {
                                        var file = 'TmsDemo/Config.txt';
                                        var path = cordova.file.externalRootDirectory;
                                        var data = 'BaseUrl=' + strBaseUrl.replace('/', '') + '##WebServiceURL=' + strWebServiceURL.replace('http://', '') + '##WebSiteURL=' + strWebSiteURL.replace('http://', '') + '##LoginRole=' + $scope.logininfo.strRole;
                                        $cordovaFile.writeFile(path, file, data, true)
                                        .then(function (success) {
                                            //
                                        }, function (error) {
                                            $cordovaToast.showShortBottom(error);
                                        });
                                    }
                                }
                            }
                        }
                    }
                ]
            });
        };
        $scope.funcRoleJuage = function (roleType) {
            if (roleType === 1) {
                if ($scope.logininfo.strRole === 'Driver/Ops') {
                    return true;
                } else {
                    return false;
                }
            }
            else if (roleType === 2) {
                if ($scope.logininfo.strRole === 'Customer') {
                    return true;
                }
                else if ($scope.logininfo.strRole === 'Transporter') {
                    return true;
                } else {
                    return false;
                }
            }
        };
        $scope.funcLogin = function (blnDemo) {
            if(blnDemo){
                ENV.mock = true;
            } else {
                ENV.mock = false;
            }
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.close();
            }
            if ($scope.logininfo.CurRole === '1') {
                if(ENV.mock){
                    sessionStorage.clear();
                    sessionStorage.setItem('strPhoneNumber', $scope.logininfo.strPhoneNumber);
                    sessionStorage.setItem('strDriverName', 'Mr. Driver');
                    sessionStorage.setItem('strCustomerCode', '');
                    sessionStorage.setItem('strJobNo', '');
                    sessionStorage.setItem('strRole', $scope.logininfo.strRole);
                    $state.go('main', { 'blnForcedReturn': 'N' }, { reload: true });
                }else{
                    if ($scope.logininfo.strPhoneNumber === '') {
                        alertPopupTitle = 'Please Enter Phone Number.';
                        alertPopup = $ionicPopup.alert({
                            title: alertPopupTitle,
                            okType: 'button-assertive'
                        });
                        alertPopup.then(function(res) {
                            $log.debug(alertPopupTitle);
                        });
                    }else{
                        var jsonData = { 'PhoneNumber': $scope.logininfo.strPhoneNumber, 'CustomerCode': '', 'JobNo': '' };
                        var strUri = '/api/event/login/check';
                        ApiService.Get(strUri, true).then(function success(result){
                            sessionStorage.clear();
                            sessionStorage.setItem('strPhoneNumber', $scope.logininfo.strPhoneNumber);
                            sessionStorage.setItem('strDriverName', result.data.results);
                            sessionStorage.setItem('strCustomerCode', '');
                            sessionStorage.setItem('strJobNo', '');
                            sessionStorage.setItem('strRole', $scope.logininfo.strRole);
                            $state.go('main', { 'blnForcedReturn': 'N' }, { reload: true });
                        });
                    }
                }
            } else if ($scope.logininfo.CurRole === '2' || $scope.logininfo.CurRole === '3') {
                if(ENV.mock){
                    sessionStorage.clear();
                    sessionStorage.setItem('strPhoneNumber', '');
                    sessionStorage.setItem('strDriverName', '');
                    sessionStorage.setItem('strCustomerCode', $scope.logininfo.strCustomerCode);
                    sessionStorage.setItem('strJobNo', $scope.logininfo.strJobNo);
                    sessionStorage.setItem('strRole', $scope.logininfo.strRole);
                    $state.go('listDirect', { 'JobNo': $scope.logininfo.strJobNo }, { reload: true });
                }else{
                    if ($scope.logininfo.strCustomerCode === '') {
                        alertPopupTitle = 'Please Enter User ID.';
                        alertPopup = $ionicPopup.alert({
                            title: alertPopupTitle,
                            okType: 'button-assertive'
                        });
                        alertPopup.then(function(res) {
                            $log.debug(alertPopupTitle);
                        });
                        return;
                    }
                    if ($scope.logininfo.strJobNo === '') {
                        alertPopupTitle = 'Please Enter Event Job No.';
                        alertPopup = $ionicPopup.alert({
                            title: alertPopupTitle,
                            okType: 'button-assertive'
                        });
                        alertPopup.then(function(res) {
                            $log.debug(alertPopupTitle);
                        });
                        return;
                    }
                    var jsonData = { 'PhoneNumber': '', 'CustomerCode': $scope.logininfo.strCustomerCode, 'JobNo': $scope.logininfo.strJobNo };
                    var strUri = '/api/event/action/list/login';
                    ApiService.GetParam(strUri, true).then(function success(result){
                        sessionStorage.clear();
                        sessionStorage.setItem('strPhoneNumber', '');
                        sessionStorage.setItem('strDriverName', '');
                        sessionStorage.setItem('strCustomerCode', $scope.logininfo.strCustomerCode);
                        sessionStorage.setItem('strJobNo', $scope.logininfo.strJobNo);
                        sessionStorage.setItem('strRole', $scope.logininfo.strRole);
                        $state.go('listDirect', { 'JobNo': $scope.logininfo.strJobNo }, { reload: true });
                    });
                }
            }
        };
        $('#iPhoneNumber').on('keydown', function (e) {
            if (e.which === 9 || e.which === 13) {
                if(alertPopup === null){
                    $scope.funcLogin();
                }else{
                    alertPopup.close();
                    alertPopup = null;
                }
            }
        });
        $('#iCustomerCode').on('keydown', function (e) {
            if (e.which === 9 || e.which === 13) {
                if(alertPopup === null){
                    $('#iJobNo').focus();
                }else{
                    alertPopup.close();
                    alertPopup = null;
                }
            }
        });
        $('#iJobNo').on('keydown', function (e) {
            if (e.which === 9 || e.which === 13) {
                if(alertPopup === null){
                    $scope.funcLogin();
                }else{
                    alertPopup.close();
                    alertPopup = null;
                }
            }
        });
    }]);
