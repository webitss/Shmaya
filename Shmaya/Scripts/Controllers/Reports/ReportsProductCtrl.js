﻿"use strict"
companionApp.controller('ReportsProductCtrl', ['$scope', '$rootScope', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'codeTablesId','alerts',
	function ($scope, $rootScope, connect, $location, $filter, $timeout, codeTablesName, codeTablesId, alerts) {
		$scope.isPrepareData = true;
		$scope.isPrepareData2 = true;
		$scope.prepareData = function () {
			$scope.getData();
			if ($scope.isPrepareData == true )
			{
				$scope.isDataLoaded1 = 0;
				$scope.gridIdentity1 = 'ReportsList1';
				$scope.columns1 = [

					{ title: 'שם פרטי', fieldName: 'nvFirstName' },
					{ title: 'שם משפחה', fieldName: 'nvLastName' },
					{ title: 'מ.ז.', fieldName: 'nvId' },
					{ title: 'מגדר', fieldName: 'nvGender' },
					{ title: 'נייד', fieldName: 'nvMobileNum' },
					{ title: 'שם מוצר', fieldName: 'nvPruductName' },
					{ title: 'תאריך רכישה', fieldName: 'dtPurchase' },
					{ title: 'סכום לתשלום', fieldName: 'nPayment' },
					{ title: 'סך החזר', fieldName: 'nRefund' },
					{ title: 'תאריך הזנה', fieldName: 'dtCreateDate' }
				];

			}
			else
				$scope.isPrepareData = true;

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
					{ title: 'מגדר', fieldName: 'nvGender' },
					{ title: 'נייד', fieldName: 'nvMobileNum' },
					{ title: 'שם מוצר', fieldName: 'nvPruductName' },
					{ title: 'תאריך רכישה', fieldName: 'dtPurchase' },
					{ title: 'סכום לתשלום', fieldName: 'nPayment' },
					{ title: 'סך החזר', fieldName: 'nRefund' },
					{ title: 'תאריך הזנה', fieldName: 'dtCreateDate' }
				];

			}
			else
				$scope.isPrepareData2 = true;

		};

		$scope.getData = function () {
			connect.post(true, 'GetReportsProduct', { iMonthYearId: $scope.iMonthYearId },
				function (result) {
					if (result.length == 0) {
						$scope.isPrepareData = false;
						alerts.alert('אין נתונים להצגה בדוח מוצרים');
						return;
					}
					$scope.ReportsList1 = result;
					$scope.isDataLoaded1++;
				});
		}
			$scope.getData2 = function () {
				connect.post(true, 'GetReportscryingDetector', { iMonthYearId: $scope.iMonthYearId },
					function (result) {
						if (result.length == 0) {
							$scope.isPrepareData2 = false;
							alerts.alert('אין נתונים להצגה בדוח גלאי בכי');
							return;
						}
						$scope.ReportsList2 = result;
						$scope.isDataLoaded2++;
					});
		};

		$scope.exportToExcel = function ()
		{
			$scope.$broadcast('exportToExcel',
				{
					id: $scope.gridIdentity1,
					fileName: 'דוח מוצרים'
				})
			}


		$scope.checkValidation = function () {
			$scope.$broadcast('show-errors-check-validity');
			if (!$scope.formReport3.$valid) {
				alerts.alert('יש לבחור חודש!', 'שגיאה');
				return;
			}
			$scope.exportToExcel()
		}

	


	}])