(function(){
    var _module = angular.module('value', []);
    _module.value('App', {
        device:{
            version:'0.0.0'
        },
        token:{
            
        },
        privateAppStoreApiEndPoint:'http://infradigital.com.my/appstore/cms/resources/',
        apiEndPoint:'http://103.9.149.59:8034/api/',
        authorizateApiEndPoint:'http://103.9.149.59:8034/',
        resourceEndPoint:'http://103.9.149.59:8034/data/HATT/',
        apiUserUsername:'90731C01@hatt',
        apiUserPassword:'F2568907B18C',
        googleApiKey:'AIzaSyAZU6hYAxURw1ewJYV4OMLitTYd01xPb0I',
        placeholderGeneralLG: 'img/placeholder_general_lg.png',
        placeholderGeneralXS: 'img/placeholder_general_sm.png',
        placeholderAvatarLG: 'img/placeholder_people_lg.png',
        placeholderAvatarXS: 'img/placeholder_people_sm.png',
        collectionRepeatCardBottomMarginLarge: 20,
        collectionRepeatCardBottomMarginSmall: 10,
        collectionRepeatCardLargeImageRatioLG:{
            ratio:1.66,
            width:1024
        },
        collectionRepeatCardLargeImageRatioXS:{
            ratio:1,
            width:480
        }
    });
    _module.value('Intent', {
        
        
    });
}());