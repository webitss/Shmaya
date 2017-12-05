"use strict"
companionApp.controller('EligibilityTableCtrl', ['$scope', '$rootScope', 'connect', '$timeout', '$filter', 'alerts', 'createDialog', '$uibModal', 'codeTablesId',
	function ($scope, $rootScope, connect, $timeout, $filter, alerts, createDialog, $uibModal, codeTablesId) {
		$scope.gridIdentity = 'ordersList';
		$scope.columns = [
			{
				fieldName: 'iId',
				title: 'עריכה',
				weight: 0.9,
				filter: false,
				sort: false
			},
			{ title: 'סוג זכאות', fieldName: 'dtTimeBegin' },
			{ title: 'מספר שעות זכאות', fieldName: 'nvAvailability' }
		];
	}]);