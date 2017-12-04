"use strict"
companionApp.controller('SettingTabsCtrl', ['$scope', '$rootScope', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'codeTablesId', function ($scope, $rootScope, connect, $location, $filter, $timeout, codeTablesName, codeTablesId) {
    $scope.settingsActiveTab = 0;
    $scope.tabs = [
       { title: 'טבלאות קוד', content: 'Partials/Pages/Settings/Settings.html', disabled: $rootScope.user.iUserType != codeTablesId.permissionType.systemAdministrator},
        { title: 'הגדרות נוספות', content: 'Partials/Pages/Settings/MoreSettings.html', disabled: $rootScope.user.iUserType != codeTablesId.permissionType.systemAdministrator },
       { title: 'הרשאות', content: 'Partials/Pages/Settings/Permissions.html', disabled: $rootScope.user.iUserType != codeTablesId.permissionType.systemAdministrator }

    ];

    $scope.settingsTabClick = function (index) {
        if (!$scope.tabs[index].disabled)
            $scope.settingsActiveTab = index;

    };
}]);
