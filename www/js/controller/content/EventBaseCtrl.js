(function () {
    var _module = angular.module('controller');
    _module.controller('EventBaseCtrl',function($scope,ControllerBase,apiEvent,u,App,RateWidget,$sce){
        ControllerBase($scope, 'event');
        $scope.loadingItem = null;
        $scope.loadingRate = null;
        $scope.$on('$ionicView.beforeEnter', function(viewInfo, state){
            if(['none','forward','swap'].indexOf(state.direction)>=0) {
                $scope.loadingItem = null;
                $scope.loadingRate = null;
                if(u.Intent.data && u.Intent.data.EventId){
                    $scope.item = u.Intent.data;
                    $scope.updateMapUrl();
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
            apiEvent.useCache(useCache).get(u.$state.params.id).then(function(data){
                $scope.item = data; 
                $scope.updateMapUrl();
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
            where.Event = $scope.item;
            return $scope.loadingRate = 
                apiEvent.useCache(useCache).getRate(where).then(function(data){
                    $scope.setRate(data);
                }).finally(function(){
                    $scope.loadingRate = null;
                });
        }
        $scope.setRate = function(o) {
            if($scope.rate == null){
                $scope.rate = new RateWidget();
                $scope.rate.title = 'Rate this Event';
                $scope.rate.ItemIdPropertyName = 'EventId';
                $scope.rate.onSetRate = $scope.onSetRate;
            }
            $scope.rate.set(o);
        }
        $scope.onSetRate = function(i) {
            var data = {
                Customer: App.logonUser,
                Event: $scope.item,
                value: i
            }
            apiEvent.setRate(data).then(function(data){
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
        $scope.updateMapUrl = function() {
            $scope.latitude = $scope.item.RoadShow.VenueLat;
            $scope.longitude = $scope.item.RoadShow.VenueLot;
            $scope.apiKey = App.googleApiKey;
            if($scope.latitude && $scope.longitude) {
                $scope.mapurl = 
                    'https://www.google.com/maps/embed/v1/place'+
                    '?key='+$scope.apiKey+
                    '&q='+$scope.latitude+','+$scope.longitude+
                    '&zoom=18'
                ;
                $scope.mapurl = $sce.trustAsResourceUrl($scope.mapurl);
            }else{
                $scope.mapurl = '';   
            }  
            return $scope.mapurl;
        }
        $scope.actionShare = function(index) {
            
        }
        $scope.actionMap = function() {
            if(!$scope.mapurl)return;
            u.$state.go('app.location', {lot:$scope.longitude, lat:$scope.latitude});
        }
    })
}());
                       