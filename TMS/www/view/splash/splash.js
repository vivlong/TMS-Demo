'use strict';
app.controller('SplashCtrl',
    ['$state', '$timeout',
    function ($state, $timeout) {
        $timeout(function () {
            $state.go('login', {}, { reload: true });
        }, 2000);
    }]);
