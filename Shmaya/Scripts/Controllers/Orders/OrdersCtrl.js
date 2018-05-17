'use strict'
companionApp.controller('OrdersCtrl', ['$scope', '$rootScope', '$timeout', 'connect', '$filter', '$location', 'codeTablesName', 'tablesId', 'alerts', 'codeTablesId',
	function ($scope, $rootScope, $timeout, connect, $filter, $location, codeTablesName, tablesId, alerts, codeTablesId) {
	    $scope.isEdit = false;

		$scope.prepareData = function () {
			connect.post(true, 'GetUserCodeTables', { iUserId: $rootScope.user.iUserId }, function (result) {
				$scope.codeTables = result;
				$scope.statusList = $filter('filter')(result, { Key: 'status' }, true)[0].Value;

		
	        $scope.isDataLoaded = 0;
			$scope.gridIdentity = 'OrdersList';
			$scope.item2;
			$scope.newOrder = { dialogIsOpen: false };
			$scope.order = { dialogIsOpen: false };
	        $scope.columns = [
				{
				    fieldName: 'iOrderId',
				    title: 'עריכה',
					template: '<div class="pass user-class glyphicon glyphicon-pencil"  ng-click="col.clickEvent(item)"></div>',
					clickEvent: function (order) {
						if (order.item == undefined)
						{
							$scope.order = angular.copy(order)

							if ($scope.order.dtDateTraslation_original)
								console.log(`/Date(${Date.UTC(
										$scope.order.dtDateTraslation_original.getFullYear(),
										$scope.order.dtDateTraslation_original.getMonth(),
										$scope.order.dtDateTraslation_original.getDate(),
										$scope.order.dtDateTraslation_original.getHours(),
										$scope.order.dtDateTraslation_original.getMinutes()
									)})/`)
			
				
							if ($scope.order.iMonthYearId instanceof String || typeof $scope.order.iMonthYearId === 'string') {
								$scope.tmpDate2 = $scope.order.iMonthYearId.substring(0, 2);
								$scope.tmpDate1 = $scope.order.iMonthYearId.substring(3, 7);
								$scope.tmpDate = parseInt($scope.tmpDate1) * 100 + parseInt($scope.tmpDate2)
								$scope.order.iMonthYearId = $scope.tmpDate
							}
							$scope.isEdit = true;
							$scope.order.dialogIsOpen = true;
							$rootScope.$broadcast('displayDialog', { id: $scope.order.iOrderId });
						}
				    },

				    weight: 0.5,
				    filter: false,
				    sort: false
				},
				{
					title: 'ביטול',
				    fieldName: 'iOrderId',
				    template: '<div class=\'pass glyphicon glyphicon-remove color-text-gray\' ng-click=\'col.deleteAOrder(item)\'></div>',
				    deleteAOrder: function (item) {
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
					title: 'סטטוס',
					fieldName: 'iStatusId',
					type: 'select',
					search: true,
					searchField: 'status',
					filterFields: 'status',
					filter: true,
					data: $scope.statusList,
					onChange: function (item) {
						connect.post(true, 'ChangeStatus', { iStatusId: item.iStatusId, iOrderId: item.iOrderId },
							function (result) {
								result = result.toString()
								var isDouble = result.substring(2, 3);
								result = result.substring(0, 2);
								result = parseInt(result)
								isDouble = parseInt(isDouble);
								if (result != item.iStatusId)
								{
									$scope.OrdersList.forEach(function (order)
									{
										if (order.iOrderId == item.iOrderId) {
											order.iStatusId = result;
											return;
										}

									})
									if (isDouble == 0)
										alerts.alert("אין מספיק שעות בבנק השעות ללקוח זה על מנת לשנות לסטטוס המבוקש")
									else
										alerts.alert("קיימת הזמנה למתורגמן זה בטווח השעות הנבחר");
								}
				        	    console.log("change");
				        	});
				    }
				},
				{ title: 'מספר הזמנה', fieldName: 'iOrderId' },
				{ title: 'שם לקוח', fieldName: 'nameCustomer' },
				{ title: 'שם מתורגמן', fieldName: 'nameTranslator' },
				{ title: 'סוג הזמנה', fieldName: 'typeOrder' },
				{ title: 'סוג תרגום', fieldName: 'typeTranslation' },
				{ title: 'איזור', fieldName: 'area' },
				{ title: 'עיר', fieldName: 'nvCity' },
				{ title: 'תאריך תרגום', fieldName: 'dtDateTraslation', type: 'date' },
				{ title: 'שיוך לחודש ושנה', fieldName: 'iMonthYearId' },
				{
					title: 'זמן תרגום', fieldName: 'nvTimeTranslation', doSum: true, weight: 1.2, type: 'time' 
				},
				{ title: 'שעת התחלה', fieldName: 'dtTimeBegin', type: 'time' },
				{ title: 'משתמש מזין', fieldName: 'nvCreateUserId' },
			];
			});
			$scope.getData();


	    };
		$scope.getData = function ()
		{
	
	        connect.post(true, 'GetOrders', {},
				function (result) {
					$scope.OrdersList = result;
					$scope.isDataLoaded++;
					$scope.OrdersList.forEach(function (order) {
						order.iMonthYearId = order.iMonthYearId + ""
						$scope.tmpDate1 = order.iMonthYearId.substring(0, 4);
						$scope.tmpDate2 = order.iMonthYearId.substring(4, 6);
						$scope.tmpDate = $scope.tmpDate2 + '/' + $scope.tmpDate1;
						order.iMonthYearId = $scope.tmpDate;
					})
					});
			
		
		};

	    $scope.EditCust = function () {
	        $scope.editCustomer = true;
	        $rootScope.$broadcast('displayDialog', { id: 'newMember' });
	    }

	    $scope.exportToExcel = function () {
			$scope.$broadcast('exportToExcel', {
				fileName: 'הזמנות',
	            id: $scope.gridIdentity
	            
	        });
	    };

	    $rootScope.$on('deleteList', function () {
	        $scope.listToSend = [];
	        $scope.haveSend = false
	    });

	    $scope.prepareData();

	    $scope.addNewOrder = function () {
	        $scope.isEdit = false;
	        $scope.name = "אלפון";
	        $scope.newOrder.dialogIsOpen = true;
	        $rootScope.$broadcast('displayDialog', { id: 'newOrder' });
		}

		$scope.refresh = function ()
		{
			$scope.OrdersList.forEach(function (order) {
				order.iMonthYearId = order.iMonthYearId + ""
				$scope.tmpDate1 = order.iMonthYearId.substring(0, 4);
				$scope.tmpDate2 = order.iMonthYearId.substring(4, 6);
				$scope.tmpDate = $scope.tmpDate2 + '/' + $scope.tmpDate1;
				order.iMonthYearId = $scope.tmpDate;
			})
		}

	    $scope.deleteOrder = function (item) {
	        $rootScope.delete = true;
	        connect.post(true, "DeleteOrder", { 'iOrderId': item.iOrderId }, function (result) {
				if (result) {
					var index = $scope.OrdersList.indexOf(item);
					$scope.OrdersList.splice(index, 1);
					$scope.isDataLoaded++;
	            } else {
	                alert('error!');
	            }
	        });
	    }

	}]);