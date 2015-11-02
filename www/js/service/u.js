(function () {
    var _module = angular.module('u', []);
    
    _module.factory('u', function(
                    Error,
                    ErrorDomain,
                    loading,
                    localStorage,
                    popup,
                    SemanticVersion,
                    $q,
                    $timeout,
                    $interval,
                    $state,
                    $window,
                    $ionicScrollDelegate,
                    Intent
                   ){
        var _self = this;
        _self.Error = Error;
        _self.ErrorDomain = ErrorDomain;
        _self.loading = loading;
        _self.localStorage = localStorage;
        _self.popup = popup;
        _self.SemanticVersion = SemanticVersion;
        _self.$q = $q;
        _self.$timeout = $timeout;
        _self.$interval = $interval;
        _self.$state = $state;
        _self.$window = $window;
        _self.Intent = Intent;
        _self.$ionicScrollDelegate = $ionicScrollDelegate;
        
        _self.lerp = function(damp, min, max, bound) {
            bound = !!bound;
            if(min==max)return min;
            else {
                var ret = min + (max-min)*damp;   
                if(bound) ret = Math.min(max, Math.max(min, ret));
                return ret;
            }
        }
        _self.inverseLerp = function(val, min, max, bound) {
            bound = !!bound;
            if(min==max) return 0;
            else {
                var ret = (val - min) / (max - min);   
                if(bound) ret = Math.min(1, Math.max(0, ret));
                return ret;
            }
        }
        _self.inverseLerpAndLerp = function(val, imin, imax, ibound, min, max, bound) {
            return this.lerp(this.inverseLerp(val, imin, imax, ibound), min, max, bound);
        }
        return _self;
    });
}());