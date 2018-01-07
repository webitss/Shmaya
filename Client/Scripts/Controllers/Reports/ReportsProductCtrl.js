"use strict"
companionApp.controller('ReportsProductCtrl', ['$scope', '$rootScope', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'codeTablesId',
	function ($scope, $rootScope, connect, $location, $filter, $timeout, codeTablesName, codeTablesId) {
	

		$scope.prepareData = function () {

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

			$scope.getData();

		};

		$scope.prepareData2 = function () {
			$scope.$broadcast('show-errors-check-validity');
			if (!$scope.formReport3.$valid) {
				var savingStatus = "ישנם למלא ערכים תקינים בכל השדות";
				$rootScope.notification(savingStatus);
				return;
			}
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

			$scope.getData2();

		};


		$scope.getData = function () {
			connect.post(true, 'GetReportsProduct', { iMonthId: $scope.iMonthId },
				function (result) {
					$scope.ReportsList1 = result;
					$scope.isDataLoaded1++;
				});
		}
			$scope.getData2 = function () {
				connect.post(true, 'GetReportscryingDetector', { iMonthId: $scope.iMonthId },
					function (result) {
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
			if (!$scope.formReport1.$valid) {
				var savingStatus = "ישנם למלא ערכים תקינים בכל השדות";
				$rootScope.notification(savingStatus);
				return;
			}
			$scope.exportToExcel()
		}

	


	}])