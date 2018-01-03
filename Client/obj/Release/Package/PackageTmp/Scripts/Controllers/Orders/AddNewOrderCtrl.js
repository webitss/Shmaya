"use strict"
companionApp.controller('AddNewOrderCtrl', ['$scope', '$rootScope', 'connect', '$timeout', '$filter', 'alerts', 'createDialog', '$uibModal', 'codeTablesId',
	function ($scope, $rootScope, connect, $timeout, $filter, alerts, createDialog, $uibModal, codeTablesId) {
		$scope.defOrder = $rootScope.user.nvFirstName + ' ' + $rootScope.user.nvLastName;
		$scope.defDate = new Date();
		$scope.defYear = (new Date()).getFullYear();
		$scope.testTime = new Date();
		//$scope.order.timeTranslation = $filter('date')($scope.order.timeTranslation, 'HH:mm');
		//$scope.order.dtDateTraslation = new Date();
		$scope.Orderinsert_update;
		if ($scope.isEdit)
			var Orderinsert_update = 'OrderUpdate';
		else
			var Orderinsert_update = 'OrderInsert';
		$scope.saveOrders = function ()
		{
			$scope.$broadcast('show-errors-check-validity');
			if (!$scope.formOrder.$valid)
			{
				var savingStatus = "ישנם למלא ערכים תקינים בכל השדות";
				$rootScope.notification(savingStatus);
				return;
			}
			$scope.orderToSend = angular.copy($scope.order);
			$scope.orderToSend.dtDateTraslation = angular.copy($scope.order.dtDateTraslation_original)
			$scope.orderToSend.dtTimeBegin = angular.copy($scope.order.dtTimeBegin_original)
			$scope.orderToSend.dtTimeTranslation = angular.copy($scope.order.dtTimeTranslation_original)
			
			connect.post(true, Orderinsert_update, { order: $scope.orderToSend, iUserManagerId: $rootScope.user.iUserId }, function (result)
			{
				if (result && result > 0)
				{
					console.log(Orderinsert_update+":" + result);
					var savingStatus = "השינויים נשמרו בהצלחה";
					$rootScope.notification(savingStatus);
					if ($scope.isEdit == true)
						$scope.order.dialogIsOpen = false;
					else
						$scope.newOrder = false;
				}
				else
				{
					alert('ארעה שגיאה בלתי צפויה');
				}
			});
		}
		$scope.getData = function ()
		{
				connect.post(true, 'GetUsers',
					{ iUserType: 2 },
					function (result)
					{
						$scope.ABCBookCustomers = result;
					}
				);
				connect.post(true, 'GetUsers',
					{ iUserType: 3 },
					function (result)
					{
						$scope.ABCBookProviders = result;
					});
		};
		$scope.getData();

	}]);