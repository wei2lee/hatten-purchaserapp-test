(function () {
    var _module = angular.module('api', []);

    /* ==========================================================================
       API Service Base Class
       ========================================================================== */
    _module.factory('apiBase', function ($q, $timeout, App) {
        function apiBase(_values) {
            var _this = this;
            this.values = _values;
            this.apiService = apiService;
            this._useCache = false;
        }
        apiBase.prototype.useCache = function () {
            this._useCache = true;
            return this;
        }
        apiBase.prototype.getAll = function () {
            return $q(function (resolve, reject) {
                reject(createError('Not implemented'));
            });
        }
        apiBase.prototype.getById = function (id) {
            return $q(function (resolve, reject) {
                reject(createError('Not implemented'));
            });
        }
        apiBase.prototype.processError = function (resp) {
            var msg = null;
            if (jqXHR.responseJSON != null) {
                var json = jqXHR.responseJSON;
                if (!msg && json.error) {
                    msg = {
                        domain: ErrorDomain.ServerInfracture,
                        code: json.error,
                        description: json.error_description || ('error:' + json.error)
                    };
                }
                if (!msg && json.ErrorCode) {
                    msg = {
                        domain: ErrorDomain.ServerInfracture,
                        code: json.ErrorCode,
                        description: json.Message || ('ErrorCode:' + json.ErrorCode)
                    };
                }
                if (!msg && json.Message) {
                    msg = {
                        domain: ErrorDomain.ServerInfracture,
                        code: 0,
                        description: json.Message
                    };
                }
                if (!msg) {
                    msg = {
                        domain: ErrorDomain.ServerInfracture,
                        code: 0,
                        description: "Unable to interprete server reply"
                    };
                }
            } else {
                if (!msg && jqXHR.status == 0) {
                    msg = {
                        domain: ErrorDomain.ClientHTTP,
                        code: 0,
                        description: "Unable to connect to server"
                    };
                }
                if (!msg && errorThrown != null) {
                    msg = {
                        domain: ErrorDomain.ClientHTTP,
                        code: jqXHR.status,
                        description: errorThrown
                    };
                }
                console.log(jqXHR);
                if (!msg) {
                    msg = {
                        domain: ErrorDomain.ClientHTTP,
                        code: jqXHR.status,
                        description: 'Unable to interprete server reply (' + jqXHR.status + ')'
                    };
                }
            }
            return msg;
        }
        apiBase.prototype.processHtml = function (html) {

        }

        return apiBase;
    });
    _module.factory('apiWithTokenBase', function ($q, $timeout, apiServiceBase, apiToken) {
        function apiBase() {}
        apiBase.prototype = new apiServiceBase();
        apiBase.prototype.withToken = function (createJQXHR) {
            var defer = $q.defer();
            var _self = this;
            if (apiToken.apiService.token.access_token) {
                createJQXHR().done(function (data, textStatus, jqXHR) {
                    console.log('done@' + this.url);
                    console.log(data);
                    defer.resolve(data);
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status == 401) {
                        console.log('fail@' + this.url);
                        console.log('Re-token');
                        return apiToken.token().then(function () {
                            return createJQXHR().then(function (data, textStatus, jqXHR) {
                                console.log('done@' + this.url);
                                console.log(data);
                                defer.resolve(data);
                            });
                        }).catch(function (error) {
                            console.log('fail@' + this.url);
                            console.log(error);
                            defer.reject(error);
                        });
                    } else {
                        console.log('fail@' + this.url);
                        var error = _self.processError(jqXHR, textStatus, errorThrown);
                        console.log(error);
                        defer.reject(error);
                    }
                });
            } else {
                apiToken.token().then(function () {
                    return createJQXHR().then(function (data, textStatus, jqXHR) {
                        console.log('done@' + this.url);
                        console.log(data);
                        defer.resolve(data);
                    });
                }).catch(function (error) {
                    console.log('fail@' + this.url);
                    console.log(error);
                    defer.reject(error);
                });
            }
            return defer.promise;
        }
        return apiBase;
    })
    
    _module.factory('apiToken', function($http,apiBase,App) {
        function api() {}
        api.prototype = new apiBase();
        api.prototype.authorizate = function(){
            var _self = this;
            return $http({
                url:App.EndPoint+'Token',
                method:'POST',
                data:{
                    username:App.apiUserUsername,
                    password:App.apiUserPassword,
                    grant_type:'password'
                }
            }).then(function(resp){
                return resp.data;
            }).catch(function(resp){
                throw _self.processError(resp); 
            });
        }
        return new api();
    })


}());