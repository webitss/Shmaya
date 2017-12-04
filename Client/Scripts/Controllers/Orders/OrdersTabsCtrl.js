"use strict"
companionApp.controller('OrdersTabsCtrl', ['$scope', '$rootScope', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'codeTablesId', function ($scope, $rootScope, connect, $location, $filter, $timeout, codeTablesName, codeTablesId) {
	$scope.ordersActiveTab = 0;
	$scope.tabs = [
		{ title: 'תצוגת רשימה', content: 'Partials/Pages/Orders/Orders.html' },
		{ title: 'תצוגת לוח', content: 'Partials/Pages/Orders/OrdersBoard.html' },

	];

	$scope.ordersTabClick = function (index) {
			$scope.ordersActiveTab = index;

	};
}]);