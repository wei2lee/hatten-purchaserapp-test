(function () {
    var _module = angular.module('controller');
    _module.controller('ConsultantCtrl',function($scope,ControllerBase,u,apiConsultant){
        ControllerBase($scope, 'consultant');
        $scope.loadingRate = null;
        $scope.loadingUser = null;
        $scope.rate = {review:{}}
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {
                if(u.Intent.data && u.Intent.data.UserId){
                    $scope.item = u.Intent.data;
                }else{
                    $scope.item = {UserId:u.$state.params.id};
                    $scope.loadUser();
                }
            }
        });
        $scope.loadUser = function() {
            $scope.loadingUser = 
                apiConsultant.get($scope.item.UserId).then(function(data){
                    $scope.item = data;
                }).finally(function(){
                    $scope.loadingUser = null;
                });
        }
        $scope.loadRate = function() {
            
            
        }
    })
}());