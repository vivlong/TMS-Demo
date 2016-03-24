'use strict';
var app = angular.module('Demo', [
    'ionic',
    'ionic-datepicker',
    'jett.ionic.filter.bar',
    'ionic.ion.headerShrink',
    'ngMessages',
    'ngCordova.plugins.sms',
    'ngCordova.plugins.toast',
    'ngCordova.plugins.dialogs',
    'ngCordova.plugins.appVersion',
    'ngCordova.plugins.file',
    'ngCordova.plugins.fileTransfer',
    'ngCordova.plugins.fileOpener2',
    'ngCordova.plugins.actionSheet',
    'ngCordova.plugins.inAppBrowser',
    'Demo.config',
    'Demo.directives',
    'Demo.services'
]);
app.run(['$ionicPlatform', '$rootScope', '$state', '$location', '$timeout', '$ionicHistory', '$ionicLoading', '$cordovaToast',
    function ($ionicPlatform, $rootScope, $state, $location, $timeout, $ionicHistory, $ionicLoading, $cordovaToast) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
        $ionicPlatform.registerBackButtonAction(function (e) {
            e.preventDefault();
            // Is there a page to go back to?  $state.include ??
            if ($state.includes('main') || $state.includes('login') || $state.includes('splash')) {
                if ($rootScope.backButtonPressedOnceToExit) {
                    ionic.Platform.exitApp();
                } else {
                    $rootScope.backButtonPressedOnceToExit = true;
                    $cordovaToast.showShortBottom('Press again to exit.');
                    setTimeout(function () {
                        $rootScope.backButtonPressedOnceToExit = false;
                    }, 2000);
                }
            } else if ($state.includes('jobs')) {
                $state.go('main', {}, { reload: true });
            } else if ($state.includes('jobList')) {
                $state.go('jobs', {}, { reload: true });
            } else if ($state.includes('jobDetail')) {
                $state.go('jobList', {}, { reload: true });
            } else if ($ionicHistory.backView()) {
                $ionicHistory.goBack();
            } else {
                // This is the last page: Show confirmation popup
                $rootScope.backButtonPressedOnceToExit = true;
                $cordovaToast.showShortBottom('Press again to exit.');
                setTimeout(function () {
                    $rootScope.backButtonPressedOnceToExit = false;
                }, 2000);
            }
            return false;
        }, 101);
    }]);
app.config(['ENV', '$stateProvider', '$urlRouterProvider', '$logProvider', '$ionicConfigProvider', '$ionicFilterBarConfigProvider',
    function (ENV, $stateProvider, $urlRouterProvider, $logProvider, $ionicConfigProvider, $ionicFilterBarConfigProvider) {
        $logProvider.debugEnabled(ENV.debug);
        $ionicConfigProvider.backButton.previousTitleText(false);
        $stateProvider
            .state('splash', {
                url: '/splash',
                cache: 'false',
                templateUrl: 'view/splash/splash.html',
                controller: 'SplashCtrl'
            })
            .state('login', {
                url: '/login',
                cache: 'false',
                templateUrl: 'view/login/login.html',
                controller: 'LoginCtrl'
            })
            .state('main', {
                url: '/main',
                cache: 'false',
                templateUrl: "view/main/main.html",
                controller: 'MainCtrl'
            })
            .state('jobs', {
                url: '/jobs',
                cache: 'false',
                templateUrl: "view/jobs/jobs.html",
                controller: 'JobsCtrl'
            })
            .state('jobList', {
                url: '/jobList/:JobNo/:TrxNo',
                cache: 'false',
                templateUrl: "view/jobs/jobList.html",
                controller: 'JobListCtrl'
            })
            .state('jobDetail', {
                url: '/jobDetail/:Type/:ContainerNo/:JobNo/:TrxNo/:LineItemNo/:Description/:Remark/:DoneFlag',
                cache: 'false',
                templateUrl: 'view/jobs/jobDetail.html',
                controller: 'JobDetailCtrl'
            });
        $urlRouterProvider.otherwise('/splash');
        /*
        $ionicFilterBarConfigProvider.theme('calm');
        $ionicFilterBarConfigProvider.clear('ion-close');
        $ionicFilterBarConfigProvider.search('ion-search');
        $ionicFilterBarConfigProvider.backdrop(false);
        $ionicFilterBarConfigProvider.transition('vertical');
        $ionicFilterBarConfigProvider.placeholder('Filter');
        */
    }]);
app.constant('$ionicLoadingConfig', {
    template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
});
