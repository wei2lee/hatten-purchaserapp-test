
(function () {
    var _module = angular.module('convertToInAppBrowserLink', []);
    _module.filter('convertToInAppBrowserLink', [function ($sce) {
        return function (text) {
            if(text) {
                $pts = $(text);
                $pt = $("<div/>");
                $pt.append($pts);
                $a = $pt.find('a');
                $a.each(function() {
                    var href = $(this).attr("href");
                    var ngclick = "u.navigateToStateWithIntent('app.web', {title:'"+""+"', url:'"+href+"'})";
                    $(this).attr("ng-click", ngclick);
                    $(this).attr("href", "javascript:void(0)");
                });
                text = $pt.get(0).outerHTML;
                return text;
            }else{
                return '';   
            }
        };
    }]);
}());