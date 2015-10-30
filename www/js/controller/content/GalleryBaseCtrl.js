(function () {
    var _module = angular.module('controller');
    _module.controller('GalleryBaseCtrl', function ($scope, ControllerBase, u, App) {
        ControllerBase($scope, 'gallery');
        $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
            if(['none','forward','swap'].indexOf(state.direction)>=0) {
                $scope.items = u.Intent.data;
            }
        });
        $scope.getItemWidth = function(data) {
            var padding = 20;
            return ($scope.$ioncontent.width() - padding) + 'px';
        }
        $scope.getItemHeight = function(index, withMarginBottom) {
            var nameHeight = 0;
            var marginBottom = !withMarginBottom ? 20 : 0;
            return ($scope.$ioncontent.width() - marginBottom + nameHeight) + 'px';
        }
        $scope.getImageWidth = function(index) {
            var padding = 20;
            return ($scope.$ioncontent.width() - padding) + 'px';
        }
        $scope.getImageHeight = function(index) {
            var padding = 20;
            return ($scope.$ioncontent.width() - padding) + 'px';
        }
    });
}())