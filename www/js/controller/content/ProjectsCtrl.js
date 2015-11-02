(function () {
    var _module = angular.module('controller');
    _module.controller('ProjectsCtrl',function($scope,ControllerBase,apiProject,u,App){
        ControllerBase($scope, 'projects');
        $scope.loading = null;
        $scope.loadingProject = null;
        $scope.projects = [];
        $scope.items = [];
        $scope.filter = {};
        $scope.filter.propertyTypeDescOptions = ['Hotel','Residential','Commercial'];
        $scope.filter.toString = function() {
            var arr = [];
            if($scope.filter.searchText) {
                arr.push($scope.filter.searchText);
            }
            if($scope.filter.propertyTypeDesc) {
                arr.push($scope.filter.propertyTypeDesc);
            }
            return arr.join(', ');
        };
        $scope.getShowNoResultsFound = function() {
            return !$scope.loading && !$scope.loadingProject && $scope.items.length==0;
        }
        $scope.getShowLoading = function() {
            return (!!$scope.loading || !!$scope.loadingProject) && $scope.items.length==0;
        }
        $scope.getItems = function() {
            var arr = $scope.projects;
            if(!$scope.filter.searchText && !$scope.filter.propertyTypeDesc) {
                arr = _.sortBy(arr, function(o) {
                    return o.Name; 
                });
                $scope.items = arr;
                return arr;
            }else{
                if($scope.filter.propertyTypeDesc) {
                    arr = _.filter(arr, function(o) {
                        return o.PropertyTypeDesc && $scope.filter.propertyTypeDesc && o.PropertyTypeDesc.toLowerCase() == $scope.filter.propertyTypeDesc.toLowerCase();
                    });
                }
                if($scope.filter.searchText) {
                    arr = _.filter(arr, function(o){
                        return o.Name && o.Name.toLowerCase().indexOf($scope.filter.searchText.toLowerCase()) >= 0;
                    });
                }
                arr = _.sortBy(arr, function(o) {
                    return o.FullName; 
                });
                $scope.items = arr;
                return arr;
            }
        }
        
        
        $scope.$on('$ionicView.beforeEnter', function(viewInfo, state){
            if(['none','forward','swap'].indexOf(state.direction)>=0) {
                $scope.loading = null;
                $scope.items = [];
                $scope.load();
            }  
            console.log($scope.ioncontent);
        })
        $scope.load = function(useCache) {
            $scope.loading = 
            apiProject.useCache(useCache).query().then(function(data){
                $scope.projects = data;
            }).finally(function(){
                $scope.loading = null;
                u.$timeout(function(){
                    u.$ionicScrollDelegate.resize();
                },100);
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
            u.Intent.data = item;
            u.$state.go('app.project', {id: item.ProjectId});
        }
        $scope.actionShare = function(index) {
            
        }
        $scope.getShowNoResultsFound = function() {
            return $scope.loading==null && $scope.items.length==0;   
        }
        $scope.getItemWidth = function(index) {
            var padding = 20;
            return ($scope.$ioncontent.width() - padding);
        }
        $scope.getItemHeight = function(index, withMarginBottom) {
            var nameHeight = 53;
            var padding = 20;
            var addressHeight = $scope.items[index] && $scope.items[index].Location ? 20 : 0;
            var imagepadding = 0;
            var marginBottom = withMarginBottom ? App.collectionRepeatCardBottomMarginSmall : 0;
            return ($scope.getImageHeight(index, true) + nameHeight + addressHeight + marginBottom);
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