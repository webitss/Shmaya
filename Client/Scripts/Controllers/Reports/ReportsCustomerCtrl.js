"use strict"
companionApp.controller('ReportsCustomerCtrl', ['$scope', '$rootScope', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'codeTablesId','alerts',
	function ($scope, $rootScope, connect, $location, $filter, $timeout, codeTablesName, codeTablesId, alerts) {


		$scope.prepareData = function () {
			$scope.isDataLoaded1 = 0;
			$scope.gridIdentity1 = 'ReportsList1';
			$scope.columns1 = [

				{ title: 'שם פרטי', fieldName: 'nvFirstName' },
				{ title: 'שם משפחה', fieldName: 'nvLastName' },
				{ title: 'מ.ז.', fieldName: 'nvId' },
				{ title: 'סוג שעה', fieldName: 'nvTypeOrder' },
				{ title: 'מספר שעות', fieldName: 'nNumHours' }
			];
			$scope.getData();
		};


		$scope.prepareData2 = function () {
			$scope.isDataLoaded2 = 0;
			$scope.gridIdentity2 = 'ReportsList2';
			$scope.columns2 = [

				{ title: 'שם פרטי', fieldName: 'nvFirstName' },
				{ title: 'שם משפחה', fieldName: 'nvLastName' },
				{ title: 'מ.ז.', fieldName: 'nvId' },
				{ title: 'סוג שעה', fieldName: 'nvTypeOrder' },
				{ title: 'מספר שעות', fieldName: 'nNumHours' }
			];
			$scope.getData2();
		};

		$scope.prepareData3 = function () {
			$scope.isDataLoaded3 = 0;
			$scope.gridIdentity3 = 'ReportsList2';
			$scope.columns3 = [

				{ title: 'שם פרטי', fieldName: 'nvFirstName' },
				{ title: 'שם משפחה', fieldName: 'nvLastName' },
				{ title: 'מ.ז.', fieldName: 'nvId' },
				{ title: 'סוג שעה', fieldName: 'nvTypeOrder' },
				{ title: 'מספר שעות', fieldName: 'nNumHours' }
			];
			$scope.getData3();
		};

		$scope.getData = function () {
			connect.post(true, 'GetReportsCustomer', { iMonthId: $scope.iMonthId, iTypeOrder: 22 },
				function (result) {
					if (result.length == 0)
					{
						alerts.alert('אין נתונים להצגה בדוח תרגום');
						return;
					}
					$scope.ReportsList1 = result;
					$scope.isDataLoaded1++;
				});
		};

		$scope.getData2 = function () {
			connect.post(true, 'GetReportsCustomer', { iMonthId: $scope.iMonthId, iTypeOrder: 23 },
				function (result) {
					if (result.length == 0) {
						alerts.alert('אין נתונים להצגה בדוח תמלול');
						return;
					}
					$scope.ReportsList2 = result;
					$scope.isDataLoaded2++;
				});
		};

		$scope.getData3 = function () {
			connect.post(true, 'GetReportsCustomer', { iMonthId: $scope.iMonthId, iTypeOrder: 24 },
				function (result) {
					if (result.length == 0) {
						alerts.alert('אין נתונים להצגה בדוח שעתוק');
						return;
					}
					$scope.ReportsList3 = result;
					$scope.isDataLoaded3++;
				});
		};

		$scope.exportToExcel = function () {
			$scope.$broadcast('exportToExcel',
				{
					id: $scope.gridIdentity1,
					fileName: 'דוח מקבלי שירות'
				})

		}


		$scope.checkValidation = function () {
			$scope.$broadcast('show-errors-check-validity');
			if (!$scope.formReport2.$valid) {
				alerts.alert('יש לבחור חודש!', 'שגיאה');
				return;
			}
			$scope.exportToExcel()
		}


		


	}])