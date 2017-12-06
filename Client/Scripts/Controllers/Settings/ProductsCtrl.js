"use strict"
companionApp.controller('ProductsCtrl', ['$scope', '$rootScope', 'connect', '$timeout', '$filter', 'alerts', 'createDialog', '$uibModal', 'codeTablesId',
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
			{ title: 'סוג מוצר', fieldName: 'dtTimeBegin' },
			{ title: 'שם מוצר', fieldName: 'nvAvailability' }
		];
	}]);