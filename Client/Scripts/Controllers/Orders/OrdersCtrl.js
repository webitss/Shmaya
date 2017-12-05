// JavaScript source code
"use strict"
companionApp.controller('OrdersCtrl', ['$scope', '$rootScope', 'connect', '$timeout', '$filter', 'alerts', 'createDialog', '$uibModal', 'codeTablesId', function ($scope, $rootScope, connect, $timeout, $filter, alerts, createDialog, $uibModal, codeTablesId) {
	//$scope.isDataLoaded = 0;
	$scope.gridIdentity = 'ordersList';
	$scope.columns = [
		{
			fieldName: 'iId',
			title: '�����',
			weight: 0.9,
			filter: false,
			sort: false
		},
		{
			fieldName: 'iPersonId',
			title: '�����',
			type: ($rootScope.user.iUserType != codeTablesId.permissionType.systemAdministrator && $rootScope.user.iUserType != codeTablesId.permissionType.schedulingCoordinator) ? 'hidden' : 'visible',
			template: '<div class=\'pass glyphicon glyphicon-remove color-text-gray\' ng-click=\'col.deleteAMember(item)\'></div>',
			deleteAMember: function (item) {
				$scope.someone = item.nvFirstName + ' ' + item.nvLastName;
				alerts.confirm('��� ������ ����� �� ' + $scope.someone + ' �������?', alerts.titles.message, function () {
					$scope.deleteMember(item);
				}, function () {
				});
			},
			weight: 0.5,
			filter: false,
			sort: false
		},
		{ title: '���� �����', fieldName: 'iOrderId' },
		{ title: '�� ����', fieldName: 'nvLastName' },
		{ title: '�� �������', fieldName: 'iAge', weight: 0.5 },
		{ title: '��� �����', fieldName: 'nvAddress' },
		{ title: '��� �����', fieldName: 'nvCityType' },
		{ title: '�����', fieldName: 'nvEmail' },
		{ title: '�����', fieldName: 'nvPhoneNumber' },
		{ title: '����� �����', fieldName: 'nvMobileNumber' },
		{ title: '���� �����', fieldName: 'nvDepartmentName', weight: 0.8 },
		{ title: '��� �����', fieldName: 'nvStatusType' },
		{ title: '��� �����', fieldName: 'dtTimeBegin' },
		{ title: '����� ����', fieldName: 'nvAvailability' }
	];
	$scope.addNewOrder = function ()
	{
		$scope.name = "�����";
		$scope.newOrder = true;
		$rootScope.$broadcast('displayDialog', { id: 'newOrder' });
	}
	

}]);


