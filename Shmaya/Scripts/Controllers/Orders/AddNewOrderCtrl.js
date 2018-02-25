"use strict"
companionApp.controller('AddNewOrderCtrl', ['$scope', '$rootScope', 'connect', '$timeout', '$filter', 'alerts', 'createDialog', '$uibModal', 'codeTablesId', '$window',
	function ($scope, $rootScope, connect, $timeout, $filter, alerts, createDialog, $uibModal, codeTablesId, $window) {
		$scope.defOrder = $rootScope.user.nvFirstName + ' ' + $rootScope.user.nvLastName;
		$scope.defDate = new Date();
		$scope.datafunc = { iUserType: 3, iStatusId: 0, iTypeTranslation: null };
		$scope.datafunc2 = { iUserType: 2, iStatusId: 0, iTypeTranslation: null };
		if (!$scope.isEdit) {
			$scope.order = {
				iMonthYearId: parseInt(new Date().getFullYear()) * 100 + new Date().getMonth() + 1,
				iTypeOrder: 22
			}
		}
		else
			$scope.prevTimeTranslation = $scope.order.dtTimeTranslation;
		$scope.testTime = new Date();
		if (!$scope.order)
			$scope.typeTranslation = null
		else
			if ($scope.order.iTypeOrder == 22)
				$scope.typeTranslation = 38
			else
				if ($scope.order.iTypeOrder == 23)
					$scope.typeTranslation = 41
				else
					$scope.typeTranslation = 42
	    $scope.Orderinsert_update;
		if ($scope.isEdit)
			var Orderinsert_update = 'OrderUpdate';
		else 
			var Orderinsert_update = 'OrderInsert';


		$scope.saveOrders = function ()
		{
			$scope.$broadcast('show-errors-check-validity');
			if (!$scope.formOrder.$valid || !$scope.order.iSelectedTranslator || !$scope.order.iUserId) {
	            var savingStatus = "ישנם למלא ערכים תקינים בכל השדות";
				$rootScope.notification(savingStatus);
				alerts.alert("יש למלא ערכים תקינים בכל השדות");
	            return;
			}
			$scope.orderToSend = angular.copy($scope.order);
			if ($scope.order.iMonthYearId instanceof String || typeof $scope.order.iMonthYearId === 'string') {
				$scope.tmpDate2 = $scope.orderToSend.iMonthYearId.substring(0, 2);
				$scope.tmpDate1 = $scope.orderToSend.iMonthYearId.substring(3, 7);
				$scope.tmpDate = parseInt($scope.tmpDate1) * 100 + parseInt($scope.tmpDate2)
				$scope.orderToSend.iMonthYearId = $scope.tmpDate
			}
			if (!($scope.orderToSend.dtDateTraslation_original instanceof String || typeof $scope.orderToSend.dtDateTraslation_original === 'string'))
				$scope.orderToSend.dtDateTraslation = angular.copy($scope.order.dtDateTraslation_original)
			else
			{
				var day = $scope.order.dtDateTraslation_original.substring(0, 2);
				var month = $scope.order.dtDateTraslation_original.substring(3, 5);
				var year = $scope.order.dtDateTraslation_original.substring(6, 10);
				$scope.order.dtDateTraslation = angular.copy(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)))
			}
	        $scope.orderToSend.dtDateTraslation = angular.copy($scope.order.dtDateTraslation_original)
	        $scope.orderToSend.dtTimeBegin = angular.copy($scope.order.dtTimeBegin_original)
			$scope.orderToSend.dtTimeTranslation = angular.copy($scope.order.dtTimeTranslation)
			//if (!$scope.isEdit) {
				if ($scope.order.iSelectedTranslator)
					$scope.orderToSend.iSelectedTranslator = angular.copy($scope.order.iSelectedTranslator.iId)
				if ($scope.order.iUserId)
					$scope.orderToSend.iUserId = angular.copy($scope.order.iUserId.iId)
				if ($scope.order.iAreaId)
					$scope.orderToSend.iAreaId = angular.copy($scope.order.iAreaId.iId)
				if ($scope.order.iCityId)
					$scope.orderToSend.iCityId = angular.copy($scope.order.iCityId.iId)
				if ($scope.order.iTypeTranslation)
					$scope.orderToSend.iTypeTranslation = angular.copy($scope.order.iTypeTranslation.iId)
			//}
			connect.post(true, Orderinsert_update, { order: $scope.orderToSend, iUserManagerId: $rootScope.user.iUserId, prevTimeTranslation: $scope.prevTimeTranslation }, function (result) {
				if (result.iOrderId == -1) {
					alerts.alert("קיימת הזמנה למתורגמן זה בטווח השעות הנבחר")
					if ($scope.isEdit)
						$scope.order.dialogIsOpen = false;
				}
				else
					if (result.iOrderId  && result.iOrderId  > 0) {
	                console.log(Orderinsert_update + ":" + result);
	                var savingStatus = "השינויים נשמרו בהצלחה";
	                $rootScope.notification(savingStatus);
	                if ($scope.isEdit)
	                    $scope.order.dialogIsOpen = false;
					else
					{
						$scope.newOrder.dialogIsOpen = false;
						$scope.OrdersList.push($scope.order);
	                }
	                $scope.prepareData();
	            }
				else {
					//alerts.alert("קיימת הזמנה למתורגמן זה בטווח השעות הנבחר")
	                alert('ארעה שגיאה בלתי צפויה');
	            }
			});
	    }
		$scope.getData = function () {

			connect.post(true, 'GetUsersCode',
				{ iUserType: 2, iStatusId: 0, iTypeTranslation: null },
				function (result) {
					$scope.usersList = result;
				});

			connect.post(true, 'GetUsersCode',
				{ iUserType: 3, iStatusId: 0, iTypeTranslation: 38 },
				function (result) {
					$scope.usersList2 = result;
				});
			connect.post(true, 'GetUserCodeTables', { iUserId: $rootScope.user.iUserId }, function (result) {
				$scope.codeTables = result;
				$scope.monthYearList = $filter('filter')(result, { Key: 'monthYear' }, true)[0].Value;
				$scope.monthYearList.forEach(function (date) {
					$scope.tmpDate1 = date.nvName.substring(0, 4);
					$scope.tmpDate2 = date.nvName.substring(4, 6);
					$scope.tmpDate = $scope.tmpDate2 + '/' + $scope.tmpDate1
					date.nvName = $scope.tmpDate
				})
			});
			if ($scope.OrdersList != undefined) {
				$scope.OrdersList.forEach(function (order) {
					if (order.iMonthYearId instanceof String || typeof order.iMonthYearId === 'string') {
						$scope.tmpDate2 = order.iMonthYearId.substring(0, 2);
						$scope.tmpDate1 = order.iMonthYearId.substring(3, 7);
						$scope.tmpDate = parseInt($scope.tmpDate1) * 100 + parseInt($scope.tmpDate2)
						order.iMonthYearId = $scope.tmpDate
					}

				})
			}
	        if ($scope.order && $scope.order.dtTimeBegin_original && $scope.order.dtTimeEnd && !$scope.order.dtTimeTranslation)
	        {
	            var hours = new Date($scope.order.dtTimeEnd).getHours() - new Date($scope.order.dtTimeBegin_original).getHours();
	            var minutes = new Date($scope.order.dtTimeEnd).getMinutes() - new Date($scope.order.dtTimeBegin_original).getMinutes();
	            if (minutes < 0) {
	                minutes += 60;
	                hours -= 1;
	            }
	            $scope.order.dtTimeTranslation = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay(), hours, minutes);
	        }
	    };

	    $scope.calculateTimeEnd = function () {
	        if (!$scope.order.dtTimeBegin_original || !$scope.order.dtTimeTranslation) return;
	        var hours = $scope.order.dtTimeBegin_original.getHours() + $scope.order.dtTimeTranslation.getHours();
	        var minutes = $scope.order.dtTimeBegin_original.getMinutes() + $scope.order.dtTimeTranslation.getMinutes();
	        if (minutes >= 60) {
	            minutes -= 60;
	            hours += 1;
			}
			$scope.order.dtTimeEnd = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay(), hours, minutes);

		};

		$scope.selectTypeTranslation = function () {
			if ($scope.order.iTypeOrder == 22) {
				connect.post(true, 'GetUsersCode',
					{ iUserType: 3, iStatusId: 0, iTypeTranslation: 38 },
					function (result) {
						$scope.usersList2 = result;
					});
			}
			else
				if ($scope.order.iTypeOrder == 23) {
					connect.post(true, 'GetUsersCode',
						{ iUserType: 3, iStatusId: 0, iTypeTranslation: 41 },
						function (result) {
							$scope.usersList2 = result;
						});
				}
				else {
					connect.post(true, 'GetUsersCode',
						{ iUserType: 3, iStatusId: 0, iTypeTranslation: 42 },
						function (result) {
							$scope.usersList2 = result;
						});
				}
		}

	    $scope.getData();

	}]);