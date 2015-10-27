(function () {
    var _module = angular.module('controller');
    _module.controller('WhatsNewCtrl',function($scope,ControllerBase,u,apiProject,apiToken,App){
        $scope.App = App;
        ControllerBase($scope, 'whatsnew');
        $scope.$on('$ionicView.beforeEnter', function(viewInfo, state){
            if(['none','forward','swap'].indexOf(state.direction)>=0) {
                console.log('go');
            }  
        })
        $scope.actionToken = function() {
            apiToken.authorizate();
        }
        $scope.actionGetProjects = function() {
            apiProject.query();
        }
    })
}());