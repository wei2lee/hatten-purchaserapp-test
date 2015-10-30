(function () {
    var _module = angular.module('config', ['route']);
    _module.config(function($ionicConfigProvider){
        console.log('config');
//        $ionicConfigProvider.backButton.text('Go Back').icon('ion-chevron-left');
    });
}());