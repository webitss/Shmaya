'use strict'
companionApp.controller('OrdersCtrl', ['$scope', '$rootScope', '$timeout', 'connect', '$filter', '$location', 'codeTablesName', 'tablesId', 'alerts', 'codeTablesId',
	function ($scope, $rootScope, $timeout, connect, $filter, $location, codeTablesName, tablesId, alerts, codeTablesId) {
		$scope.isEdit = false;
		$scope.prepareData = function () {
			$scope.isDataLoaded = 0;
			$scope.gridIdentity = 'OrdersList';
			$scope.columns = [
				{
					fieldName: 'iOrderId',
					title: 'עריכה',
					template: '<div class="pass user-class glyphicon glyphicon-pencil"  ng-click="col.clickEvent(item)"></div>',
					clickEvent: function (order) {
						$scope.isEdit = true;
						order.dialogIsOpen = true;
						$rootScope.$broadcast('displayDialog', { id: order.iOrderId });
					},

					weight: 0.5,
					filter: false,
					sort: false
				},
				{
					fieldName: 'iOrderId',
					title: 'ביטול',
					//type: ($rootScope.user.iUserType != codeTablesId.permissionType.systemAdministrator && $rootScope.user.iUserType != codeTablesId.permissionType.schedulingCoordinator) ? 'hidden' : 'visible',
					template: '<div class=\'pass glyphicon glyphicon-remove color-text-gray\' ng-click=\'col.deleteAOrder(item)\'></div>',
					deleteAOrder: function (item) {
						//$scope.someone = item.nvFirstName + ' ' + item.nvLastName;
						alerts.confirm('האם לבטל הזמנה זו?', alerts.titles.message, function () {
							$scope.deleteOrder(item);
						}, function () {
						});
					},
					weight: 0.5,
					filter: false,
					sort: false
			
				},
				{
					title: 'סטאטוס', fieldName: 'iStatusId', filter: true, type: 'select', data: $scope.statusList, onChange: function (item) {
						alert("לשנות בשרת")
					}
				},
				{ title: 'מספר הזמנה', fieldName: 'iOrderId' },
				{ title: 'שם לקוח', fieldName: 'nameCustomer' },
				{ title: 'שם מתורגמן', fieldName: 'nameTranslator' },
				{ title: 'סוג הזמנה', fieldName: 'typeOrder' },
				{ title: 'סוג תרגום', fieldName: 'typeTranslation' },
				{ title: 'איזור', fieldName: 'area' },
				{ title: 'כתובת', fieldName: 'nvStreet' },
				{ title: 'תאריך תרגום', fieldName: 'dtDateTraslation'},
				{ title: 'שיוך לחודש', fieldName: 'nvMonthName' },
				{ title: 'זמן תרגום', fieldName: 'timeTranslation'},
				{ title: 'שעת התחלה', fieldName: 'dtTimeBegin'},
				{ title: 'משתמש מזין', fieldName: 'nvCreateUserId' },
			];
			$scope.getData();


		};
		$scope.getData = function () {
			connect.post(true, 'GetOrders', {},
				function (result) {
					$scope.OrdersList = result;
					$scope.isDataLoaded++;
				});
		};
		
		$scope.EditCust = function () {
			$scope.editCustomer = true;
			$rootScope.$broadcast('displayDialog', { id: 'newMember' });
		}

		$scope.exportToExcel = function () {
			$scope.$broadcast('exportToExcel', {
				id: $scope.gridIdentity,
				fileName: 'הזמנות'
			});
		};

		//$scope.deleteMember = function (item) {
		//	$rootScope.delete = true;
		//	connect.post(true, connect.functions.DeleteMember, { 'iPersonId': item.iPersonId, iUserId: $rootScope.user.iUserId }, function (result) {
		//		if (result) {
		//			//$scope.removeMember(item);
		//			$scope.getData();
		//		} else {
		//			alert('error!');
		//		}
		//	});
		//}

		$rootScope.$on('deleteList', function () {
			$scope.listToSend = [];
			$scope.haveSend = false
		});

		$scope.prepareData();
		
		$scope.addNewOrder = function () {
			$scope.isEdit = false;
			$scope.name = "אלפון";
			$scope.newOrder = true;
			$rootScope.$broadcast('displayDialog', { id: 'newOrder' });
		}
		$scope.deleteOrder = function (item) {
			$rootScope.delete = true;
			connect.post(true, "DeleteOrder", { 'iOrderId': item.iOrderId }, function (result) {
				if (result) {
					//$scope.removeMember(item);
					$scope.getData();
				} else {
					alert('error!');
				}
			});
		}

	}]);