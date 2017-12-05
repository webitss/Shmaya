"use strict"
companionApp.controller('ReportsTabsCtrl', ['$scope', '$rootScope', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'codeTablesId',
	function ($scope, $rootScope, connect, $location, $filter, $timeout, codeTablesName, codeTablesId) {
	$scope.ordersActiveTab = 0;
	$scope.tabs = [
		{ title: 'דוח נותני שירות', content: 'Partials/Pages/Reports/Reports.html' },
		{ title: 'דוח מקבלי שירות', content: 'Partials/Pages/Reports/Reports.html' },
		{ title: 'דוח מוצרים', content: 'Partials/Pages/Reports/Reports.html' },

	];

	$scope.ordersTabClick = function (index) {
		$scope.ordersActiveTab = index;

	};
}]);