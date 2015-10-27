angular.module('app', [
    'ionic', 
    'config',
    'controller',
    'service',
    'filter',
    'value',
    'angular-bind-html-compile'
])

.run(function ($ionicPlatform,App,localStorage) {
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