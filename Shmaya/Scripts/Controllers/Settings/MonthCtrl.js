﻿"use strict"
companionApp.controller('MonthCtrl', ['$scope', '$rootScope', 'connect', '$timeout', '$filter', 'alerts', 'createDialog', '$uibModal', 'codeTablesId',
	function ($scope, $rootScope, connect, $timeout, $filter, alerts, createDialog, $uibModal, codeTablesId, ) {
		$scope.newMonth = {};
		$scope.prepareData = function ()
		{
			$scope.getData();
			$scope.isDataLoaded = 0;
			$scope.gridIdentity = 'monthesList';
			$scope.columns =
				[
					{
						fieldName: 'iPaymentId',
						title: 'עריכה',
						template: '<div class="pass user-class glyphicon glyphicon-pencil"  ng-click="col.clickEvent(item)"></div>',
						clickEvent: function (month)
						{
							if (month.item == undefined) return;
							$scope.month2 = month.item;
							$scope.pop = "<label> חודש ושנה</label><input type='text' class='form-control' required ng-model='month2.iMonthYearId' disabled/>" +
								"<label>מתאריך</label><input type='date' class='form-control' required ng-model='month2.dtGlobalDateBegin_original' required/>" +
								"<label>עד תאריך</label><input type='date' class='form-control' required ng-model='month2.dtGlobalDateEnd_original' required/>";
							alerts.custom($scope.pop, 'עריכת הגדרה', $scope,
								function () {
									$scope.month2.dtGlobalDateBegin = angular.copy($scope.month2.dtGlobalDateBegin_original)
									$scope.month2.dtGlobalDateEnd = angular.copy($scope.month2.dtGlobalDateEnd_original)
									if (!$scope.month2.iMonthYearId || !$scope.month2.dtGlobalDateBegin || !$scope.month2.dtGlobalDateEnd) {
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
									$scope.monthToSend = angular.copy($scope.month2);
									$scope.monthToSend.dtGlobalDateBegin = angular.copy($scope.month2.dtGlobalDateBegin_original);
									$scope.monthToSend.dtGlobalDateEnd = angular.copy($scope.month2.dtGlobalDateEnd_original);
									$scope.tmpDate2 = $scope.monthToSend.iMonthYearId.substring(0, 2);
									$scope.tmpDate1 = $scope.monthToSend.iMonthYearId.substring(3, 7);
									$scope.tmpDate = parseInt($scope.tmpDate1) * 100 + parseInt($scope.tmpDate2)
									$scope.monthToSend.iMonthYearId = $scope.tmpDate
									connect.post(true, 'MonthUpdate', { month: $scope.monthToSend, iUserManagerId: $rootScope.user.iUserId }, function (result)
									{
										if (result && result > 0)
										{
											console.log('MonthUpdate:' + result);
											$scope.getData();
										}
										else
										{
											alert('ארעה שגיאה בלתי צפויה');
										}
									});
								}, function () {
								    $scope.month2 = [];
								    $scope.getData();
								}

							);
						},
						weight: 0.5,
						filter: false,
						sort: false
					},
					{ title: 'חודש ושנה', fieldName: 'iMonthYearId' },
					{ title: 'מתאריך', fieldName: 'dtGlobalDateBegin',type:'date' },
					{ title: 'עד תאריך', fieldName: 'dtGlobalDateEnd', type: 'date' }
				];
		};

		$scope.getData = function () {
			connect.post(true, 'GetMonthes', {},
				function (result) {
					$scope.monthesList = result;
					$scope.isDataLoaded++;
					$scope.monthesList.forEach(function (month) {
						month.iMonthYearId = month.iMonthYearId + ""
						$scope.tmpDate1 = month.iMonthYearId.substring(0, 4);
						$scope.tmpDate2 = month.iMonthYearId.substring(4, 6);
						$scope.tmpDate = $scope.tmpDate2 + '/' + $scope.tmpDate1
						month.iMonthYearId = $scope.tmpDate
					})
				});
		}

		$scope.AddNewMonth = function () {
			$scope.pop = "<label>חודש ושנה</label><input type='text' class='form-control' required ng-model='newMonth.iMonthYearId' required/>"  +
				"<label>מתאריך</label><input type='date' class='form-control' required ng-model='newMonth.dtGlobalDateBegin' required/>" +
				"<label>עד תאריך</label><input type='date' class='form-control' required ng-model='newMonth.dtGlobalDateEnd' required/>";
			alerts.custom($scope.pop, 'הוספת ערך', $scope,
				function () {
					if (!$scope.newMonth.iMonthYearId || !$scope.newMonth.dtGlobalDateBegin || !$scope.newMonth.dtGlobalDateEnd) {
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
					$scope.tmpDate2 = $scope.newMonth.iMonthYearId.substring(0, 2);
					$scope.tmpDate1 = $scope.newMonth.iMonthYearId.substring(3, 7);
					$scope.tmpDate = parseInt($scope.tmpDate1) * 100 + parseInt($scope.tmpDate2)
					$scope.newMonth.iMonthYearId = $scope.tmpDate
					connect.post(true, 'monthInsert', { month: $scope.newMonth, iUserManagerId: $rootScope.user.iUserId }, function (result) {
						if (result && result > 0) {
							console.log('monthInsert:' + result);
							$scope.newMonth = {};
							$scope.getData();
						}
						else {
							alert('ארעה שגיאה בלתי צפויה');
						}
					});
				}, function () { 
				    $scope.newMonth=[];
				    $scope.getData();
				}

			);
		}

		$scope.ResetBankHours = function ()
		{
			alerts.confirm('האם אתה בטוח שברצונך לאפס את בנק השעות לכלל הלקוחות?', alerts.titles.message,
				function () {
					connect.post(true, 'BankHoursUpdate', {}, function (result) {
						if (result)
							alerts.alert('האיפוס בוצע בהצלחה')
						else
							alerts.alert('ארעה תקלה בלתי צפויה')
					})
				}, function () { })
		}

		$scope.prepareData();
	}]);