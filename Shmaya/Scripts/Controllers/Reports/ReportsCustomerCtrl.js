"use strict"
companionApp.controller('ReportsCustomerCtrl', ['$scope', '$rootScope', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'codeTablesId','alerts',
	function ($scope, $rootScope, connect, $location, $filter, $timeout, codeTablesName, codeTablesId, alerts) {
		$scope.isPrepareData = true;
		$scope.isPrepareData2 = true;
		$scope.isPrepareData3 = true;

		$scope.prepareData = function () {
			$scope.getData();
			if ($scope.isPrepareData == true)
			{
				$scope.isDataLoaded1 = 0;
				$scope.gridIdentity1 = 'ReportsList1';
				$scope.columns1 = [

					{ title: 'שם פרטי', fieldName: 'nvFirstName' },
					{ title: 'שם משפחה', fieldName: 'nvLastName' },
					{ title: 'מ.ז.', fieldName: 'nvId' },
					{ title: 'סוג שעה', fieldName: 'nvTypeOrder' },
					{ title: 'מספר שעות', fieldName: 'nBankHours' }
				];
			}
		};


		$scope.prepareData2 = function () {
			$scope.getData2();
			if ($scope.isPrepareData2 == true)
			{
				$scope.isDataLoaded2 = 0;
				$scope.gridIdentity2 = 'ReportsList2';
				$scope.columns2 = [

					{ title: 'שם פרטי', fieldName: 'nvFirstName' },
					{ title: 'שם משפחה', fieldName: 'nvLastName' },
					{ title: 'מ.ז.', fieldName: 'nvId' },
					{ title: 'סוג שעה', fieldName: 'nvTypeOrder' },
					{ title: 'מספר שעות', fieldName: 'nBankHours' }
				];
			}
		};

		$scope.prepareData3 = function () {
			$scope.getData3();
			if ($scope.isPrepareData3 == true)
			{
				$scope.isDataLoaded3 = 0;
				$scope.gridIdentity3 = 'ReportsList2';
				$scope.columns3 = [

					{ title: 'שם פרטי', fieldName: 'nvFirstName' },
					{ title: 'שם משפחה', fieldName: 'nvLastName' },
					{ title: 'מ.ז.', fieldName: 'nvId' },
					{ title: 'סוג שעה', fieldName: 'nvTypeOrder' },
					{ title: 'מספר שעות', fieldName: 'nBankHours' }
				];
			}
		};

		$scope.getData = function () {
			connect.post(true, 'GetReportsCustomer', { iMonthYearId: $scope.iMonthYearId, iTypeOrder: 22 },
				function (result) {
					if (result.length == 0)
					{
						$scope.isPrepareData = false;
						alerts.alert('אין נתונים להצגה בדוח תרגום');
						return;
					}
					$scope.ReportsList1 = result;
					$scope.isDataLoaded1++;
				});
		};

		$scope.getData2 = function () {
			connect.post(true, 'GetReportsCustomer', { iMonthYearId: $scope.iMonthYearId, iTypeOrder: 23 },
				function (result) {
					if (result.length == 0) {
						$scope.isPrepareData2 = false;
						alerts.alert('אין נתונים להצגה בדוח תמלול');
						return;
					}
					$scope.ReportsList2 = result;
					$scope.isDataLoaded2++;
				});
		};

		$scope.getData3 = function () {
			connect.post(true, 'GetReportsCustomer', { iMonthYearId: $scope.iMonthYearId, iTypeOrder: 24 },
				function (result) {
					if (result.length == 0) {
						$scope.isPrepareData3 = false;
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