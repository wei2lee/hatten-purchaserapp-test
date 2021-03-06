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

        .state('app.whatsnews', {
                url: '/whatsnews',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/content/eventsbase.html',
                        controller: 'EventsBaseCtrl'
                    }
                }
            })
        
        .state('app.whatsnew', {
                url: '/whatsnew/{id}',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/content/eventbase.html',
                        controller: 'EventBaseCtrl'
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
        
        .state('app.projects', {
                url: '/projects',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/content/ProjectLarges.html',
                        controller: 'ProjectsCtrl'
                    }
                }
            })
        
        .state('app.project', {
                url: '/project/{id}',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/content/Project.html',
                        controller: 'ProjectCtrl'
                    }
                }
            })
        
        .state('app.consultants', {
                url: '/consultants',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/content/Consultants.html',
                        controller: 'ConsultantsCtrl'
                    }
                }
            })
        
        .state('app.consultants-query-project', {
                url: '/consultants/query/project/{id}',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/content/Consultants.html',
                        controller: 'ConsultantsCtrl'
                    }
                }
            })
        
        .state('app.consultant', {
                url: '/consultant/{id}',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/content/Consultant.html',
                        controller: 'ConsultantCtrl'
                    }
                }
            })
        
        .state('app.constructions-query-project', {
                url: '/constructions/query/project/{id}',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/content/Constructions.html',
                        controller: 'ConstructionsCtrl'
                    }
                }
            })
        
        .state('app.construction', {
                url: '/construction',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/content/Construction.html',
                        controller: 'ConstructionCtrl'
                    }
                }
            })
        
        .state('app.events', {
                url: '/events',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/content/EventsBase.html',
                        controller: 'EventsBaseCtrl'
                    }
                }
            })
        
        
        .state('app.event', {
                url: '/event/{id}',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/content/EventBase.html',
                        controller: 'EventBaseCtrl'
                    }
                }
            })
        
        .state('app.vouchers', {
                url: '/vouchers',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/content/EventsBase.html',
                        controller: 'EventsBaseCtrl'
                    }
                }
            })
        
        .state('app.voucher', {
                url: '/voucher/{id}',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/content/EventBase.html',
                        controller: 'EventBaseCtrl'
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
        
        
        
        .state('app.location', {
                url: '/location/{lot}/{lat}',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/content/LocationBase.html',
                        controller: 'LocationBaseCtrl'
                    }
                }
            })
        
        .state('app.gallery', {
                url: '/gallery',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/content/GalleryBase.html',
                        controller: 'GalleryBaseCtrl'
                    }
                }
            })
        
        $urlRouterProvider.otherwise('/app/projects');
    });


}());