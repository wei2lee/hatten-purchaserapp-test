(function () {
    var _module = angular.module('controller');
    _module.factory('ControllerBase', function () {
        var ret = function ($scope, id) {
            $scope.scrollTop = function() {
                $scope.$scroll.scrollTop(0);
                $scope.$scroll.css({'transform' : 'translate3d(0px,0px,0px) scale(1)'});
                $scope.$scroll.css({'-webkit-transform' : 'translate3d(0px,0px,0px) scale(1)'});
                $scope.$scroll.css({'-ms-transform' : 'translate3d(0px,0px,0px) scale(1)'});
            }
            $scope.$on('$ionicView.beforeEnter', function(viewInfo, state){
                if(['none','forward','swap'].indexOf(state.direction)>=0) {
                    if(!$scope.$element && id) {
                        $scope.$element = angular.element(sprintf('#%s[nav-view=active], #%s[nav-view=entering], #%s[nav-view=stage]', id, id, id));
                        $scope.$ioncontent = angular.element('ion-content', $scope.$element);
                        $scope.$scroll = angular.element('ion-content>.scroll', $scope.$element);
                    } 
                    if($scope.$element) {
                        $scope.scrollTop();
                    }
                }  
            })
        }
        return ret;
    });
}());