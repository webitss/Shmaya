"use strict"
companionApp.controller('ABCBookTabsCtrl', ['$scope', '$rootScope', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'codeTablesId', function ($scope, $rootScope, connect, $location, $filter, $timeout, codeTablesName, codeTablesId) {
	$scope.ordersActiveTab = 0;
	$scope.tabs = [
		{ title: 'לקוחות', content: 'Partials/Pages/ABCBook/ABCBook.html' },
		{ title: 'נותני שירות', content: 'Partials/Pages/ABCBook/ABCBookProviders.html' },
		{ title: 'מנהלים', content: 'Partials/Pages/ABCBook/ABCBookProviders.html' }

	];

	$scope.ordersTabClick = function (index) {
		$scope.ordersActiveTab = index;

	};
}]);