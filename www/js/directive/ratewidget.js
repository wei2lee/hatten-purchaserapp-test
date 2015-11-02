(function () {
    var _module = angular.module('rateWidget', []);
    _module.directive('rateWidget', function () {
        return {
            templateUrl: 'templates/u/RateWidget.html',
            replace: true,
            scope: {
                rate:'=rate'
            },
            link: function (scope, element, attrs, ctrls) {
            }
        };
    })
}());

