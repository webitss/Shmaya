"use strict"
companionApp.controller('ABCBookTabsCtrl', ['$scope', '$rootScope', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'codeTablesId',
	function ($scope, $rootScope, connect, $location, $filter, $timeout, codeTablesName, codeTablesId) {
		$scope.ordersActiveTab = 0;
		$scope.showCustomer = true;
		$scope.tabs = [
			{ title: 'לקוחות', content: 'Partials/Pages/ABCBook/ABCBook.html' },
			{ title: 'נותני שירות', content: 'Partials/Pages/ABCBook/ABCBook.html' },
			{ title: 'מנהלים', content: 'Partials/Pages/ABCBook/ABCBook.html' }
		];

		$scope.getCodeTables = function () {
			connect.post(true, 'GetUserCodeTables', { iUserId: $rootScope.user.iUserId }, function (result) {
				$scope.codeTables = result;
				$scope.userTypeList = $filter('filter')(result, { Key: 'userType' }, true)[0].Value;
				$scope.genderList = $filter('filter')(result, { Key: 'gender' }, true)[0].Value;
				$scope.translateTypeList = $filter('filter')(result, { Key: 'translateType' }, true)[0].Value;
				$scope.orderTypeList = $filter('filter')(result, { Key: 'orderType' }, true)[0].Value;
				$scope.statusList = $filter('filter')(result, { Key: 'status' }, true)[0].Value;
				$scope.areaList = $filter('filter')(result, { Key: 'area' }, true)[0].Value;
				$scope.productTypeList = $filter('filter')(result, { Key: 'productType' }, true)[0].Value;
				$scope.workerTypeList = $filter('filter')(result, { Key: 'workerType' }, true)[0].Value;
				$scope.paymentStatusList = $filter('filter')(result, { Key: 'paymentStatus' }, true)[0].Value;
				$scope.city = $filter('filter')(result, { Key: 'city' }, true)[0].Value;
				$scope.countryList = $filter('filter')(result, { Key: 'country' }, true)[0].Value;
				$scope.languageList = $filter('filter')(result, { Key: 'language' }, true)[0].Value;
				$scope.isWorkerList = $filter('filter')(result, { Key: 'isWorker' }, true)[0].Value;
				$scope.monthList = $filter('filter')(result, { Key: 'month' }, true)[0].Value;
			});
		}

		

		$scope.ordersTabClick = function (index) {
			$scope.ordersActiveTab = index;
			//if it is service provider
			if (index == 1) {
				$scope.showCustomer = false;
				$scope.showAdmin = false;
			}
			else
				//if it is customer
				if (index == 0) {
					$scope.showCustomer = true;
					$scope.showAdmin = false;
				}
				//if it is administrator
				else
				{
					$scope.showCustomer = false;
					$scope.showAdmin = true;
				}
		};
		$scope.getCodeTables();
	}]);