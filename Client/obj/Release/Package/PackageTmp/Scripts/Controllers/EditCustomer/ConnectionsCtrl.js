"use strict"
companionApp.controller('ConnectionsCtrl', ['$scope', '$rootScope', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'codeTablesId',
	function ($scope, $rootScope, connect, $location, $filter, $timeout, codeTablesName, codeTablesId) {
		$scope.prepareData = function () {
			$scope.isDataLoaded = 0;
			$scope.gridIdentity = 'ordersByUserList';
			$scope.columns = [
				{
					fieldName: 'iUserId',
					title: 'עריכה',
					template: '<div class="pass user-class glyphicon glyphicon-pencil"  ng-click="col.clickEvent(item)"></div>',
					clickEvent: function (order) {
						order.dialogIsOpen = true;
						$rootScope.$broadcast('displayDialog', { id: order.iOrderId });
					},

					weight: 0.5,
					filter: false,
					sort: false
				},
				{ title: 'סטטוס', fieldName: 'status' },
				{ title: 'מספר הזמנה', fieldName: 'iOrderId', weight: 0.5 },
				{ title: 'שם מתורגמן', fieldName: 'nameTranslator' },
				{ title: 'סוג הזמנה', fieldName: 'typeOrder' },
				{ title: 'סוג תרגום', fieldName: 'typeTranslation' },
				{ title: 'תאריך תרגום', fieldName: 'dtDateTraslation' },
				{ title: 'שיוך לחודש', fieldName: 'nvMonthName' },
				{ title: 'זמן תרגום', fieldName: '' },
				{ title: 'שעת התחלה', fieldName: 'dtTimeBegin' }

			];
			$scope.getData();
			
		};
		$scope.getData = function () {
			connect.post(true, 'GetOrdersByUser', { iUserId: $scope.user.iUserId },
				function (result) {
					$scope.ordersByUserList = result;
					$scope.isDataLoaded++;
				});
		};
		$scope.prepareData();
	}]);