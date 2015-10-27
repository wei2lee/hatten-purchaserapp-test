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
                    $window
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
        return _self;
    });
}());