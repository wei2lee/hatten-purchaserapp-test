(function () {
    var _module = angular.module('controller');
    _module.controller('LocationBaseCtrl', function ($scope, ControllerBase, u, App, $sce, $ionicScrollDelegate) {
        ControllerBase($scope, 'location');
        $scope.iframeOnLoad = function () {
            //        console.log('iframeOnLoad');
//            u.hideProgress();
//            $timeout(function () {
//                $scope.contentReady = true;
//                $scope.contentAnimated = true;
//            }, 200);
//            $timeout.cancel($scope.iframeLoadExpire);
        }
        $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
            if(['none','forward','swap'].indexOf(state.direction)>=0) {
                $scope.latitude = u.$state.params.lat;
                $scope.longitude = u.$state.params.lot;
                $scope.apiKey = App.googleApiKey;
                if ($scope.latitude && $scope.longitude) {

                    $scope.url =
                        'https://www.google.com/maps/embed/v1/place' +
                        '?key=' + $scope.apiKey +
                        '&q=' + $scope.latitude + ',' + $scope.longitude +
                        '&zoom=18';
                    $scope.url = $sce.trustAsResourceUrl($scope.url);

//                    u.showProgress();
//                    $scope.iframeLoadExpire = $timeout(function () {
//                        $scope.contentReady = true;
//                        $scope.contentAnimated = true;
//                        $scope.url = '';
//                        u.hideProgress();
//                    }, 10000);
                } else {
                    $scope.url = '';
                }
                u.$timeout(function () {
                    $ionicScrollDelegate.resize();
                }, 200);
            }
        });
    });
}())