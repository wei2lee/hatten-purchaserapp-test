(function(){
    var _module = angular.module('RateWidget', []);
    
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

    _module.factory('RateWidget', function(){
        var con = function() {
            this.ItemId = '';
            this.ItemIdPropertyName = '';
            this.title = '';
            this.rate = -1;
            this.review = {
                averageRate:0,
                totalPeople:0,
                totalRatePerStars:[0,0,0,0,0],
                getTotalRateStars: function() {
                    return _.max(this.totalRatePerStars);
                },
                getChartWidth: function(i) {
                    if (this.getTotalRateStars() == 0) {
                        return '0%';
                    } else {
                        return (this.totalRatePerStars[i] / this.getTotalRateStars()) * 100 + '%';
                    }
                },
                getTotalPeople: function() {
                    return _.reduce(ret.review.totalRatePerStars, function (s, o) {
                        return s + o;
                    });
                }
            };
            this.setRate = function (i) {
                var _self = this;
                var oldval = Math.floor(this.rate);
                var newval;
                if (oldval == i && oldval > 1) {
                    newval = oldval - 1;
                } else {
                    newval = i;
                }
                if (oldval == newval) return;
            }
            this.set = function(o) {
                if(o) {
                    if(this.ItemIdPropertyName) {
                        this.ItemId = o[this.ItemIdPropertyName];
                    }
                    this.review.totalRatePerStars[0] = o.Total5;
                    this.review.totalRatePerStars[1] = o.Total4;
                    this.review.totalRatePerStars[2] = o.Total3;
                    this.review.totalRatePerStars[3] = o.Total2;
                    this.review.totalRatePerStars[4] = o.Total1;
                    this.review.averageRate = o.AverRate;
                    this.review.totalPeople = o.Total;
                    
                    console.log(o);
                }
            }
        }
        return con;
    });
}())