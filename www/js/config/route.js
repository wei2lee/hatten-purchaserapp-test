(function () {
    var _module = angular.module('route', []);
    _module.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'AppCtrl'
        })

        .state('app.whatsnew', {
                url: '/whatsnew',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/content/eventsbase.html',
                        controller: 'WhatsNewCtrl'
                    }
                }
            })
        
        .state('app.purchased-properties', {
                url: '/purchasedproperties',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/content/PurchasedProperties.html',
                        controller: 'PurchasedPropertiesCtrl'
                    }
                }
            })
        
        .state('app.construction-projects', {
                url: '/construction-projects',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/content/ProjectSmalls.html',
                        controller: 'ConstructionProjectsCtrl'
                    }
                }
            })
        
        .state('app.events', {
                url: '/events',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/content/EventsBase.html',
                        controller: 'EventsCtrl'
                    }
                }
            })
        
        .state('app.vouchers', {
                url: '/vouchers',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/content/EventsBase.html',
                        controller: 'VouchersCtrl'
                    }
                }
            })
        
        .state('app.calculator-loan', {
                url: '/calculator',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/content/CalculatorLoan.html',
                        controller: 'CalculatorLoanCtrl'
                    }
                }
            })
        
        .state('app.profile', {
                url: '/profile',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/content/Profile.html',
                        controller: 'ProfileCtrl'
                    }
                }
            })
        
        .state('app.aboutus', {
                url: '/aboutus',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/content/AboutUs.html',
                        controller: 'AboutUsCtrl'
                    }
                }
            })
        
        $urlRouterProvider.otherwise('/app/whatsnew');
    });


}());