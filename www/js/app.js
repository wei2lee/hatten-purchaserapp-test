angular.module('app', [
    'ionic', 
    'config',
    'controller',
    'service',
    'directive',
    'filter',
    'value',
    'angular-bind-html-compile',
    'ionic-modal-select'
])

.run(function ($ionicPlatform,App,localStorage,$ionicConfig) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }  
    });
    App.token = localStorage.getObject('token', {});
    App.user = localStorage.getObject('user', {});
});