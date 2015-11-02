(function () {
    var _module = angular.module('controller');
    _module.controller('ConsultantCtrl',function($scope,ControllerBase,u){
        ControllerBase($scope, 'consultant');
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {
                $scope.item = u.Intent.data;
            }
        })
    })
}());