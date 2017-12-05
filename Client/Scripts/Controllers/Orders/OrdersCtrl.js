// JavaScript source code
"use strict"
companionApp.controller('OrdersCtrl', ['$scope', '$rootScope', 'connect', '$timeout', '$filter', 'alerts', 'createDialog', '$uibModal', 'codeTablesId', function ($scope, $rootScope, connect, $timeout, $filter, alerts, createDialog, $uibModal, codeTablesId) {
	//$scope.isDataLoaded = 0;
	$scope.gridIdentity = 'ordersList';
	$scope.columns = [
		{
			fieldName: 'iId',
			title: 'עריכה',
			weight: 0.9,
			filter: false,
			sort: false
		},
		{
			fieldName: 'iPersonId',
			title: 'ביטול',
			type: ($rootScope.user.iUserType != codeTablesId.permissionType.systemAdministrator && $rootScope.user.iUserType != codeTablesId.permissionType.schedulingCoordinator) ? 'hidden' : 'visible',
			template: '<div class=\'pass glyphicon glyphicon-remove color-text-gray\' ng-click=\'col.deleteAMember(item)\'></div>',
			deleteAMember: function (item) {
				$scope.someone = item.nvFirstName + ' ' + item.nvLastName;
				alerts.confirm('האם ברצונך להסיר את ' + $scope.someone + ' מהאלפון?', alerts.titles.message, function () {
					$scope.deleteMember(item);
				}, function () {
				});
			},
			weight: 0.5,
			filter: false,
			sort: false
		},
		{ title: 'מספר הזמנה', fieldName: 'iOrderId' },
		{ title: 'שם לקוח', fieldName: 'nvLastName' },
		{ title: 'שם מתורגמן', fieldName: 'iAge', weight: 0.5 },
		{ title: 'סוג הזמנה', fieldName: 'nvAddress' },
		{ title: 'סוג תרגום', fieldName: 'nvCityType' },
		{ title: 'איזור', fieldName: 'nvEmail' },
		{ title: 'כתובת', fieldName: 'nvPhoneNumber' },
		{ title: 'תאריך תרגום', fieldName: 'nvMobileNumber' },
		{ title: 'שיוך לחודש', fieldName: 'nvDepartmentName', weight: 0.8 },
		{ title: 'זמן תרגום', fieldName: 'nvStatusType' },
		{ title: 'שעת התחלה', fieldName: 'dtTimeBegin' },
		{ title: 'משתמש מזין', fieldName: 'nvAvailability' }
	];
	$scope.addNewOrder = function ()
	{
		$scope.name = "אלפון";
		$scope.newOrder = true;
		$rootScope.$broadcast('displayDialog', { id: 'newOrder' });
	}
	

}]);


