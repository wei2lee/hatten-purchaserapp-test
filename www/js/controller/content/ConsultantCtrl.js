(function () {
    var _module = angular.module('controller');
    _module.controller('ConsultantCtrl',function($scope,ControllerBase,u,apiConsultant,RateWidget,App){
        ControllerBase($scope, 'consultant');
        $scope.loadingRate = null;
        $scope.loadingItem = null;
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {
                $scope.loadingRate = null;
                $scope.loadingItem = null;
                $scope.rate = null;
                if(u.Intent.data && u.Intent.data.UserId){
                    $scope.item = u.Intent.data;
                    $scope.loadRate();
                }else{
                    $scope.item = {UserId:u.$state.params.id};
                    $scope.loadItem().then(function(){
                        return $scope.loadRate(); 
                    });
                }
            }
        });
        $scope.loadItem = function() {
            return $scope.loadingItem = 
                apiConsultant.get($scope.item.UserId).then(function(data){
                    $scope.item = data;
                }).finally(function(){
                    $scope.loadingItem = null;
                    u.$timeout(function(){
                        u.$ionicScrollDelegate.resize();
                    },100);
                });
        }

        
        $scope.loadRate = function() {
            var where = {};
            where.Customer = App.user;
            where.Consultant = $scope.item;
            return $scope.loadingRate = 
                apiConsultant.getRate(where).then(function(data){
                    $scope.setRate(data);
                }).finally(function(){
                    $scope.loadingRate = null;
                    u.$timeout(function(){
                        u.$ionicScrollDelegate.resize();
                    },100);
                });
        }
        $scope.setRate = function(o) {
            if($scope.rate == null){
                $scope.rate = new RateWidget();
                $scope.rate.title = 'Rate this Consultant';
                $scope.rate.ItemIdPropertyName = 'UserId';
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
            apiConsultant.setRate(data).then(function(data){
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
        
    })
}());