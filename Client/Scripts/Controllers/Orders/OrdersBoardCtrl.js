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
				//iBranchId: $scope.interviewScheduler.iBranchId,
				//iInterviewerId: $scope.interviewScheduler.iInterviewerId,
				//iGenderId: $scope.interviewScheduler.iGenderId,
				//nvAddress: $scope.interviewScheduler.nvAddress
			}, function (result) {
				$scope.currentMonth = new Date();
				$scope.schedulesAsTable = result;//["Result"];
		
				
				if ($scope.schedulesAsTable.length > 0)
					$scope.currentMonth.setMonth($scope.schedulesAsTable[0].dtDateTraslation.getMonth());
				$scope.isDataLoaded++;
			});
		};
		$scope.getSchedulesAsTable();
		//$scope.getData = function () {
		//	connect.post(true, 'GetOrders', {},
		//		function (result) {
		//			$scope.OrdersList = result;
		//			$scope.isDataLoaded++;
		//		});
		//	$scope.initOrdersList();
		//};

		

		////	}, function () {
		////		createDialog({
		////			id: 'GetAdvancedStudy',
		////			template: "<div class='divAlert'><p>ארעה שגיאה בלתי צפויה</p> <button  ng-click='$modalCancel()' class='btn  btn-Alert btn-Alert-submit'><span> אישור</span><img src='Images/v-command.png'/></button>" + "</div>",
		////			title: "שגיאה",
		////			scope: $rootScope,
		////			backdrop: true,
		////			modalClass: "modal modalAlert"
		////		});
		////	});
		////}
		//		$scope.getData();
}]);