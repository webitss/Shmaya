'use strict'
companionApp.controller('PdfToProvidersCtrl', ['$scope', '$rootScope', '$timeout', 'connect', '$filter', '$location', 'codeTablesName', 'tablesId', 'alerts', 'codeTablesId', '$routeParams',
	function ($scope, $rootScope, $timeout, connect, $filter, $location, codeTablesName, tablesId, alerts, codeTablesId, $routeParams) {

		$scope.prepareData = function () {
			$scope.UserId = parseInt($location.search().iUserId);
			$scope.dateBegin = new Date($location.search().dtDateBegin);
			$scope.dateEnd = new Date($location.search().dtDateEnd);
			$scope.isDataLoaded = 0;
			$scope.gridIdentity = 'OrdersList';
			$scope.columns = [
				{ title: 'מספר הזמנה', fieldName: 'iOrderId' },
				{ title: 'שם לקוח', fieldName: 'nameCustomer' },
				{ title: 'שם מתורגמן', fieldName: 'nameTranslator' },
				{ title: 'סוג הזמנה', fieldName: 'typeOrder' },
				{ title: 'סוג תרגום', fieldName: 'typeTranslation' },
				{ title: 'איזור', fieldName: 'area' },
				{ title: 'כתובת', fieldName: 'nvStreet' },
				{ title: 'תאריך תרגום', fieldName: 'dtDateTraslation', type: 'date' },
				{ title: 'שיוך לחודש', fieldName: 'nvMonthName' },
				{ title: 'זמן תרגום', fieldName: 'dtTimeTranslation', type: 'time' },
				{ title: 'שעת התחלה', fieldName: 'dtTimeBegin', type: 'time' },
				{ title: 'משתמש מזין', fieldName: 'nvCreateUserId' }
			];

			$scope.isDataLoaded2 = 0;
			$scope.gridIdentity2 = 'CustomersList';
			$scope.columns2 = [
				{ title: 'שם פרטי', fieldName: 'nvFirstName' },
				{ title: 'שם משפחה', fieldName: 'nvLastName' },
				{ title: 'ת.ז.', fieldName: 'nvId' },
				{ title: 'כתובת', fieldName: 'nvAdress' },
				{ title: 'טלפון', fieldName: 'nvPhoneNum' },
				{ title: 'טלפון נייד', fieldName: 'nvMobileNum' },
				{ title: 'מייל', fieldName: 'nvEmail' },
				{ title: 'סוג זכאות', fieldName: 'nvEntitlementType', weight: 0.8 },
				{ title: 'בנק שעות', fieldName: 'nBankHours' }
			];

			$scope.getData1();
			$scope.getData2();
			$scope.getData3();


		};
		$scope.getData1 = function () {
			connect.post(true, 'GetOrdersByStatus', {iStatusId:26},
				function (result) {
					$scope.OrdersList = result;
					$scope.isDataLoaded++;
				});
		};

		$scope.getData2 = function () {
			connect.post(true, 'GetUsers', { iUserType: 2 },
				function (result) {
					$scope.CustomersList = result;
					$scope.isDataLoaded2++;
				});
		};
		$scope.getData3 = function () {
			connect.post(true, 'GetMessageToProvider', { iUserId: $scope.UserId, dtBeginDate: $scope.dateBegin, dtEndDate: $scope.dateEnd },
				function (result) {
					$scope.CustomersList = result;
					$scope.isDataLoaded2++;
				});
		};
		$scope.prepareData();

	}]);




