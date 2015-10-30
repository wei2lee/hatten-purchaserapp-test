(function () {
    var _module = angular.module('controller');
    _module.controller('ConsultantsCtrl', function ($scope, ControllerBase, apiProject, apiConsultant, u, $ionicFilterBar) {
        ControllerBase($scope, 'consultants');
        $scope.loading = null;
        $scope.loadingProject = null;
        $scope.loadingConsultant = null;
        $scope.loadConsultantIndex = 0;
        $scope.projects = [];
        $scope.items = [];
        $scope.filter = {};
        $scope.filter.toString = function() {
            var arr = [];
            if($scope.filter.searchText) {
                arr.push($scope.filter.searchText);
            }
            if($scope.filter.project) {
                arr.push($scope.filter.project.Name);
            }
            return arr.join(', ');
        };
        $scope.getItems = function() {
            var arr = [];
            if(!$scope.filter.project && !$scope.filter.searchText) {
                for(var i in projects) {
                    arr = arr.concat($scope.consultants[i]);    
                }
                arr = _.uniq(arr, function(o){
                    return o.UserId;
                });
                return arr;
            }else{
                if($scope.filter.project) {
                    var ind = _.findIndex($scope.projects, function(o){
                        return o.ProjectId == $scope.filter.project.ProjectId;
                    });
                    arr = $scope.consultants[ind];
                }   
                
                
                
            }
        }
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {
                $scope.projects = [];
                $scope.consultants = [];
                $scope.items = [];
                $scope.load();
            }
        })
        $scope.loadProject = function (useCache) {
            $scope.loadingProject =
                apiProject.useCache(useCache).query().then(function (data) {
                    $scope.projects = data;
                }).finally(function () {
                    $scope.loadingProject = null;
                });
            return $scope.loadingProject;
        }
        $scope.loadConsultant = function (useCache) {
            var defer = u.$q.defer();
            defer.resolve();
            var promise = defer.promise;
            $scope.loadConsultantIndex = 0;
            for(var i in $scope.projects) {
                promise = promise.then(function(){
                    var project = $scope.projects[$scope.loadConsultantIndex];
                    var where = {'Project':{'ProjectId':project.ProjectId}};    
                    $scope.loadConsultantIndex++;
                    return apiConsultant.useCache(useCache).query(where).then(function(data){
                        $scope.consultants.push(data);      
                    });
                })
            }
            promise.finally(function(){
                $scope.loadingConsultant = null; 
            });
            return $scope.loadingConsultant = promise;
        }
        $scope.load = function (useCache) {
            $scope.loading =
                $scope.loadProject().then(function(){
                    return $scope.loadConsultant();
                }).finally(function(){
                    $scope.loading = null;
                });
            return $scope.loading;
        }
        $scope.actionRefresh = function () {
            if ($scope.loading || $scope.loadingProject || $scope.loadingConsultant) return;
            $scope.items = [];
            $scope.loading =
                $scope.loadConsultant().finally(function () {
                    u.$timeout(function () {
                        $scope.$broadcast('scroll.refreshComplete');
                    }, 100);
                });
        }
        $scope.actionItemClick = function (index) {
            var item = $scope.items[index];
            u.$state.go('app.consultant', {
                id: item.ProjectId
            });
        }
        $scope.getItemWidth = function (data) {
            var padding = 20;
            return ($scope.$ioncontent.width() - padding) + 'px';
        }
        $scope.getItemHeight = function (index, withMarginBottom) {
            var marginBottom = withMarginBottom ? 20 : 0;
            return (72 + marginBottom) + 'px';
        }
    })
}());