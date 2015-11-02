(function () {
    var _module = angular.module('controller');
    _module.controller('ConsultantsCtrl', function ($scope, ControllerBase, apiProject, apiConsultant, u, App) {
        ControllerBase($scope, 'consultants');
        $scope.loading = null;
        $scope.loadingProject = null;
        $scope.loadingConsultant = null;
        $scope.loadConsultantIndex = 0;
        $scope.projects = [];
        $scope.items = [];
        $scope.filter = {};
        $scope.filter.projectOptions = [];
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
        $scope.getShowNoResultsFound = function() {
            return !$scope.loading && !$scope.loadingProject && !$scope.loadingConsultant && $scope.items.length==0;
        }
        $scope.getShowLoading = function() {
            return (!!$scope.loading || !!$scope.loadingProject || !!$scope.loadingConsultant) && $scope.items.length==0;
        }
        $scope.getItems = function() {
            var arr = [];
            if(!$scope.filter.project && !$scope.filter.searchText) {
                for(var i in $scope.projects) {
                    if($scope.consultants[i]){
                        arr = arr.concat($scope.consultants[i]);    
                    }
                }
                arr = _.uniq(arr, function(o){
                    return o.UserId;
                });
                arr = _.sortBy(arr, function(o) {
                    return o.FullName; 
                });
                $scope.items = arr;
                return arr;
            }else{
                if($scope.filter.project) {
                    var ind = _.findIndex($scope.projects, function(o){
                        return o.ProjectId == $scope.filter.project.ProjectId;
                    });
                    if($scope.consultants[ind]){
                        arr = $scope.consultants[ind];
                    }
                }else{
                    for(var i in $scope.projects) {
                        if($scope.consultants[i]){
                            arr = arr.concat($scope.consultants[i]);    
                        }
                    }
                    arr = _.uniq(arr, function(o){
                        return o.UserId;
                    });
                }
                if($scope.filter.searchText) {
                    arr = _.filter(arr, function(o){
                        var containName = o.FullName && o.FullName.toLowerCase().indexOf($scope.filter.searchText.toLowerCase())>=0;
                        var containPhone = false;
                        if(o.Phones) {
                            for(i in o.Phones){
                                var phone = o.Phones[i];
                                if(phone && phone.Value && phone.Value != "0") {
                                    containPhone = phone.Value.indexOf($scope.filter.searchText)>=0;
                                    break;
                                }
                            }
                        }
                        return containName || containPhone;
                    });
                }else{
                    
                }
                arr = _.uniq(arr, function(o){
                    return o.UserId;
                });
                arr = _.sortBy(arr, function(o) {
                    return o.FullName; 
                });
                $scope.items = arr;
                return arr;
            }
        }
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {
                $scope.projects = [];
                $scope.consultants = [];
                $scope.items = [];
                $scope.filter.projectOptions = [];
                if(u.$state.current.name == 'app.consultants-query-project'){
                    $scope.filter.project = {ProjectId:$state.params.id}   
                }
                $scope.load();
            }
        })
        $scope.loadProject = function (useCache) {
            $scope.loadingProject =
                apiProject.useCache(useCache).query().then(function (data) {
                    $scope.projects = data;
                    $scope.filter.projectOptions = _.sortBy($scope.projects, function(o){
                        return o.Name;
                    });
                console.log($scope.filter.projectOptions);
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
                $scope.loadProject(useCache).then(function(){
                    return $scope.loadConsultant(useCache);
                }).finally(function(){
                    $scope.loading = null;
                });
            return $scope.loading;
        }
        $scope.actionRefresh = function () {
            if ($scope.loading || $scope.loadingProject || $scope.loadingConsultant) return;
            $scope.projects = [];
            $scope.consultants = [];
            $scope.items = [];
            $scope.loading =
                $scope.load(false).finally(function () {
                    u.$timeout(function () {
                        $scope.$broadcast('scroll.refreshComplete');
                    }, 100);
                });
        }
        $scope.actionItemClick = function (index) {
            var item = $scope.items[index];
            u.Intent.data = item;
            u.$state.go('app.consultant', {
                id: item.UserId
            });
        }
        $scope.getItemWidth = function (data) {
            var padding = 20;
            return ($scope.$ioncontent.width() - padding) + 'px';
        }
        $scope.getItemHeight = function (index, withMarginBottom) {
            var marginBottom = withMarginBottom ? App.collectionRepeatCardBottomMarginSmall : 0;
            return (72 + marginBottom) + 'px';
        }
    })
}());