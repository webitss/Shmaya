'use strict'
companionApp.controller('OrdersCtrl', ['$scope', '$rootScope', '$timeout', 'connect', '$filter', '$location', 'codeTablesName', 'tablesId', 'alerts', 'codeTablesId',
	function ($scope, $rootScope, $timeout, connect, $filter, $location, codeTablesName, tablesId, alerts, codeTablesId) {
	    $scope.isEdit = false;

	    $scope.hello = function () {
	        alert("hello");
	    }

	    $scope.prepareData = function () {
	        $scope.isDataLoaded = 0;
	        $scope.gridIdentity = 'OrdersList';
	        $scope.newOrder = { dialogIsOpen: false };
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
					title: 'ביטול',
				    fieldName: 'iOrderId',
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
					title: 'סטטוס',
					fieldName: 'iStatusId',
					type: 'select',
					search: true,
					searchField:'status',
					filter: true,
					data: $scope.statusList,
					onChange: function (item) {
						console.log(item .status);
						connect.post(true, 'ChangeStatus', { iStatusId: item.iStatusId, iOrderId: item.iOrderId },
				        	function (result) {
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
				{ title: 'עיר', fieldName: 'nvStreet' },
				{ title: 'תאריך תרגום', fieldName: 'dtDateTraslation', type: 'date' },
				{ title: 'שיוך לחודש ושנה', fieldName: 'iMonthYearId' },
				{
				    title: 'זמן תרגום', fieldName: 'nvTimeTranslation', doSum: true, weight: 1.2
				},
				{ title: 'שעת התחלה', fieldName: 'dtTimeBegin', type: 'time' },
				{ title: 'משתמש מזין', fieldName: 'nvCreateUserId' },
	        ];
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
	        $scope.newOrder.dialogIsOpen = true;
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