(function () {
    var _module = angular.module('controller');
    _module.controller('ProjectsCtrl',function($scope,ControllerBase,apiProject,u){
        ControllerBase($scope, 'projects');
        $scope.loading = null;
        $scope.$on('$ionicView.beforeEnter', function(viewInfo, state){
            if(['none','forward','swap'].indexOf(state.direction)>=0) {
                $scope.load();
            }  
            console.log($scope.ioncontent);
        })
        $scope.load = function(useCache) {
            $scope.loading = 
            apiProject.useCache(useCache).query().then(function(data){
                $scope.items = data; 
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
        $scope.actionItemClick = function(index) {
            var item = $scope.items[index];
            u.$state.go('app.project', {id: item.ProjectId});
        }
        $scope.actionShare = function(index) {
            
        }
        $scope.getItemWidth = function(data) {
            var padding = 20;
            return ($scope.$ioncontent.width() - padding) + 'px';
        }
        $scope.getItemHeight = function(index, withMarginBottom) {
            var nameHeight = 53;
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
    })
}());