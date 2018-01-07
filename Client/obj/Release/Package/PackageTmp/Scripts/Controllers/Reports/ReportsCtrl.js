"use strict"
companionApp.controller('ReportsCtrl', ['$scope', '$rootScope', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'codeTablesId',
	function ($scope, $rootScope, connect, $location, $filter, $timeout, codeTablesName, codeTablesId) {

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


		$scope.getData = function ()
		{
			connect.post(true, 'GetReports', { iMonthId: $scope.iMonthId, iTypeOrder:22 },
				function (result)
				{
					$scope.ReportsList1 = result;
					$scope.isDataLoaded1++;
				
				});
			
		};

		$scope.getData2 = function () {
			connect.post(true, 'GetReports', { iMonthId: $scope.iMonthId, iTypeOrder: 23 },
				function (result) {
					$scope.ReportsList2 = result;
					$scope.isDataLoaded2++;

				});

		};

		$scope.getData3 = function () {
			connect.post(true, 'GetReports', { iMonthId: $scope.iMonthId, iTypeOrder: 24 },
				function (result) {
					$scope.ReportsList3 = result;
					$scope.isDataLoaded3++;

				});

		};

		$scope.exportToExcel = function () {
			$scope.$broadcast('exportToExcel',
				{
					id: $scope.gridIdentity1,
					fileName: 'דוח נותני שירות'
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