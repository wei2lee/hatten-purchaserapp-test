(function () {
    var _module = angular.module('controller');
    _module.controller('EventsBaseCtrl',function($scope,ControllerBase,apiEvent,u,App){
        ControllerBase($scope, 'events');
        $scope.loadingEvent = null;
        $scope.$on('$ionicView.beforeEnter', function(viewInfo, state){
            if(['none','forward','swap'].indexOf(state.direction)>=0) {
                $scope.loadingEvent = null;
                $scope.loadEvent().then(function(){
                    $scope.killTimer();
                    $scope.createTimer();  
                })
            }else{
                $scope.killTimer();
                $scope.createTimer();    
            }
        });
        $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
            $scope.killTimer();
        });
        $scope.loadEvent = function(useCache) {
            return $scope.loadingEvent = 
                apiEvent.useCache(useCache).query().then(function(data){
                    $scope.events = data;
                }).finally(function(){
                    $scope.loadingEvent = null;
                });
        }
        $scope.actionRefresh = function() {
            if($scope.loadingEvent)return;
            $scope.loadingEvent =
            $scope.loadEvent(false).finally(function(){
                u.$timeout(function(){
                    $scope.$broadcast('scroll.refreshComplete');    
                },100);
            });
        }
        $scope.actionItemClick = function(index) {
            var item = $scope.items[index];
            u.Intent.data = item;
            u.$state.go('app.event', {id: item.ProjectId});
        }
        
        $scope.createTimer = function() {
            $scope.updateTimerTask();
            $scope.timer = u.$interval(function() {
                $scope.updateTimerTask();
            },1000);            
        }
        $scope.updateTimerTask = function() {
            if(!$scope.events)return;
            for(i = 0 ; i < $scope.events.length ; i++) {
                var _new = $scope.events[i];

                var start = _new.RoadShow._startDate;
                var end = _new.RoadShow._endDateTime;


                var now = new Date().getTime()/1000;   
                if(start){
                    var remainSeconds = Math.max(Math.floor(start - now), 0);

                    var dd = Math.floor(remainSeconds / (60*60*24));
                    var hh = Math.floor(remainSeconds / (60*60)) % 24;
                    var mi = Math.floor(remainSeconds / (60)) % 60;
                    var ss = remainSeconds % 60;
                    _new._expireRemain = sprintf("%ddays, %02d:%02d:%02d", dd, hh, mi, ss);
                    _new._expireRemainDay = sprintf("%ddays", dd);
                    _new._expireRemainTime = sprintf("%02d:%02d:%02d", hh, mi, ss);
                }
                if(end && now > end){
                    _new._expireDesc = "Event is ended.";
                }else if(start && now > start){
                    _new._expireDesc = "Event is started!";
                }else{
                    _new._expireDesc = "Event is coming!!";
                }
                _new._expireRemainFinished = !(dd || hh || mi || ss);
            }
        }
        $scope.killTimer = function() {
            u.$interval.cancel($scope.timer);
        }
        
        $scope.actionClick = function(item) {
            u.Intent.data = item;
            u.$state.go('app.event', {id: item.EventId});
        }

        

    })
}());