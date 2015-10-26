(function () {
    var _module = angular.module('localStorage', []);
    _module.factory('localStorage', function($window){
        var ret = {
            setInt:function(key,val) {
                if(val === undefined || val === null) {
                    delete $window.localStorage[key];
                }else{
                    var strval = ''+val;
                    $window.localStorage[key] = strval;
                }
            },
            getInt:function(key,defaultVal) {
                var strval = $window.localStorage[key];
                if(strval === undefined || strval === null) {
                    this.setInt(key, defaultVal);
                    return defaultVal;
                }else{
                    return parseInt(strval);    
                }
            },
            setString:function(key,val) {
                if(val === undefined || val === null) {
                    delete $window.localStorage[key];
                }else{
                    var strval = val;
                    $window.localStorage[key] = strval;
                }
                return defaultVal;
            },
            getString:function(key,defaultVal) {
                var strval = $window.localStorage[key];
                if(strval === undefined || strval === null) {
                    this.setObject(key, defaultVal);
                    return defaultVal;
                }else{
                    return strval;
                }
            },
            setObject:function(key,val) {
                if(val === undefined || val === null) {
                    delete $window.localStorage[key];
                }else{
                    var strval = JSON.stringify(val);
                    $window.localStorage[key] = strval;
                }
            },
            getObject:function(key,defaultVal) {
                var strval = $window.localStorage[key];
                if(strval === undefined || strval === null) {
                    this.setObject(key, defaultVal);
                    return defaultVal;
                }else{
                    return JSON.parse(strval);
                }
            }
        };
        return ret;
    })
}());