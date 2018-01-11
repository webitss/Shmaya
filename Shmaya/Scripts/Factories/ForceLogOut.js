"use strict"
companionApp.factory('forceLogOut', ['$rootScope', '$location', function ($rootScope, $location) {
    return {
        doLogOut: function () {
            $location.path('/');
            console.log('forceLogOut');
            $rootScope.isLogin = true;
            $rootScope.user = null;
            localStorage.setItem('AyeletHashacharCompanionship', null);
        }
    };
}]);
