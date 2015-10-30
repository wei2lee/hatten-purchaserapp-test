(function () {
    var _module = angular.module('controller');
    _module.controller('ProjectCtrl',function($scope,ControllerBase,apiProject,u){
        ControllerBase($scope, 'project');
        $scope.loading = null;
        $scope.$on('$ionicView.beforeEnter', function(viewInfo, state){
            if(['none','forward','swap'].indexOf(state.direction)>=0) {
                $scope.load();
            }  
        })
        $scope.load = function(useCache) {
            $scope.loading = 
            apiProject.useCache(useCache).get(u.$state.params.id).then(function(data){
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
        
        $scope.getImageWidth = function(index) {
            var padding = 20;
            return ($scope.$ioncontent.width() - padding) + 'px';
        }
        $scope.getImageHeight = function(index) {
            var padding = 20;
            return ($scope.$ioncontent.width() - padding) + 'px';
        }
    })
}());