"use strict"
companionApp.controller('ReportsCtrl', ['$scope', '$rootScope', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'codeTablesId','alerts',
	function ($scope, $rootScope, connect, $location, $filter, $timeout, codeTablesName, codeTablesId, alerts) {
		$scope.isPrepareData = true;
		$scope.isPrepareData2 = true;
		$scope.isPrepareData3 = true;

		$scope.prepareData = function () {
			if ($scope.isPrepareData = true)
			{

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
			}
		};


		$scope.prepareData2 = function () {
			if ($scope.isPrepareData2 = true)
			{
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
			}
		};



		$scope.prepareData3 = function () {
			if ($scope.isPrepareData3 = true)
			{
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
			}
		};


		$scope.getData = function ()
		{
			connect.post(true, 'GetReports', { iMonthYearId: $scope.iMonthYearId, iTypeOrder:22 },
				function (result)
				{
					if (result.length == 0)
					{
						$scope.isPrepareData = false;
						alerts.alert('אין נתונים להצגה בדוח מתרגמים');
						return;
					}
					$scope.ReportsList1 = result;
					$scope.isDataLoaded1++;
				
				});
			
		};

		$scope.getData2 = function () {
			connect.post(true, 'GetReports', { iMonthYearId: $scope.iMonthYearId, iTypeOrder: 23 },
				function (result)
				{
					if (result.length == 0) {
						$scope.isPrepareData2 = false;
						alerts.alert('אין נתונים להצגה בדוח מתמללים')
						return
					}
					$scope.ReportsList2 = result;
					$scope.isDataLoaded2++;

				});

		};

		$scope.getData3 = function () {
			connect.post(true, 'GetReports', { iMonthYearId: $scope.iMonthYearId, iTypeOrder: 24 },
				function (result) {
					if (result.length == 0) {
						$scope.isPrepareData3 = false;
						alerts.alert('אין נתונים להצגה בדוח משעתקים')
						return
					}
					$scope.ReportsList3 = result;
					$scope.isDataLoaded3++;

				});

		};

		$scope.exportToExcel = function ()
		{
			$scope.$broadcast('exportToExcel',
				{
					id: $scope.gridIdentity1,
					fileName: 'דוח נותני שירות'
				})
	
		}



		$scope.checkValidation = function ()
		{
			$scope.$broadcast('show-errors-check-validity');
			if (!$scope.formReport1.$valid)
			{
				alerts.alert('יש לבחור חודש!', 'שגיאה');
				return;
			}
			$scope.exportToExcel()
		}

	
		

	}])