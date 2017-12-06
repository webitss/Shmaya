"use strict"
companionApp.controller('SettingTabsCtrl', ['$scope', '$rootScope', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'codeTablesId', function ($scope, $rootScope, connect, $location, $filter, $timeout, codeTablesName, codeTablesId) {
    $scope.settingsActiveTab = 0;
    $scope.tabs = [
		{ title: 'טבלת זכאות', content: 'Partials/Pages/Settings/EligibilityTable.html'},
		{ title: 'סל תקשורת', content: 'Partials/Pages/Settings/CommunicationBasket.html'},
		{ title: 'תשלומים', content: 'Partials/Pages/Settings/Payments.html'},
		{ title: 'מוצרים', content: 'Partials/Pages/Settings/Products.html'},
		{ title: 'חודשים', content: 'Partials/Pages/Settings/Permissions.html'}

    ];

	$scope.settingsTabClick = function (index) {

		$scope.settingsActiveTab = index;
	}
		
}]);
