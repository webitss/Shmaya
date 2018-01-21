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
				});
	    };
	    $scope.prepareData();
	}]);