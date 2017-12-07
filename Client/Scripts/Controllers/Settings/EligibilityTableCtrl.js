﻿"use strict"
companionApp.controller('EligibilityTableCtrl', ['$scope', '$rootScope', 'connect', '$timeout', '$filter', 'alerts', 'createDialog', '$uibModal', 'codeTablesId',
	function ($scope, $rootScope, connect, $timeout, $filter, alerts, createDialog, $uibModal, codeTablesId) {
		$scope.prepareData = function () {
			$scope.getData();
			$scope.isDataLoaded = 0;
			$scope.gridIdentity = 'EligibilityTableList';
			$scope.columns =
				[
					{
					fieldName: 'iCommunicationCart',
						title: 'עריכה',
						template: '<div class="pass user-class glyphicon glyphicon-pencil"  ng-click="col.clickEvent(item)"></div>',
						clickEvent: function (product) {
							$scope.pop = "<label>סוג שעה</label><input type='text' class='form-control' required ng-model='setting.nvEntry' required/>" +
								"<label>מחיר לשעה</label><input type='text' class='form-control' required ng-model='setting.nvEntry' required/>";
							alerts.custom($scope.pop, 'הוספת ערך', $scope,
								function () {
									$scope.changeEntry($scope, $scope.setting.nvEntry, false);
								}, function () { }

							);
						},
						weight: 0.5,
						filter: false,
						sort: false
					},
					{ title: 'סוג זכאות', fieldName: 'nvEntitlementType' },
					{ title: 'מספר שעות זכאות', fieldName: 'nNumHours' }
				];
		};

		$scope.getData = function () {
			connect.post(true, 'GetEligibiltyTable', {},
				function (result) {
					$scope.EligibilityTableList = result;
					$scope.isDataLoaded++;
				});
		}

		$scope.prepareData();
	}]);