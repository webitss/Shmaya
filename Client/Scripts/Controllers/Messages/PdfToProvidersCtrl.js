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
				{ title: 'שם לקוח', fieldName: 'nameCustomer' },
				{ title: 'שם מתורגמן', fieldName: 'nameTranslator' },
				{ title: 'סוג הזמנה', fieldName: 'typeOrder' },
				{ title: 'סוג תרגום', fieldName: 'typeTranslation' },
				{ title: 'תאריך תרגום', fieldName: 'dtDateTraslation', type: 'date' },
				{ title: 'זמן תרגום', fieldName: 'dtTimeTranslation', type: 'time' }],

			$scope.isDataLoaded2 = 0;
			$scope.gridIdentity2 = 'CustomersList';
			$scope.columns2 = [
				{ title: 'זמן תרגום', fieldName: 'dtTimeTranslation' ,type:'time'},
				{ title: 'סה"כ לתשלום', fieldName: 'nSumPayment' },
				{ title: 'תשלום שעה ראשונה', fieldName: 'nTariffToFirst' },
				{ title: 'תשלום שעה שניה', fieldName: 'nTariffToSecond' }
			];

			$scope.getData1();
			$scope.getData2();


		};
		$scope.getData1 = function () {
			connect.post(true, 'GetOrdersByStatus', { iUserId: $scope.UserId},
				function (result) {
					$scope.OrdersList = result;
					$scope.isDataLoaded++;
				});
		};
		$scope.getData2 = function () {
			connect.post(true, 'GetMessageToProvider', { iUserId: $scope.UserId, dtBeginDate: $scope.dateBegin, dtEndDate: $scope.dateEnd },
				function (result) {
					$scope.CustomersList = result;
					$scope.isDataLoaded2++;
				});
		};
		$scope.prepareData();

	}]);




