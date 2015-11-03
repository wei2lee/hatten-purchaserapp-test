(function () {
    var _module = angular.module('controller');
    _module.controller('ProjectCtrl',function($scope,ControllerBase,apiProject,u,App,RateWidget){
        ControllerBase($scope, 'project');
        $scope.loadingItem = null;
        $scope.loadingRate = null;
        $scope.$on('$ionicView.beforeEnter', function(viewInfo, state){
            if(['none','forward','swap'].indexOf(state.direction)>=0) {
                $scope.loadingItem = null;
                $scope.loadingRate = null;
                if(u.Intent.data && u.Intent.data.ProjectId){
                    $scope.item = u.Intent.data;
                    $scope.loadRate(); 
                }else{
                    $scope.loadItem().then(function(){
                        $scope.loadRate(); 
                    });
                }
            }  
        })
        $scope.loadItem = function(useCache) {
            return $scope.loadingItem = 
            apiProject.useCache(useCache).get(u.$state.params.id).then(function(data){
                $scope.item = data; 
                u.$timeout(function(){
                    u.$ionicScrollDelegate.resize();
                },100)
            }).finally(function(){
                $scope.loadingItem = null;
            });
        }
        $scope.loadRate = function(useCache) {
            var where = {};
            where.Customer = App.user;
            where.Project = $scope.item;
            return $scope.loadingRate = 
                apiProject.useCache(useCache).getRate(where).then(function(data){
                    $scope.setRate(data);
                }).finally(function(){
                    $scope.loadingRate = null;
                });
        }
        $scope.setRate = function(o) {
            if($scope.rate == null){
                $scope.rate = new RateWidget();
                $scope.rate.title = 'Rate this Project';
                $scope.rate.ItemIdPropertyName = 'ProjectId';
                $scope.rate.onSetRate = $scope.onSetRate;
            }
            $scope.rate.set(o);
        }
        $scope.onSetRate = function(i) {
            var data = {
                Customer: App.logonUser,
                Project: $scope.item,
                value: i
            }
            apiProject.setRate(data).then(function(data){
                $scope.setRate(data);
            });
        }
        $scope.actionRefresh = function() {
            if($scope.loadingItem || $scope.loadingRate)return;
            $scope.loadItem(false).then(function(){
                return $scope.loadRate(false); 
            }).finally(function(){
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