(function () {
    var _module = angular.module('firstValidPhone', []);
    _module.filter('firstValidPhone', function (App) {
        return function (arr, key, defaultStr) {
            if(defaultStr === undefined)defaultStr = '';
            if(arr === null || arr === undefined || arr.length == 0) {
                return defaultStr;
            }else{
                for(var i in arr) {
                    if(key){
                        if(arr[i] !== null && arr[i] !== undefined && arr[i][key] !== null && arr[i][key] !== undefined) {
                            if(arr[i][key] != '0' && arr[i][key] != '-'){
                                return arr[i][key];
                            }
                            var all0 = true;
                            for(var j = 0 ; j < arr[i][key].length ; j++){
                                if(arr[i][key].charAt(j) != '0'){
                                    all0 = false;   
                                    break;
                                }
                            }
                            if(!all0) return arr[i][key];
                        }
                    }else{
                        if(arr[i] !== null && arr[i] !== undefined) {
                            if(arr[i] != '0' && arr[i] != '-'){
                                return arr[i];
                            }
                            var all0 = true;
                            for(var j = 0 ; j < arr[i].length ; j++){
                                if(arr[i].charAt(j) != '0'){
                                    all0 = false;   
                                    break;
                                }
                            }
                            if(!all0) return arr[i][key];
                        }
                    }
                }
                return defaultStr;
            }
        };
    });
}());