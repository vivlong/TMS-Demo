'use strict';
var appConfig = angular.module('Demo.config',[]);
appConfig.constant('ENV', {
    'website':      'http://www.sysfreight.net:8081/tmsdemo',
    'api':          'http://www.sysfreight.net:8081/WebApi',
    'debug':        true,
    'mock':         true,
    'fromWeb':      true,
    'appId':        '9CBA0A78-7D1D-49D3-BA71-C72E93F9E48F',
    'rootPath':     'TMSDemo',
    'configFile':   'config.txt',
    'version':      '0.0.1'
});
