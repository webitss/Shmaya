"use strict"
companionApp.controller('AddNewOrderCtrl', ['$scope', '$rootScope', 'connect', '$timeout', '$filter', 'alerts', 'createDialog', '$uibModal', 'codeTablesId', '$window',
	function ($scope, $rootScope, connect, $timeout, $filter, alerts, createDialog, $uibModal, codeTablesId, $window) {
	    $scope.defOrder = $rootScope.user.nvFirstName + ' ' + $rootScope.user.nvLastName;
	    $scope.defDate = new Date();
	    $scope.defYear = $filter('filter')($scope.yearList, { nvName: new Date().getFullYear() + '' }, true)[0].iId;//(new Date()).getFullYear();
	    $scope.defMonth = $scope.monthList[new Date().getMonth()].iId;//(new Date()).getMonth();
	    $scope.testTime = new Date();
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

	    $scope.saveOrders = function () {
	        $scope.$broadcast('show-errors-check-validity');
	        if (!$scope.formOrder.$valid) {
	            var savingStatus = "ישנם למלא ערכים תקינים בכל השדות";
	            $rootScope.notification(savingStatus);
	            return;
	        }
	        $scope.orderToSend = angular.copy($scope.order);
	        $scope.orderToSend.dtDateTraslation = angular.copy($scope.order.dtDateTraslation_original)
	        $scope.orderToSend.dtTimeBegin = angular.copy($scope.order.dtTimeBegin_original)
	        $scope.orderToSend.dtTimeTranslation = angular.copy($scope.order.dtTimeTranslation_original)

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
	        connect.post(true, 'GetUsers',
				{ iUserType: 2, iStatusId: 0},
                function (result) {
					$scope.ABCBookCustomers = result;
					$scope.order.iUserId = $filter('filter')($scope.ABCBookCustomers, { iUserId: $scope.order.iUserId }, true)[0].iUserId;
                }
            );
	        connect.post(true, 'GetUsers',
                { iUserType: 3 ,iStatusId:0},
                function (result) {
                    $scope.ABCBookProviders = result;
                    if ($scope.order.iSelectedTranslator && $scope.order.iSelectedTranslator > 0)
                        $scope.order.iSelectedTranslator = $filter('filter')($scope.ABCBookProviders, { iUserId: $scope.order.iSelectedTranslator }, true)[0].iUserId;
                });
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

	    $scope.getData();

	}]);