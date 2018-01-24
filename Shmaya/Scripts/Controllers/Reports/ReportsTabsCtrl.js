"use strict"
companionApp.controller('ReportsTabsCtrl', ['$scope', '$rootScope', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'codeTablesId',
	function ($scope, $rootScope, connect, $location, $filter, $timeout, codeTablesName, codeTablesId) {
	$scope.ordersActiveTab = 0;
	$scope.tabs = [
		{ title: 'דוח נותני שירות', content: 'Partials/Pages/Reports/Reports.html' },
		{ title: 'דוח מקבלי שירות', content: 'Partials/Pages/Reports/ReportsCustomer.html' },
		{ title: 'דוח מוצרים', content: 'Partials/Pages/Reports/ReportsProduct.html' },

	];

	$scope.getCodeTables = function () {
		connect.post(true, 'GetUserCodeTables', { iUserId: $rootScope.user.iUserId }, function (result) {
			$scope.monthList = $filter('filter')(result, { Key: 'month' }, true)[0].Value;
			$scope.yearList = $filter('filter')(result, { Key: 'year' }, true)[0].Value;
			$scope.monthYearList = $filter('filter')(result, { Key: 'monthYear' }, true)[0].Value;
			$scope.monthYearList.forEach(function (date) {
				$scope.tmpDate1 = date.nvName.substring(0, 4);
				$scope.tmpDate2 = date.nvName.substring(4, 6);
				$scope.tmpDate = $scope.tmpDate2 + '/' + $scope.tmpDate1
				date.nvName = $scope.tmpDate
			})
		});
	}



	$scope.ordersTabClick = function (index) {
		$scope.ordersActiveTab = index;

	};
	$scope.getCodeTables();
}]);