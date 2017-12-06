"use strict"
companionApp.controller('ProductsCtrl', ['$scope', '$rootScope', 'connect', '$timeout', '$filter', 'alerts', 'createDialog', '$uibModal', 'codeTablesId',
	function ($scope, $rootScope, connect, $timeout, $filter, alerts, createDialog, $uibModal, codeTablesId)
	{
		$scope.prepareData = function ()
		{
			$scope.getData();
			$scope.isDataLoaded = 0;
			$scope.gridIdentity = 'productsList';
			$scope.columns =
			[
				{
					fieldName: 'iId',
					title: 'עריכה',
					weight: 0.9,
					filter: false,
					sort: false
				},
				{ title: 'סוג מוצר', fieldName: 'iProductTypeId' },
				{ title: 'שם מוצר', fieldName: 'nvPruductName' }	 
			];
		};
		$scope.getData = function () {
			connect.post(true, 'GetProduct',
				function (result) {
					$scope.productsList = result;
					$scope.isDataLoaded++;
				});
		}
		$scope.prepareData();
	}]);