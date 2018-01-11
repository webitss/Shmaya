"use strict"
companionApp.controller('EditCustomerCtrl', ['$scope', '$rootScope', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'codeTablesId',
	function ($scope, $rootScope, connect, $location, $filter, $timeout, codeTablesName, codeTablesId) {
	

	$scope.index = 0;


	$scope.loadCodeTablesList = false;
	if ($scope.showCustomer) {
		$scope.tabs = [
			{ title: 'פרטים אישיים', content: 'Partials/Pages/EditCustomer/PrivateDetails.html' },
			{ title: 'החזרים  ללקוח', content: 'Partials/Pages/EditCustomer/Refunds.html' },
			{ title: 'שליחת הודעות', content: 'Partials/Pages/EditCustomer/MessagesCust.html' },
			{ title: 'הזמנות ללקוח', content: 'Partials/Pages/EditCustomer/Connections.html' }, 
			{ title: 'תיעוד שיחות', content: 'Partials/Pages/Conversations.html' },
			{ title: 'הערות', content: 'Partials/Pages/EditCustomer/Remarks.html' }
		];
	}
	if (!$scope.showCustomer) {
		$scope.tabs = [
			{ title: 'פרטים אישיים', content: 'Partials/Pages/EditCustomer/PrivateDetails.html' },
			{ title: 'שליחת הודעות', content: 'Partials/Pages/EditCustomer/MessagesCust.html' },
			{ title: 'הזמנות', content: 'Partials/Pages/EditCustomer/Connections.html' },
			{ title: 'תיעוד שיחות', content: 'Partials/Pages/Conversations.html' },
			{ title: 'הערות', content: 'Partials/Pages/EditCustomer/Remarks.html' }
		];
	}

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
}]);