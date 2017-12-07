'use strict'
companionApp.controller('OrdersCtrl', ['$scope', '$rootScope', '$timeout', 'connect', '$filter', '$location', 'codeTablesName', 'tablesId', 'alerts', 'codeTablesId',
	function ($scope, $rootScope, $timeout, connect, $filter, $location, codeTablesName, tablesId, alerts, codeTablesId) {
		
		$scope.prepareData = function () {
			$scope.isDataLoaded = 0;
			$scope.gridIdentity = 'OrdersList';
			$scope.columns = [
				{
					fieldName: 'iOrderId',
					title: 'עריכה',
					template: '<div class="pass user-class glyphicon glyphicon-pencil"  ng-click="col.clickEvent(item)"></div>',
					clickEvent: function (order) {
						order.dialogIsOpen = true;
						$rootScope.$broadcast('displayDialog', { id: order.iOrderId });
					},
					weight: 0.9,
					filter: false,
					sort: false
				},
				{
					fieldName: 'iPersonId',
					title: 'מחיקה',
					type: ($rootScope.user.iUserType != codeTablesId.permissionType.systemAdministrator && $rootScope.user.iUserType != codeTablesId.permissionType.schedulingCoordinator) ? 'hidden' : 'visible',
					template: '<div class=\'pass glyphicon glyphicon-remove color-text-gray\' ng-click=\'col.deleteAMember(item)\'></div>',
					deleteAMember: function (item) {
						$scope.someone = item.nvFirstName + ' ' + item.nvLastName;
						alerts.confirm('האם לבטל הזמנה זו?', alerts.titles.message, function () {
							$scope.deleteMember(item);
						}, function () {
						});
					},
					weight: 0.5,
					filter: false,
					sort: false
				},
				{ title: 'מספר הזמנה', fieldName: 'iOrderId' },
				{ title: 'שם לקוח', fieldName: 'nameCustomer' },
				{ title: 'שם מתורגמן', fieldName: 'nameTranslator' },
				{ title: 'סוג הזמנה', fieldName: 'typeOrder' },
				{ title: 'סוג תרגום', fieldName: 'typeTranslation' },
				{ title: 'איזור', fieldName: 'area' },
				{ title: 'כתובת', fieldName: 'nvStreet' },
				{ title: 'תאריך תרגום', fieldName: 'dtDateTraslation',type:'date' },
				{ title: 'שיוך לחודש', fieldName: '' },
				{ title: 'זמן תרגום', fieldName: 'timeTranslation' },
				{ title: 'שעת התחלה', fieldName: 'dtTimeBegin'},
				{ title: 'משתמש מזין', fieldName: '' },
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

		$scope.AddNew = function (type) {
			$scope.name = "אלפון";
			if (type == 1) {
				$scope.selected = {
					idVolunteer: -1,
					idStudent: null
				}
			}
			else if (type == 2)
				$scope.selected = {
					idStudent: -1,
					idVolunteer: null
				}
			$scope.selected.newMember = true;
			$rootScope.$broadcast('displayDialog', { id: 'editCustomer' });
		}

		$scope.EditCust = function () {
			$scope.editCustomer = true;
			$rootScope.$broadcast('displayDialog', { id: 'newMember' });
		}

		$scope.exportToExcel = function () {
			$scope.$broadcast('exportToExcel', {
				id: $scope.gridIdentity,
				fileName: 'אלפון'
			});
		};

		$scope.deleteMember = function (item) {
			$rootScope.delete = true;
			connect.post(true, connect.functions.DeleteMember, { 'iPersonId': item.iPersonId, iUserId: $rootScope.user.iUserId }, function (result) {
				if (result) {
					//$scope.removeMember(item);
					$scope.getData();
				} else {
					alert('error!');
				}
			});
		}

		$rootScope.$on('deleteList', function () {
			$scope.listToSend = [];
			$scope.haveSend = false
		});

		$scope.prepareData();
		
		$scope.addNewOrder = function () {
			$scope.name = "אלפון";
			$scope.newOrder = true;
			$rootScope.$broadcast('displayDialog', { id: 'newOrder' });
		}

	}]);