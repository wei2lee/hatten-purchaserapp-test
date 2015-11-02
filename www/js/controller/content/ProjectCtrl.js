(function () {
    var _module = angular.module('controller');
    _module.controller('ProjectCtrl',function($scope,ControllerBase,apiProject,u,App){
        ControllerBase($scope, 'project');
        $scope.loading = null;
        $scope.$on('$ionicView.beforeEnter', function(viewInfo, state){
            if(['none','forward','swap'].indexOf(state.direction)>=0) {
                if(u.Intent.data && u.Intent.data.ProjectId){
                    $scope.item = u.Intent.data;
                }else{
                    $scope.load();
                }
            }  
        })
        $scope.load = function(useCache) {
            $scope.loading = 
            apiProject.useCache(useCache).get(u.$state.params.id || $scope.item.ProjectId).then(function(data){
                $scope.item = data; 
            }).finally(function(){
                $scope.loading = null;
            });
            return $scope.loading;
        }
        $scope.actionRefresh = function() {
            if($scope.loading)return;
            $scope.loading =
            $scope.load(false).finally(function(){
                u.$timeout(function(){
                    $scope.$broadcast('scroll.refreshComplete');    
                },100);
            });
        }
        $scope.actionShare = function(index) {
            
        }
        
        $scope.actionGallery = function() {
            u.Intent.data = _.map($scope.item.ProjectPhotos , function(o){
                return {
                    HiRes: null,
                    LowRes: o.ProjectPhotoResourceKey
                } 
            });
            u.$state.go('app.gallery');
        }
        
        $scope.getImageWidth = function(index, withPadding) {
            var padding = 20;
            var imagepadding = 0;
            return ($scope.$ioncontent.width() - imagepadding - padding);
        }
        $scope.getImageHeight = function(index, withPadding) {
            var padding = 20;
            var imagepadding = 0;
            var damp = u.inverseLerp(
                $scope.$ioncontent.width(),
                App.collectionRepeatCardLargeImageRatioXS.width,
                App.collectionRepeatCardLargeImageRatioLG.width,
                true
                );
            var ratio = u.lerp(
                damp,
                App.collectionRepeatCardLargeImageRatioXS.ratio,
                App.collectionRepeatCardLargeImageRatioLG.ratio,
                true
                );
            var ret = ($scope.getImageWidth(index, false) / ratio - imagepadding - padding);
            return Math.ceil(ret);
        }
    })
}());