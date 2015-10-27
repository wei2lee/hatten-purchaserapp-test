(function () {
    var _module = angular.module('Error', []);
    _module.factory('Error', function(ErrorDomain){
        var con = function(a,b,c){            
            this.description = a || '',
            this.domain = b || ErrorDomain.ClientApplication,
            this.code = c || 0
        }
        return con;
    });
}());