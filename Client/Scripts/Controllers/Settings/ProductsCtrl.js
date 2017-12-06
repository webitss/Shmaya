"use strict"
companionApp.controller('ProductsCtrl', ['$scope', '$rootScope', 'connect', '$timeout', '$filter', 'alerts', 'createDialog', '$uibModal', 'codeTablesId',
	function ($scope, $rootScope, connect, $timeout, $filter, alerts, createDialog, $uibModal, codeTablesId) {

		$scope.prepareData = function () {
			$scope.getData();
			$scope.isDataLoaded = 0;
			$scope.gridIdentity = 'productsList';
			$scope.columns =
				[
					{
						fieldName: 'iProductId',
						title: 'עריכה',
						template: '<div class="pass user-class glyphicon glyphicon-pencil"  ng-click="col.clickEvent(item)"></div>',
						clickEvent: function (product) {
							$scope.pop = "<label>סוג מוצר</label><input type='text' class='form-control' required ng-model='setting.nvEntry' required/>" +
								"<label>שם מוצר</label><input type='text' class='form-control' required ng-model='setting.nvEntry' required/>";
							alerts.custom($scope.pop, 'הוספת מוצר', $scope,
								function () {
									$scope.changeEntry($scope, $scope.setting.nvEntry, false);
								}, function () { }

							);
						},
						weight: 0.5,
						filter: false,
						sort: false
					},
					{ title: 'סוג מוצר', fieldName: 'nvProductTypeId' },
					{ title: 'שם מוצר', fieldName: 'nvPruductName' }
				];
		};

		$scope.getData = function () {
			connect.post(true, 'GetProduct', {},
				function (result) {
					$scope.productsList = result;
					$scope.isDataLoaded++;
				});
		}

		$scope.prepareData();
	}]);