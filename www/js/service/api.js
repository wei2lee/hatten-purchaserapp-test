(function () {
    var _module = angular.module('api', []);
    
    _module.service('apiAuth', function($injector,App,localStorage) {
        this.authorizate = function () {
            var $http = $http || $injector.get('$http');
            var $httpParamSerializer = $httpParamSerializer || $injector.get('$httpParamSerializer');
            return $http({
                ignoreAuthModule: true,
                method: 'POST',
                url: App.authorizateApiEndPoint + 'Token',
                data: $httpParamSerializer({
                    username: App.apiUserUsername,
                    password: App.apiUserPassword,
                    grant_type: 'password'
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function (data) {
                App.token = data;
                localStorage.setObject('token', data);
            });
        }

        this.retryHttpRequest = function(_config) {
            var $http = $http || $injector.get('$http');
            var config = _.extend({}, _config);
            config.ignoreAuthModule = true;
            return $http(config);
        }
        
        this.authorizateAndRetryHttpRequest = function(_config){
            var _self = this;
            return _self.authorizate().then(function(){
                return _self.retryHttpRequest(_config);
            });  
        };
    });
    /* ==========================================================================
       interceptor. logging / change response object / error object / retry http if 401
       ========================================================================== */
    _module.config(function ($httpProvider) {
        $httpProvider.interceptors.push(function ($q, App, ErrorDomain, Error, apiAuth) {
            var filterUrls = [App.apiEndPoint, App.resourceEndPoint, App.authorizateApiEndPoint, App.privateAppStoreApiEndPoint];

            function createErrorFromResponse(resp) {
                var ret = null;
                if (resp.data) {
                    var json = resp.data;
                    if (!ret && resp.data.hasOwnProperty('error')) {
                        ret = new Error(
                            json.error_description || (json.error),
                            ErrorDomain.ServerInfracture,
                            0
                        );
                    }
                    if (!ret && resp.data.hasOwnProperty('ErrorCode')) {
                        ret = new Error(
                            json.Message || ('ErrorCode : ' + json.ErrorCode),
                            ErrorDomain.ServerInfracture,
                            json.ErrorCode
                        );
                    }
                    if (!ret && resp.data.hasOwnProperty('Message')) {
                        ret = new Error(
                            json.Message || "Unable to interprete server reply",
                            ErrorDomain.ClientHTTP,
                            resp.status
                        );
                    }
                    if (!ret) {
                        ret = new Error(
                            "Unable to interprete server reply",
                            ErrorDomain.ClientHTTP,
                            resp.status
                        );
                    }
                } else {
                    if (!ret && resp.data.status === 0) {
                        ret = new Error(
                            "Unable to connect to server",
                            ErrorDomain.ClientHTTP,
                            resp.status
                        );
                    }
                    if (!ret) {
                        ret = new Error(
                            resp.statsText,
                            ErrorDomain.ClientHTTP,
                            resp.status
                        );
                    }
                }
                return ret;
            }
            return {
                'request': function (config) {
                    var url = config.url;
                    var matchFilter = !!_.find(filterUrls, function (o) {
                        return url.startsWith(o);
                    });
                    
                    if (matchFilter) {
                        console.log('request', config);
                        config.headers.Authorization = 'Bearer ' + App.token.access_token;
                        return config;
                    } else {
                        return config;
                    }
                },
                'requestError': function (rejection) {
                    var url = rejection.config.url;
                    var matchFilter = !!_.find(filterUrls, function (o) {
                        return url.startsWith(o);
                    });
                    if (matchFilter) {
                        console.log('requestError', rejection);
                        return $q.reject(rejection);
                    } else {
                        return $q.reject(rejection);
                    }
                },
                'response': function (resp) {
                    var url = resp.config.url;
                    var matchFilter = !!_.find(filterUrls, function (o) {
                        return url.startsWith(o);
                    });
                    if (matchFilter) {
                        console.log('response', resp);
                        return resp.data;
                    } else {
                        return resp;
                    }
                },
                'responseError': function (resp) {
                    var url = resp.config.url;
                    var matchFilter = !!_.find(filterUrls, function (o) {
                        return url.startsWith(o);
                    });
                    if (matchFilter) {
                        if (!resp.config.ignoreAuthModule && resp.status == 401) {
                            return apiAuth.authorizateAndRetryHttpRequest(resp.config);
                        }else{
                            var error = createErrorFromResponse(resp);
                            console.log('responseError', error);
                            return $q.reject(error);
                        }
                    } else {
                        return $q.reject(resp);
                    }
                }
            };
        });
    });
    /* ==========================================================================
       API Base Class
       ========================================================================== */
    _module.factory('apiBase', function ($q, $http, App, localStorage) {
        function apiBase() {
            var _this = this;
            this.values = [];
            this._useCache = false;
        }
        apiBase.prototype.useCache = function (b) {
            this._useCache = b===null||b===undefined ? true : !!b;
            return this;
        }
        apiBase.prototype.add = function (key, val) {
            var arr = val;
            var _self = this;
            if (!(val instanceof Array)) arr = [val];
            _.each(arr, function (o) {
                _self.values.push(o);
            });
        }
        apiBase.prototype.addOrUpdate = function (key, val) {
            var arr = val;
            var _self = this;
            if (!(val instanceof Array)) arr = [val];
            _.each(arr, function (o) {
                var found = _.find(_self.values, function (o2) {
                    return o2[key] == o[key];
                });
                if (found) {
                    _.extend(found, val);
                } else {
                    _self.values.push(val);
                }
            });
        }
        apiBase.prototype.loadFromStorage = function () {

        }
        apiBase.prototype.saveToStorage = function () {

        }
        apiBase.prototype.http = function(option) {
            option = _.extend(option||{}, {cache: this._useCache});
            return $http(option);
        }
        apiBase.prototype.httpget = function(url, option) {
            option = _.extend(option||{}, {cache: this._useCache});
            return $http.get(url, option);
        }
        apiBase.prototype.httppost = function(url, option) {
            option = _.extend(option||{}, {cache: this._useCache});
            return $http.post(url, option);
        }
        return apiBase;
    });
    /* ==========================================================================
       API
       ========================================================================== */
    _module.factory('apiProject', function ($http, apiBase, App) {
        function api() {}
        api.prototype = new apiBase();
        api.prototype.query = function () {
            return this.httpget(App.apiEndPoint + 'Project/GetAllProjects');
        }
        api.prototype.get = function (id) {
            return this.httpget(App.apiEndPoint + sprintf('AppProject/%s', id)).then(function(data){
                data.ProjectId = data.Id;
                return data;
            });
        }
        api.prototype.getRate = function (where) {
            if (where.Customer)
                return this.httpget(App.apiEndPoint + sprintf('Rate/GetProject?iProjectID=%s&iCustomerID=%s', where.Project.ProjectId, where.Customer.CustomerId)).then(function(data){
                    data.ProjectId = data.ProjectID;
                    return data; 
                });
            else
                return this.get(where.Project.ProjectId).then(function (data) {
                    return {
                        ProjectId: data.ProjectId,
                        Total5: data.Star5,
                        Total4: data.Star4,
                        Total3: data.Star3,
                        Total2: data.Star2,
                        Total1: data.Star1,
                        AverRate: data.StarAve,
                        Total: data.StarTotal
                    };
                });
        }
        api.prototype.setRate = function (data) {
            return this.httpget(App.apiEndPoint + sprintf('Rate/UpdateProjectRate?iProjectId=%s&iCustomerID=%s&iRateValue=%s', data.Project.ProjectId, data.Customer.CustomerId, data.value));
        }
        return new api();
    })

    _module.factory('apiCustomerProjectFeedbackFormTemplate', function ($http, apiBase, App) {
        function api() {}
        api.prototype = new apiBase();
        api.prototype.get = function () {
            return $http.get(App.apiEndPoint + 'CustomerProjectFeedBackForm/GetFeedBackForm');
        }
        return new api();
    })

    _module.factory('apiCustomerProjectFeedbackForm', function ($http, apiBase, App) {
        function api() {}
        api.prototype = new apiBase();
        api.prototype.add = function (data) {
            return $http.post(App.apiEndPoint + 'CustomerProjectFeedBackForm/UpdateFeedbackForm', {
                'params': data
            });
        }
        return new api();
    })

    _module.factory('apiProgramFeedbackFormTemplate', function ($http, apiBase, App) {
        function api() {}
        api.prototype = new apiBase();
        api.prototype.get = function () {
            return $http.get(App.apiEndPoint + 'CustomerProjectFeedBackForm/GetProgramFeedBackForm');
        }
        return new api();
    })

    _module.factory('apiProgramFeedbackForm', function ($http, apiBase, App) {
        function api() {}
        api.prototype = new apiBase();
        api.prototype.add = function (data) {
            return $http.post(App.apiEndPoint + 'CustomerProjectFeedBackForm/UpdateProgramFeedbackForm', {
                'params': data
            });
        }
        return new api();
    })

    _module.factory('apiCustomerEventFeedbackFormTemplate', function ($http, apiBase, App) {
        function api() {}
        api.prototype = new apiBase();
        api.prototype.get = function () {
            return $http.get(App.apiEndPoint + 'CustomerEventFeedBackForm/GetFeedBackForm');
        }
        return new api();
    })

    _module.factory('apiCustomerEventFeedbackForm', function ($http, apiBase, App) {
        function api() {}
        api.prototype = new apiBase();
        api.prototype.add = function (data) {
            return $http.post(App.apiEndPoint + 'CustomerEventFeedBackForm/UpdateFeedbackForm', {
                'params': data
            });
        }
        return new api();
    })

    _module.factory('apiCustomerSysUserFeedBackFormTemplate', function ($http, apiBase, App) {
        function api() {}
        api.prototype = new apiBase();
        api.prototype.get = function () {
            return $http.get(App.apiEndPoint + 'CustomerSysUserFeedBackForm/GetFeedBackForm');
        }
        return new api();
    })

    _module.factory('apiCustomerSysUserFeedBackForm', function ($http, apiBase, App) {
        function api() {}
        api.prototype = new apiBase();
        api.prototype.add = function (data) {
            return $http.post(App.apiEndPoint + 'CustomerSysUserFeedBackForm/UpdateFeedbackForm', {
                'params': data
            });
        }
        return new api();
    })


    _module.factory('apiCustomer', function ($http, apiBase, App, Error, ErrorDomain, localStorage) {
        function api() {}
        api.prototype = new apiBase();
        api.prototype.login = function (where) {
            if (!data.email || !data.pass) return $q.reject(new Error('Username and password must not empty'));
            return $http.get(App.apiEndPoint + sprintf('AppCustomer/GetByEmailAndPass?email=%s&pass=%s', where.email, where.pass)).then(function (data) {
                if (data == null) throw new Error('Username doesn\'t match with password');
                else {
                    return data;
                    App.user = data;
                    localStorage.setObject('user', data);
                }
            });
        }
        api.prototype.add = function (data) {
            return $http.post(App.apiEndPoint + 'AppCustomer/Add', {
                'params': data
            });
        }
        api.prototype.save = function (data) {
            return $http.post(App.apiEndPoint + sprintf('AppCustomer/%s/Edit', data.IC), {
                'params': data
            });
        }
        api.prototype.forgetPassword = function (data) {
            return $http.get(App.apiEndPoint + sprintf('AppEmail/ForgetPassWord?email=%s', data.Customer.Email));
        }
        return new api();
    })

    _module.factory('apiUnit', function ($http, apiBase, App) {
        function api() {}
        api.prototype = new apiBase();
        api.prototype.query = function (where) {
            return $http.get(App.apiEndPoint + sprintf('AppCustomer/%s/Units', where.Customer.IC));
        }
        return new api();
    })

    _module.factory('apiConsultant', function ($http, apiBase, App, Error, $q) {
        function api() {}
        api.prototype = new apiBase();
        api.prototype.query = function (where) {
            var self = this;
            if (where.hasOwnProperty('Customer'))
                return this.httpget(App.apiEndPoint + sprintf('AppCustomer/%s/Agents', where.Customer.IC));
            else if (where.hasOwnProperty('Project'))
                return this.httpget(App.apiEndPoint + sprintf('AppUser/GetByProjectId?iProjectID=%s', where.Project.ProjectId));
            else if (where.hasOwnProperty('AssociateUnit'))
                return this.httpget(App.apiEndPoint + sprintf('AppUser/GetByUnitId?iUnitID=%s', where.AssociateUnit.UnitId));
            else {
                return $q.reject(new Error('Unimplemented'));
            }
        }
        api.prototype.get = function (id) {
            return $http.get(App.apiEndPoint + sprintf('AppUser/%s', id), {cache:this._useCache});
        }
        api.prototype.getRate = function (where) {
            if (where.Customer)
                return this.httpget(App.apiEndPoint + sprintf('api/Rate/GetSysUser?iSysUserID=%s&iCustomerID=%s', where.Consultant.UserId, where.Customer.CustomerId)).then(function(data){
                    data.UserId = data.SystemUserID;
                    return data;
                })
            else
                return this.get(where.Consultant.UserId).then(function (data) {
                    return {
                        UserId: data.UserId,
                        Total5: data.Star5,
                        Total4: data.Star4,
                        Total3: data.Star3,
                        Total2: data.Star2,
                        Total1: data.Star1,
                        AverRate: data.StarAve,
                        Total: data.StarTotal
                    };
                });
        }
        api.prototype.setRate = function (data) {
            return this.httpget(App.apiEndPoint + sprintf('Rate/UpdateSysUser?iSysUserID=%s&iCustomerID=%s&iRateValue=%s', data.Consultant.UserId, data.Customer.CustomerId, data.value));
        }
        return new api();
    })

    _module.factory('apiConstruction', function ($http, apiBase, App, Error, $q) {
        function api() {}
        api.prototype = new apiBase();
        api.prototype.query = function (where) {
            if (where.hasOwnProperty('Project'))
                return $http.get(App.apiEndPoint + sprintf('AppProject/GetContructions?projectid=%s', where.Project.ProjectId));
            else {
                return $q.reject(new Error('Unimplemented'));
            }
        }
        return new api();
    })

    _module.factory('apiWhatsNew', function ($http, apiBase, App, Error, $q) {
        function api() {}
        api.prototype = new apiBase();
        api.prototype.query = function () {
            return this.httpget(App.apiEndPoint + 'WhatNews/GetAllWhatNews').then(function(data){
                return _.map(data, function(o){
                        o.RoadShow._startDate = o.RoadShow.StartDate ? new Date(o.RoadShow.StartDate) : null;
                        o.RoadShow._endDateTime = o.RoadShow.EndDateTime ? new Date(o.RoadShow.EndDateTime) : null;
                        var _start = o.RoadShow.StartDate ? moment(o.RoadShow.StartDate) : null;
                        _start = _start ? _start.format('D') : '';
                        var _end = o.RoadShow.EndDateTime ? moment(o.RoadShow.EndDateTime) : null;
                        _end = _end ? _end.format('D MMM YYYY') : '';
                        o._period = _start + '-' + _end;
                        return o;
                    }); 
            });
        }
        api.prototype.get = function (id) {
            return this.httpget(App.apiEndPoint + sprintf('WhatNews/GetWhatNewsById?eventid=%s', id));
        }
        api.prototype.attemp = function (data) {
            return this.httpget(App.apiEndPoint + sprintf('Rate/AttendEvent?iEventId=%s&iCustomerID=%s', data.Event.EventId, data.Customer.CustomerId));
        }
        api.prototype.unattemp = function (data) {
            return this.httpget(App.apiEndPoint + sprintf('Rate/UnAttendEvent?iEventId=%s&iCustomerID=%s', data.Event.EventId, data.Customer.CustomerId));
        }
        api.prototype.getRate = function (where) {
            if (where.Customer)
                return this.httpget(App.apiEndPoint + sprintf('Rate/GetEventRate?iEventId=%s&iCustomerID=%s', where.Event.EventId, where.Customer.CustomerId));
            else
                return this.get(where.Event.EventId).then(function (data) {
                    return {
                        RoadShowId: data.RoadShow.RoadShowId,
                        Total5: data.RoadShow.Star5,
                        Total4: data.RoadShow.Star4,
                        Total3: data.RoadShow.Star3,
                        Total2: data.RoadShow.Star2,
                        Total1: data.RoadShow.Star1,
                        AverRate: data.RoadShow.StartAve,
                        Total: data.RoadShow.StartTotal
                    };
                });
        }
        api.prototype.saveRate = function (id) {
            return this.httpget(App.apiEndPoint + sprintf('Rate/UpdateEventRate?iEventId=%s&iCustomerID=%s&iRateValue=%s', data.Event.EventId, data.Customer.CustomerId, data.rateValue));
        }
        return new api();
    })

    _module.factory('apiVoucher', function ($http, apiBase, App, Error, $q) {
        function api() {}
        api.prototype = new apiBase();
        api.prototype.query = function () {
            return this.httpget(App.apiEndPoint + 'WhatNews/GetAllVoucher').then(function(data){
                return _.map(data, function(o){
                        o.RoadShow._startDate = o.RoadShow.StartDate ? new Date(o.RoadShow.StartDate) : null;
                        o.RoadShow._endDateTime = o.RoadShow.EndDateTime ? new Date(o.RoadShow.EndDateTime) : null;
                        var _start = o.RoadShow.StartDate ? moment(o.RoadShow.StartDate) : null;
                        _start = _start ? _start.format('D') : '';
                        var _end = o.RoadShow.EndDateTime ? moment(o.RoadShow.EndDateTime) : null;
                        _end = _end ? _end.format('D MMM YYYY') : '';
                        o._period = _start + '-' + _end;
                        return o;
                    }); 
            });
        }
        api.prototype.get = function (id) {
            return this.httpget(App.apiEndPoint + sprintf('WhatNews/GetWhatNewsById?eventid=%s', id));
        }
        api.prototype.attemp = function (data) {
            return this.httpget(App.apiEndPoint + sprintf('Rate/AttendEvent?iEventId=%s&iCustomerID=%s', data.Event.EventId, data.Customer.CustomerId));
        }
        api.prototype.unattemp = function (data) {
            return this.httpget(App.apiEndPoint + sprintf('Rate/UnAttendEvent?iEventId=%s&iCustomerID=%s', data.Event.EventId, data.Customer.CustomerId));
        }
        api.prototype.getRate = function (where) {
            if (where.Customer)
                return this.httpget(App.apiEndPoint + sprintf('Rate/GetEventRate?iEventId=%s&iCustomerID=%s', where.Event.EventId, where.Customer.CustomerId));
            else
                return this.get(where.Event.EventId).then(function (data) {
                    return {
                        RoadShowId: data.RoadShow.RoadShowId,
                        Total5: data.RoadShow.Star5,
                        Total4: data.RoadShow.Star4,
                        Total3: data.RoadShow.Star3,
                        Total2: data.RoadShow.Star2,
                        Total1: data.RoadShow.Star1,
                        AverRate: data.RoadShow.StartAve,
                        Total: data.RoadShow.StartTotal
                    };
                });
        }
        api.prototype.saveRate = function (id) {
            return this.httpget(App.apiEndPoint + sprintf('Rate/UpdateEventRate?iEventId=%s&iCustomerID=%s&iRateValue=%s', data.Event.EventId, data.Customer.CustomerId, data.rateValue));
        }
        return new api();
    })

    _module.factory('apiEvent', function ($http, apiBase, App, Error, $q) {
        function api() {}
        api.prototype = new apiBase();
        api.prototype.query = function () {
            return this.httpget(App.apiEndPoint + 'WhatNews/GetAllEvent').then(function(data){
                return _.map(data, function(o){
                        o.RoadShow._startDate = o.RoadShow.StartDate ? new Date(o.RoadShow.StartDate) : null;
                        o.RoadShow._endDateTime = o.RoadShow.EndDateTime ? new Date(o.RoadShow.EndDateTime) : null;
                        var _start = o.RoadShow.StartDate ? moment(o.RoadShow.StartDate) : null;
                        _start = _start ? _start.format('D') : '';
                        var _end = o.RoadShow.EndDateTime ? moment(o.RoadShow.EndDateTime) : null;
                        _end = _end ? _end.format('D MMM YYYY') : '';
                        o._period = _start + '-' + _end;
                        return o;
                    }); 
            });
        }
        api.prototype.get = function (id) {
            return this.httpget(App.apiEndPoint + sprintf('WhatNews/GetWhatNewsById?eventid=%s', id));
        }
        api.prototype.attemp = function (data) {
            return this.httpget(App.apiEndPoint + sprintf('Rate/AttendEvent?iEventId=%s&iCustomerID=%s', data.Event.EventId, data.Customer.CustomerId));
        }
        api.prototype.unattemp = function (data) {
            return this.httpget(App.apiEndPoint + sprintf('Rate/UnAttendEvent?iEventId=%s&iCustomerID=%s', data.Event.EventId, data.Customer.CustomerId));
        }
        api.prototype.getRate = function (where) {
            if (where.Customer)
                return this.httpget(App.apiEndPoint + sprintf('Rate/GetEventRate?iEventId=%s&iCustomerID=%s', where.Event.EventId, where.Customer.CustomerId));
            else
                return this.get(where.Event.EventId).then(function (data) {
                    return {
                        RoadShowId: data.RoadShow.RoadShowId,
                        Total5: data.RoadShow.Star5,
                        Total4: data.RoadShow.Star4,
                        Total3: data.RoadShow.Star3,
                        Total2: data.RoadShow.Star2,
                        Total1: data.RoadShow.Star1,
                        AverRate: data.RoadShow.StartAve,
                        Total: data.RoadShow.StartTotal
                    };
                });
        }
        api.prototype.saveRate = function (id) {
            return this.httpget(App.apiEndPoint + sprintf('Rate/UpdateEventRate?iEventId=%s&iCustomerID=%s&iRateValue=%s', data.Event.EventId, data.Customer.CustomerId, data.rateValue));
        }
        return new api();
    })


    _module.factory('apiCountry', function ($http, apiBase, App, Error, $q) {
        function api() {}
        api.prototype = new apiBase();
        api.prototype.query = function () {
            return $http.get(App.apiEndPoint + 'Country');
        }
        return new api();
    })
}());