(function () {
    var _module = angular.module('relativeResource', []);
    _module.filter('relativeResource', function (App) {
        return function (input, type) {
            if(input && input.startsWith("http")){
                return input;
            }else{
                if(input) {
                    return App.resourceEndPoint + input;
                }else{
                    type = type || 'GeneralLG' //GeneralXS, GeneralLG, AvatarXS, AvatarLG
                    if(type=='GeneralXS')return App.placeholderGeneralXS;
                    if(type=='GeneralLG')return App.placeholderGeneralLG;
                    if(type=='AvatarXS')return App.placeholderAvatarXS;
                    if(type=='AvatarLG')return App.placeholderAvatarLG;
                    return null;
                }
            }
        };
    });
}());