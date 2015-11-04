(function () {
    var _module = angular.module('controller');
    _module.controller('ConstructionsCtrl',function($scope,ControllerBase,u,App,apiProject){
        ControllerBase($scope, 'constructions');
        $scope.loading = null;
        $scope.project = [];
        $scope.items = [];

        $scope.$on('$ionicView.beforeEnter', function(viewInfo, state){
            if(['none','forward','swap'].indexOf(state.direction)>=0) {
                $scope.loading = null;
                $scope.project = null;
                $scope.items = [];
                if(u.Intent.data && u.Intent.data.ProjectId){
                    $scope.project = u.Intent.data;
                    $scope.items = $scope.project.Contructions;
                    $scope.updateDivider();
                }else{
                    $scope.load();
                }
            }  
        })
        $scope.updateDivider = function() {
            var sortBy = _.sortBy($scope.project.Contructions, function(o){
                return o.ProjectContractionDate ? new Date(o.ProjectContractionDate) : null;
            });
            sortBy.reverse();
            var groupBy = _.groupBy(sortBy, function(o){
                if(o.ProjectContractionDate) {
                    return moment(o.ProjectContractionDate).format('YYYY MMMM');
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
        $scope.load = function(useCache) {
            $scope.loading = 
            apiProject.useCache(useCache).get(u.$state.params.id).then(function(data){
                $scope.project = data;
                $scope.items = $scope.project.Contructions;
                $scope.updateDivider();
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
            u.Intent.data = _.map(item.ContractionsDetails , function(o){
                return {
                    HiRes: null,
                    LowRes: o.ProjectContractionsDetailResourceKey
                } 
            });
            u.$state.go('app.gallery');
        }
        $scope.getShowNoResultsFound = function() {
            return !$scope.loading && $scope.items.length==0;
        }
        $scope.getShowLoading = function() {
            return (!!$scope.loading) && $scope.items.length==0;
        }
        
        $scope.getItemWidth = function(index) {
            var padding = 20;
            if($scope.items[index].isDivider){
                return $scope.$ioncontent.width();
            }else{
                return ($scope.$ioncontent.width() - padding);
            }
        }
        $scope.getItemHeight = function(index, withMarginBottom) {
            var nameHeight = $scope.items[index].ProjectContractionDate ? 53 : 0;
            var padding = 20;
            var imagepadding = 0;
            var marginBottom = withMarginBottom ? App.collectionRepeatCardBottomMarginSmall : 0;
            var dividerHeight = App.collectionRepeatDividerHeight;
            
            if($scope.items[index].isDivider){
                return dividerHeight;
            }else{
                return ($scope.getImageHeight(index, true) + nameHeight + marginBottom);
            }
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