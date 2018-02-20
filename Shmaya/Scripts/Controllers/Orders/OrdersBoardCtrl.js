"use strict"
companionApp.controller('OrdersBoardCtrl', ['$scope', '$rootScope', 'connect', '$timeout', '$filter', 'alerts', 'createDialog', '$uibModal', 'codeTablesId',
	function ($scope, $rootScope, connect, $timeout, $filter, alerts, createDialog, $uibModal, codeTablesId) {
		$scope.isDataLoaded = 0;
		$scope.newOrder = { dialogIsOpen: false };
		$scope.addNewOrder = function () {
			$scope.isEdit = false;
			$scope.name = "אלפון";
			$scope.newOrder.dialogIsOpen = true;
			$rootScope.$broadcast('displayDialog', { id: 'newOrder' });
		}

		$scope.getSchedulesAsTable = function () {
			connect.post(true, 'GetOrders', {
			}, function (result) {
				$scope.currentMonth = new Date();
				$scope.schedulesAsTable = result;//["Result"];
		
				
				if ($scope.schedulesAsTable.length > 0)
					$scope.currentMonth.setMonth($scope.schedulesAsTable[0].dtDateTraslation.getMonth());
				$scope.isDataLoaded++;
			});
		};
		$scope.getSchedulesAsTable();
}]);