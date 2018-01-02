"use strict"
companionApp.controller('ReportsCustomerCtrl', ['$scope', '$rootScope', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'codeTablesId',
	function ($scope, $rootScope, connect, $location, $filter, $timeout, codeTablesName, codeTablesId) {


		$scope.prepareData = function () {
			$scope.$broadcast('show-errors-check-validity');
			if (!$scope.formReport2.$valid) {
				var savingStatus = "ישנם למלא ערכים תקינים בכל השדות";
				$rootScope.notification(savingStatus);
				return;
			}
			$scope.isDataLoaded1 = 0;
			$scope.gridIdentity1 = 'ReportsList1';
			$scope.columns1 = [

				{ title: 'שם פרטי', fieldName: 'nvFirstName' },
				{ title: 'שם משפחה', fieldName: 'nvLastName' },
				{ title: 'מ.ז.', fieldName: 'nvId' },
				{ title: 'סוג שעה', fieldName: 'nvTypeOrder' },
				{ title: 'מספר שעות', fieldName: 'nNumHours' }
			];

			$scope.isDataLoaded2 = 0;
			$scope.gridIdentity2 = 'ReportsList2';
			$scope.columns2 = [

				{ title: 'שם פרטי', fieldName: 'nvFirstName' },
				{ title: 'שם משפחה', fieldName: 'nvLastName' },
				{ title: 'מ.ז.', fieldName: 'nvId' },
				{ title: 'סוג שעה', fieldName: 'nvTypeOrder' },
				{ title: 'מספר שעות', fieldName: 'nNumHours' }
			];

			$scope.isDataLoaded3 = 0;
			$scope.gridIdentity3 = 'ReportsList1';
			$scope.columns3 = [

				{ title: 'שם פרטי', fieldName: 'nvFirstName' },
				{ title: 'שם משפחה', fieldName: 'nvLastName' },
				{ title: 'מ.ז.', fieldName: 'nvId' },
				{ title: 'סוג שעה', fieldName: 'nvTypeOrder' },
				{ title: 'מספר שעות', fieldName: 'nNumHours' }
			];
			$scope.getData();
			$scope.exportToExcel();


		};
		$scope.getData = function () {
			connect.post(true, 'GetReportsCustomer', { iMonthId: $scope.iMonthId, iTypeOrder: 22 },
				function (result) {
					$scope.ReportsList1 = result;
					$scope.isDataLoaded1++;
					connect.post(true, 'GetReportsCustomer', { iMonthId: $scope.iMonthId, iTypeOrder: 23 },
						function (result) {
							$scope.ReportsList2 = result;
							$scope.isDataLoaded2++;
							connect.post(true, 'GetReportsCustomer', { iMonthId: $scope.iMonthId, iTypeOrder: 24 },
								function (result) {
									$scope.ReportsList3 = result;
									$scope.isDataLoaded3++;
								});
						});

				});



		};

		$scope.exportToExcel = function () {
			$scope.$broadcast('exportToExcel',
				{
					id: $scope.gridIdentity1,
					fileName: 'דוח מתרגמים'
				}),
				$scope.$broadcast('exportToExcel',
					{
						id: $scope.gridIdentity2,
						fileName: 'דוח מתמללים'
					}),
					$scope.$broadcast('exportToExcel', {
						id: $scope.gridIdentity3,
						fileName: 'דוח משעתקים'
					})

			}

		//$scope.exportToExcel = function () {
		//	$scope.$broadcast('exportToExcel',
		//		{
		//			id: $scope.gridIdentity1,
		//			fileName: 'דוח מתרגמים',
		//			id: $scope.gridIdentity2,
		//			fileName: 'דוח מתמללים',
		//			id: $scope.gridIdentity3,
		//			fileName: 'דוח משעתקים'
		//		})

		}


	}])