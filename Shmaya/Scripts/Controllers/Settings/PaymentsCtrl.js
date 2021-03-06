﻿"use strict"
companionApp.controller('PaymentsCtrl', ['$scope', '$rootScope', 'connect', '$timeout', '$filter', 'alerts', 'createDialog', '$uibModal', 'codeTablesId',
	function ($scope, $rootScope, connect, $timeout, $filter, alerts, createDialog, $uibModal, codeTablesId) {
		$scope.newPayment = {};
		$scope.prepareData = function () {
			$scope.getData();
			$scope.isDataLoaded = 0;
			$scope.gridIdentity = 'paymentsList';
			$scope.columns =
				[
					{
					fieldName: 'iPaymentId',
						title: 'עריכה',
						template: '<div class="pass user-class glyphicon glyphicon-pencil"  ng-click="col.clickEvent(item)"></div>',
						clickEvent: function (payment) {
						    if (payment.item == undefined) return;
							$scope.payment2 = payment.item;
							$scope.pop = "<label>סוג שעה</label><input type='text' class='form-control' required ng-model='payment2.nvPaymentType' required/>" +
								"<label>מחיר לשעה</label><input type='text' class='form-control' required ng-model='payment2.nTariff' required/>";
							alerts.custom($scope.pop, 'הוספת ערך', $scope,
								function () {
									if (!$scope.payment2.nvPaymentType || !$scope.payment2.nTariff) {
										createDialog({
											id: 'eligibility2',
											template: "<div><span>חסרים שדות חובה</span><button  ng-click='$modalCancel()' class='btn  pass color-grn btn-ayelet pull-left'><span> אישור</span></button>" + "</div>",
											title: "שגיאה",
											scope: $rootScope,
											backdrop: true,
											css: 'z-index: 2500;',
											modalClass: "modal modalAlert"
										});
										return false;
									}
									connect.post(true, 'PaymentUpdate', { payment: $scope.payment2, iUserManagerId: $rootScope.user.iUserId }, function (result) {
											if (result && result > 0) {
												console.log('PaymentUpdate:' + result);
												$scope.user.dialogIsOpen = false;
											}
											else {
												alert('ארעה שגיאה בלתי צפויה');
											}
										});
								}, function () {
								    $scope.getData();
								}

							);
						},
						weight: 0.5,
						filter: false,
						sort: false
					},
					{ title: 'סוג שעה', fieldName: 'nvPaymentType' },
					{ title: 'מחיר לשעה', fieldName: 'nTariff' }
				];
		};

		$scope.getData = function () {
			connect.post(true, 'GetPayments', {},
				function (result) {
					$scope.paymentsList = result;
					$scope.isDataLoaded++;
				});
		}

		$scope.AddNewPayment = function () {
			$scope.pop = "<label>סוג שעה</label><input type='text' class='form-control' required ng-model='newPayment.nvPaymentType' required/>" +
				"<label>מחיר לשעה</label><input type='text' class='form-control' required ng-model='newPayment.nTariff' required/>";
			alerts.custom($scope.pop, 'הוספת ערך', $scope,
				function () {
					if (!$scope.newPayment.nvPaymentType || !$scope.newPayment.nTariff) {
						createDialog({
							id: 'eligibility2',
							template: "<div><span>חסרים שדות חובה</span><button  ng-click='$modalCancel()' class='btn  pass color-grn btn-ayelet pull-left'><span> אישור</span></button>" + "</div>",
							title: "שגיאה",
							scope: $rootScope,
							backdrop: true,
							css: 'z-index: 2500;',
							modalClass: "modal modalAlert"
						});
						return false;
					}
					connect.post(true, 'PaymentInsert', { payment: $scope.newPayment, iUserManagerId: $rootScope.user.iUserId }, function (result) {
						if (result && result > 0) {
							console.log('PaymentInsert:' + result);
							$scope.newPayment = {};
							$scope.getData();
						}
						else {
							alert('ארעה שגיאה בלתי צפויה');
						}
					});
				}, function () {
				    $scope.getData();
				}

			);
		}
		$scope.exportToExcel = function () {
			$scope.$broadcast('exportToExcel', {
				id: $scope.gridIdentity,
				fileName: 'תשלומים'
			});
		};


		$scope.prepareData();
	}]);