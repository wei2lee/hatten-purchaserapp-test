(function () {
    var _module = angular.module('controller');
    _module.controller('EventsBaseCtrl',function($scope,ControllerBase,apiEvent,apiVoucher,apiWhatsNew,u,App){
        ControllerBase($scope, 'events');
        $scope.loadingEvent = null;
        $scope.states = {
            'app.events': {
                title: 'Events',
                api: apiEvent,
                detailstatename: 'app.event'
            },
            'app.vouchers': {
                title: 'Vouchers',
                api: apiVoucher,
                detailstatename: 'app.voucher'
            },
            'app.whatsnews': {
                title: 'What\'s News',
                api: apiWhatsNew,
                detailstatename: 'app.whatsnew'
            }
        }
        
        
        $scope.$on('$ionicView.beforeEnter', function(viewInfo, state){
            if(['none','forward','swap'].indexOf(state.direction)>=0) {
                $scope.loadingEvent = null;
                $scope.title = $scope.states[u.$state.current.name].title;
                $scope.api = $scope.states[u.$state.current.name].api;
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
        
        $scope.getShowLoading = function() {
            return (!!$scope.loadingEvent) && $scope.items == null;
        }
        
        $scope.loadEvent = function(useCache) {
            return $scope.loadingEvent = 
                $scope.api.useCache(useCache).query().then(function(data){
                    $scope.events = data;
                    $scope.updateDivider();
                }).finally(function(){
                    $scope.loadingEvent = null;
                });
        }
        $scope.updateDivider = function() {
            var sortBy = _.sortBy($scope.events, function(o){
                return o.RoadShow._startDate ? new Date(o.RoadShow._startDate) : null;
            });
            sortBy.reverse();
            var groupBy = _.groupBy(sortBy, function(o){
                if(o.RoadShow._startDate) {
                    
                    return moment(o.RoadShow._startDate).format('YYYY MMMM');
                }else{
                    return 'Past';
                }
            });
            var items = [];
            for(k in groupBy) {
                if(k == 'Past') {
                    if(Object.keys(groupBy).length > 1)
                        items.push({isDivider: true, text: k });
                }else{
                    items.push({isDivider: true, text: k })    
                }
                for(j in groupBy[k]) {
                    items.push(groupBy[k][j]);
                }
            }
            
            $scope.items = items;
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
            u.$state.go('app.event', {id: item.EventId});
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

                var start = _new.RoadShow._startDate ? _new.RoadShow._startDate.getTime()/1000 : null;
                var end = _new.RoadShow._endDateTime ? _new.RoadShow._endDateTime.getTime()/1000 : null;


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
                }else if(start && now){
                    _new._expireDesc = "Event is coming!!";
                }else{
                    _new._expireDesc = "";
                }
                _new._expireRemainFinished = !(dd || hh || mi || ss);
            }
        }
        $scope.killTimer = function() {
            u.$interval.cancel($scope.timer);
        }
        
        $scope.actionItemClick = function(index) {
            var item = $scope.items[index];
            u.Intent.data = item;
            u.$state.go($scope.states[u.$state.current.name].detailstatename, {id: item.EventId});
        }
    })
}());