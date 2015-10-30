(function () {
    var _module = angular.module('firstValidElement', []);
    _module.filter('firstValidElement', function (App) {
        return function (arr, key, defaultStr) {
            if(defaultStr === undefined)defaultStr = '';
            if(arr === null || arr === undefined || arr.length == 0) {
                return defaultStr;
            }else{
                for(var i in arr) {
                    if(key){
                        if(arr[i] !== null && arr[i] !== undefined && arr[i][key] !== null && arr[i][key] !== undefined) {
                            return arr[i][key];
                        }
                    }else{
                        if(arr[i] !== null && arr[i] !== undefined) {
                            return arr[i];
                        }
                    }
                }
                return defaultStr;
            }
        };
    });
}());