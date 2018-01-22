"use strict"
companionApp.controller('ConnectionsCtrl', ['$scope', '$rootScope', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'codeTablesId',
	function ($scope, $rootScope, connect, $location, $filter, $timeout, codeTablesName, codeTablesId) {
	    $scope.prepareData = function () {
	        if ($scope.showCustomer == true) {
	            $scope.userType = 2;
	            $scope.nameType = 'שם מתורגמן';
	            $scope.fieldType = 'nameTranslator'
	        }
	        else {
	            $scope.userType = 3;
	            $scope.nameType = 'שם לקוח';
	            $scope.fieldType = 'nameCustomer'
	        }

	        $scope.isDataLoaded = 0;
	        $scope.gridIdentity = 'ordersByUserList';
	        $scope.columns = [
				{
				    fieldName: 'iUserId',
				    title: 'עריכה',
				    template: '<div class="pass user-class glyphicon glyphicon-pencil"  ng-click="col.clickEvent(item)"></div>',
				    clickEvent: function (order) {
				        order.dialogIsOpen = true;
				        if (order.iMonthYearId instanceof String || typeof order.iMonthYearId === 'string') {
				            $scope.tmpDate2 = order.iMonthYearId.substring(0, 2);
				            $scope.tmpDate1 = order.iMonthYearId.substring(3, 7);
				            $scope.tmpDate = parseInt($scope.tmpDate1) * 100 + parseInt($scope.tmpDate2)
				            order.iMonthYearId = $scope.tmpDate
				        }
				        $rootScope.$broadcast('displayDialog', { id: order.iOrderId });
				    },

				    weight: 0.5,
				    filter: false,
				    sort: false
				},
				{ title: 'סטטוס', fieldName: 'status' },
				{ title: 'מספר הזמנה', fieldName: 'iOrderId', weight: 0.5 },
				{ title: $scope.nameType, fieldName: $scope.fieldType },
				{ title: 'סוג הזמנה', fieldName: 'typeOrder' },
				{ title: 'סוג תרגום', fieldName: 'typeTranslation' },
				{ title: 'תאריך תרגום', fieldName: 'dtDateTraslation', type: 'date' },
				{ title: 'שיוך לחודש', fieldName: 'iMonthYearId' },
				{ title: 'זמן תרגום', fieldName: 'nvTimeTranslation', doSum: true, weight: 1.2 },
				{ title: 'שעת התחלה', fieldName: 'dtTimeBegin', type: 'time' }

	        ];
	        $scope.getData();

	    };
	    $scope.getData = function () {

	        connect.post(true, 'GetOrdersByUser', { iUserId: $scope.user.iUserId, iUserType: $scope.userType },
				function (result) {
					$scope.ordersByUserList = result;
					$scope.isDataLoaded++;
					$scope.ordersByUserList.forEach(function (order) {
						order.iMonthYearId = order.iMonthYearId + ""
						$scope.tmpDate1 = order.iMonthYearId.substring(0, 4);
						$scope.tmpDate2 = order.iMonthYearId.substring(4, 6);
						$scope.tmpDate = $scope.tmpDate2 + '/' + $scope.tmpDate1;
						order.iMonthYearId = $scope.tmpDate;
					})
				});
	    };
	    $scope.prepareData();
	}]);