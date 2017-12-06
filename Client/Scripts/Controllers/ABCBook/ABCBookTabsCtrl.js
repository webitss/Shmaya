"use strict"
companionApp.controller('ABCBookTabsCtrl', ['$scope', '$rootScope', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'codeTablesId',
	function ($scope, $rootScope, connect, $location, $filter, $timeout, codeTablesName, codeTablesId) {
	$scope.ordersActiveTab = 0;
	$scope.showCustomer = true;
	$scope.tabs = [
		{ title: 'לקוחות', content: 'Partials/Pages/ABCBook/ABCBook.html' },
		{ title: 'נותני שירות', content: 'Partials/Pages/ABCBook/ABCBook.html' },
		{ title: 'מנהלים', content: 'Partials/Pages/ABCBook/ABCBookAdministrators.html' }

	];

	$scope.ordersTabClick = function (index) {
		$scope.ordersActiveTab = index;
		if (index == 1) 
			$scope.showCustomer = false;
		else
			$scope.showCustomer = true;
	};
}]);