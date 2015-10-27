(function () {
    var _module = angular.module('ErrorDomain', []);
    _module.factory('ErrorDomain', function(){
        var ret = {
            ServerInfracture: 'ServerInfracture',
            ServerApplication: 'ServerApplication',
            ClientInfracture: 'ClientInfracture',
            ClientApplication: 'ClientApplication',
            ClientHTTP: 'ClientHTTP'
        }
        return ret;
    });
}());