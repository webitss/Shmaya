"use strict"
companionApp.controller('SettingTabsCtrl', ['$scope', '$rootScope', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'codeTablesId', function ($scope, $rootScope, connect, $location, $filter, $timeout, codeTablesName, codeTablesId) {
    $scope.settingsActiveTab = 0;
    $scope.tabs = [
		{ title: 'טבלת זכאות', content: 'Partials/Pages/Settings/EligibilityTable.html', disabled: $rootScope.user.iUserType != codeTablesId.permissionType.systemAdministrator},
        { title: 'סל תקשורת', content: 'Partials/Pages/Settings/MoreSettings.html', disabled: $rootScope.user.iUserType != codeTablesId.permissionType.systemAdministrator },
		{ title: 'תשלומים', content: 'Partials/Pages/Settings/Permissions.html', disabled: $rootScope.user.iUserType != codeTablesId.permissionType.systemAdministrator },
		{ title: 'מוצרים', content: 'Partials/Pages/Settings/Permissions.html', disabled: $rootScope.user.iUserType != codeTablesId.permissionType.systemAdministrator },
		{ title: 'חודשים', content: 'Partials/Pages/Settings/Permissions.html', disabled: $rootScope.user.iUserType != codeTablesId.permissionType.systemAdministrator }

    ];

    $scope.settingsTabClick = function (index) {
        if (!$scope.tabs[index].disabled)
            $scope.settingsActiveTab = index;

    };
}]);
