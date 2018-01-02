"use strict"
companionApp.controller('ReportsProductCtrl', ['$scope', '$rootScope', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'codeTablesId',
	function ($scope, $rootScope, connect, $location, $filter, $timeout, codeTablesName, codeTablesId) {

		$scope.prepareData = function () {
			$scope.$broadcast('show-errors-check-validity');
			if (!$scope.formReport3.$valid)
			{
				var savingStatus = "ישנם למלא ערכים תקינים בכל השדות";
				$rootScope.notification(savingStatus);
				return;
			}
			$scope.isDataLoaded_prod1 = 0;
			$scope.gridIdentity_prod1 = 'ReportsList_prod1';
			$scope.columns_prod1 = [

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

			$scope.isDataLoaded_prod2 = 0;
			$scope.gridIdentity_prod2 = 'ReportsList_prod2';
			$scope.columns_prod2 = [

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
			$scope.exportToExcel();

		};
		$scope.getData = function () {
			connect.post(true, 'GetReportsProduct', { iMonthId: $scope.iMonthId},
				function (result) {
					$scope.ReportsList_prod1 = result;
					$scope.isDataLoaded_prod1++;
					connect.post(true, 'GetReportscryingDetector', { iMonthId: $scope.iMonthId },
						function (result) {
							$scope.ReportsList_prod2 = result;
							$scope.isDataLoaded_prod2++;
						});

				});



		};


		$scope.exportToExcel = function ()
		{
			$scope.$broadcast('exportToExcel',
				{
					id: $scope.gridIdentity1,
					fileName: 'דוח מוצרים'
				}),
				$scope.$broadcast('exportToExcel',
					{
						id: $scope.gridIdentity2,
						fileName: 'דוח גלאי בכי'
					})
			

			}

	


	}])