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

		//$scope.getCodeTables = function () {
		//	connect.post(true, GetMemberCodeTables, { iUserId: 1 }, function (result) {
		//		$scope.codeTables = result;
		//		$scope.maritalStatusList = $filter('filter')(result, { Key: codeTablesName.maritalStatus }, true)[0].Value;
		//		$scope.genderList = $filter('filter')(result, { Key: codeTablesName.gender }, true)[0].Value;
		//		$scope.cityList = $filter('filter')(result, { Key: codeTablesName.city }, true)[0].Value;
		//		$scope.educationList = $filter('filter')(result, { Key: codeTablesName.education }, true)[0].Value;
		//		$scope.experienceList = $filter('filter')(result, { Key: codeTablesName.experience }, true)[0].Value;
		//		$scope.employmentList = $filter('filter')(result, { Key: codeTablesName.employment }, true)[0].Value;
		//		$scope.kollellList = $filter('filter')(result, { Key: codeTablesName.kollell }, true)[0].Value;
		//		$scope.nameSourceList = $filter('filter')(result, { Key: codeTablesName.nameSource }, true)[0].Value;
		//		$scope.fileSourceList = $filter('filter')(result, { Key: codeTablesName.fileSource }, true)[0].Value;
		//		$scope.yearList = $filter('filter')(result, { Key: codeTablesName.year }, true)[0].Value;
		//		$scope.donationList = $filter('filter')(result, { Key: codeTablesName.donation }, true)[0].Value;
		//		$scope.statusList = $filter('filter')(result, { Key: codeTablesName.status }, true)[0].Value;
		//	});
		//}

		$scope.ordersTabClick = function (index) {
			$scope.ordersActiveTab = index;
			if (index == 1)
				$scope.showCustomer = false;
			else
				$scope.showCustomer = true;
		};
	}]);