'use strict';
app.controller('MainCtrl',
    ['ENV', '$log', '$scope', '$state', 'ApiService',
    function (ENV, $log, $scope, $state, ApiService) {
        var strDriverName = sessionStorage.getItem('strDriverName');
        if (strDriverName != null && strDriverName.length > 0) {
            $scope.strName = strDriverName;
        } else {
            $scope.strName = "Driver";
        }
        $scope.funcGoToJobs = function () {
            $state.go('jobs', {}, { reload: true });
        };
        $scope.funcLogout = function () {
            $state.go('login', {}, { reload: true });
        };
    }]);
