"use strict"
companionApp.controller('AddNewOrderCtrl', ['$scope', '$rootScope', 'connect', '$timeout', '$filter', 'alerts', 'createDialog', '$uibModal', 'codeTablesId', '$window',
	function ($scope, $rootScope, connect, $timeout, $filter, alerts, createDialog, $uibModal, codeTablesId, $window) {
	    $scope.defOrder = $rootScope.user.nvFirstName + ' ' + $rootScope.user.nvLastName;
		$scope.defDate = new Date();
		if ($scope.isEdit == false) {
			$scope.defYear = $filter('filter')($scope.yearList, { nvName: new Date().getFullYear() + '' }, true)[0].nvName;//(new Date()).getFullYear();
			$scope.defMonth = $scope.monthList[new Date().getMonth()].iId;//(new Date()).getMonth();
			$scope.defMonthYear = parseInt($scope.defYear) * 100 + $scope.defMonth
		}
		//$scope.defMonthYear = parseInt(new Date().getFullYear()) * 100 + parseInt(new Date().getMonth());
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
	    //$scope.order =
	    //{
	    //    iMonthId: $scope.monthList[(new Date().getMonth()) + 1].iId,
	    //    iYearId : $filter('filter')($scope.yearList, { nvName: new Date().getFullYear()+'' }, true)[0].iId
	    //}
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
	        if (!$scope.formOrder.$valid) {
	            var savingStatus = "ישנם למלא ערכים תקינים בכל השדות";
				$rootScope.notification(savingStatus);
				alerts.alert("יש למלא ערכים תקינים בכל השדות");
	            return;
			}
			$scope.orderToSend = angular.copy($scope.order);
			if ($scope.orderToSend.iMonthYearId instanceof String || typeof $scope.orderToSend.iMonthYearId === 'string') {
				$scope.tmpDate2 = $scope.orderToSend.iMonthYearId.substring(0, 2);
				$scope.tmpDate1 = $scope.orderToSend.iMonthYearId.substring(3, 7);
				$scope.tmpDate = parseInt($scope.tmpDate1) * 100 + parseInt($scope.tmpDate2)
				$scope.orderToSend.iMonthYearId = $scope.tmpDate
			}
	        $scope.orderToSend.dtDateTraslation = angular.copy($scope.order.dtDateTraslation_original)
	        $scope.orderToSend.dtTimeBegin = angular.copy($scope.order.dtTimeBegin_original)
			$scope.orderToSend.dtTimeTranslation = angular.copy($scope.order.dtTimeTranslation_original)
			if (!$scope.isEdit)
				$scope.orderToSend.iMonthYearId = $scope.defMonthYear;

	        connect.post(true, Orderinsert_update, { order: $scope.orderToSend, iUserManagerId: $rootScope.user.iUserId }, function (result) {
	            if (result && result > 0) {
	                console.log(Orderinsert_update + ":" + result);
	                var savingStatus = "השינויים נשמרו בהצלחה";
	                $rootScope.notification(savingStatus);
	                if ($scope.isEdit)
	                    $scope.order.dialogIsOpen = false;
	                else {
	                    $scope.newOrder.dialogIsOpen = false;
	                    $scope.getData();
	                }
	                $scope.prepareData();
	            }
	            else {
	                alert('ארעה שגיאה בלתי צפויה');
	            }
			});
	    }
		$scope.getData = function () {
			connect.post(true, 'GetUserCodeTables', { iUserId: $rootScope.user.iUserId }, function (result) {
				$scope.codeTables = result;
				$scope.monthYearList = $filter('filter')(result, { Key: 'monthYear' }, true)[0].Value;
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
	        connect.post(true, 'GetUsers',
				{ iUserType: 2, iStatusId: 0},
                function (result) {
					$scope.ABCBookCustomers = result;
					$scope.order.iUserId = $filter('filter')($scope.ABCBookCustomers, { iUserId: $scope.order.iUserId }, true)[0].iUserId;
					$scope.monthYearList.forEach(function (date) {
					$scope.tmpDate1 = date.nvName.substring(0, 4);
					$scope.tmpDate2 = date.nvName.substring(4, 6);
					$scope.tmpDate = $scope.tmpDate2 + '/' + $scope.tmpDate1
					date.nvName = $scope.tmpDate
			})
                }
            );
	        connect.post(true, 'GetUsers',
				{ iUserType: 3, iStatusId: 0, iTypeTranslation: $scope.typeTranslation},
                function (result) {
                    $scope.ABCBookProviders = result;
                    if ($scope.order.iSelectedTranslator && $scope.order.iSelectedTranslator > 0)
                        $scope.order.iSelectedTranslator = $filter('filter')($scope.ABCBookProviders, { iUserId: $scope.order.iSelectedTranslator }, true)[0].iUserId;
                });
	        if ($scope.order && $scope.order.dtTimeBegin_original && $scope.order.dtTimeEndComputed && !$scope.order.dtTimeTranslation_original)
	        {
	            var hours = new Date($scope.order.dtTimeEndComputed).getHours() - new Date($scope.order.dtTimeBegin_original).getHours();
	            var minutes = new Date($scope.order.dtTimeEndComputed).getMinutes() - new Date($scope.order.dtTimeBegin_original).getMinutes();
	            if (minutes < 0) {
	                minutes += 60;
	                hours -= 1;
	            }
	            $scope.order.dtTimeTranslation_original = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay(), hours, minutes);
	        }
	    };

	    $scope.calculateTimeEnd = function () {
	        if (!$scope.order.dtTimeBegin_original || !$scope.order.dtTimeTranslation_original) return;
	        var hours = $scope.order.dtTimeBegin_original.getHours() + $scope.order.dtTimeTranslation_original.getHours();
	        var minutes = $scope.order.dtTimeBegin_original.getMinutes() + $scope.order.dtTimeTranslation_original.getMinutes();
	        if (minutes >= 60) {
	            minutes -= 60;
	            hours += 1;
	        }
	        $scope.order.dtTimeEndComputed = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay(), hours, minutes);

		};

		$scope.selectTypeTranslation = function () {
				if ($scope.order.iTypeOrder == 22)
					$scope.typeTranslation = 38
				else
					if ($scope.order.iTypeOrder == 23)
						$scope.typeTranslation = 41
					else
						$scope.typeTranslation = 42

			connect.post(true, 'GetUsers',
				{ iUserType: 3, iStatusId: 0, iTypeTranslation: $scope.typeTranslation },
				function (result) {
					$scope.ABCBookProviders = result;
					if ($scope.order.iSelectedTranslator && $scope.order.iSelectedTranslator > 0)
						$scope.order.iSelectedTranslator = $filter('filter')($scope.ABCBookProviders, { iUserId: $scope.order.iSelectedTranslator }, true)[0].iUserId;
				});
		}

	    $scope.getData();

	}]);