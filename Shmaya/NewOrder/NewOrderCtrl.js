﻿"use strict"
var a;
NOApp.controller('NewOrderCtrl', ['$scope', 'orderConnect', '$filter', 'orderAlerts', '$rootScope', 'createDialog', '$location',
	function ($scope, orderConnect, $filter, orderAlerts, $rootScope, createDialog, $location) {
		$scope.isSign1 = false
		$scope.isSign2 = false
		$scope.isSign3 = false
        $scope.order =
            {
			dtDateTraslation_original: new Date(),
			nvRemark:null
			}
		$scope.showWaiting = false;
		$scope.successSend = false;
		$scope.inValidOrder = false;

        $scope.getData = function () {
            orderConnect.post(true, 'GetUserCodeTables', { iUserId: 1 }, function (result) {
                $scope.codeTables = result;
                $scope.translateTypeList = $filter('filter')(result, { Key: 'translateType' }, true)[0].Value;
                $scope.orderTypeList = $filter('filter')(result, { Key: 'orderType' }, true)[0].Value;
                $scope.areaList = $filter('filter')(result, { Key: 'area' }, true)[0].Value;
                $scope.city = $filter('filter')(result, { Key: 'city' }, true)[0].Value;
                $scope.monthList = $filter('filter')(result, { Key: 'month' }, true)[0].Value;
                $scope.yearList = $filter('filter')(result, { Key: 'year' }, true)[0].Value;
				$scope.monthYearList = $filter('filter')(result, { Key: 'monthYear' }, true)[0].Value;
				$scope.globalParameterList = $filter('filter')(result, { Key: 'globalParameter' }, true)[0].Value;
				$rootScope.vat = $scope.globalParameterList[0].nvName;
				$rootScope.vat = parseInt($rootScope.vat);
				$rootScope.maxHours = $scope.globalParameterList[1].nvName;
				$rootScope.maxHours = parseInt($rootScope.maxHours);
                $scope.monthYearList.forEach(function (date) {
                    $scope.tmpDate1 = date.nvName.substring(0, 4);
                    $scope.tmpDate2 = date.nvName.substring(4, 6);
                    $scope.tmpDate = $scope.tmpDate2 + '/' + $scope.tmpDate1
                    date.nvName = $scope.tmpDate
                })
                $scope.defYear = $filter('filter')($scope.yearList, { nvName: new Date().getFullYear() + '' }, true)[0].nvName;
                $scope.defMonth = $scope.monthList[new Date().getMonth()].iId;
                $scope.defMonthYear = parseInt($scope.defYear) * 100 + $scope.defMonth
            });
            $scope.getTranslators();
        };

        $scope.getTranslators = function (iTypeTranslation) {
			orderConnect.post(true, 'GetUsersCode', { iUserType: 3, iStatusId: 0, iTypeTranslation: $scope.iTypeTranslation }, function (result) {
                if (result && result.length > 0)
                    $scope.ABCBookProviders = result;
                else
                    OrderAlerts.alert('ארעה שגיאה בלתי צפויה');
            });
		};

		$scope.selectTypeTranslating = function (iTypeTranslation)
		{
			if (iTypeTranslation == 58)
				$scope.showWaiting = true;
			else
				$scope.showWaiting = false;
		}

		$scope.OpenSignatureDialog = function (ind) {
			$scope.ind = ind;
			$rootScope.signature = {
				dataUrl: ''
			};
			$scope.showBtnSignature = true;
			createDialog({
				scope: $scope,
				templateUrl: 'Signature.html', 
				title: 'חתימה',
				backdrop: true,
				modalClass: "modal modalAlert"
			});
		};


		$scope.sendSignature = function (ind)
		{
			if (ind == 1) {
				$scope.isSign1 = true;
				$scope.order.nvProviderSignature = $rootScope.signature.dataUrl.substring($rootScope.signature.dataUrl.indexOf(',') + 1, $rootScope.signature.dataUrl.length);
			}
			else
				if (ind == 2) {
					$scope.order.nvCustomerSignature = $rootScope.signature.dataUrl.substring($rootScope.signature.dataUrl.indexOf(',') + 1, $rootScope.signature.dataUrl.length);
					$scope.isSign2 = true;
				}
				else {
					$scope.order.nvLocationSignature = $rootScope.signature.dataUrl.substring($rootScope.signature.dataUrl.indexOf(',') + 1, $rootScope.signature.dataUrl.length);
					$scope.isSign3 = true;
				}


		} 

		$scope.calculateTimeEnd = function () {
			if (!$scope.order.dtTimeBegin_original || !$scope.order.dtTimeTranslation_original) return;
			var hours = $scope.order.dtTimeBegin_original.getHours() + $scope.order.dtTimeTranslation_original.getHours();
			var minutes = $scope.order.dtTimeBegin_original.getMinutes() + $scope.order.dtTimeTranslation_original.getMinutes();
			if (minutes >= 60) {
				minutes -= 60;
				hours += 1;
			}
			
			if ($scope.order.dtTimeTranslation_original.getHours() > $rootScope.maxHours)
			{
				$scope.noIdentity = true;
				$scope.noIdentityAlert = "משך זמן התרגום גדול מדי. הזמנה זו תמתין לאישור";
				$scope.inValidOrder = true
			}
			$scope.order.dtTimeEnd = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay(), hours, minutes);
		}

        $scope.checkIdentityCustomer = function () {
			if (!$scope.order.nvIdentityCustomer) return;
			orderConnect.post(true, 'GetUserByIdentity', { 'nvIdentity': $scope.order.nvIdentityCustomer,'userType':2 }, function (result) {
                if (result) {
                    if (result.iResult > 0) {
                        $scope.order.nameCustomer = result.sResult;
                        $scope.order.iUserId = result.iResult;
                    }
                    else if (result.iResult == 0) {
                        $scope.noIdentity = true;
                        $scope.noIdentityAlert = result.sResult;
                        $scope.order.nameCustomer = "";
						$scope.order.nvIdentityCustomer = "";
                    }
                    else {
                        $scope.noIdentity = true;
                        $scope.noIdentityAlert = result.sResult;
                    }
                }
                else {
                    $scope.noIdentity = true;
                    $scope.noIdentityAlert = 'ארעה שגיאה בלתי צפויה';
                }
            });
		};

		$scope.checkIdentityProvider = function () {
			if (!$scope.order.nvIdentityProvider) return;
			orderConnect.post(true, 'GetUserByIdentity', { 'nvIdentity': $scope.order.nvIdentityProvider,'userType':3 }, function (result) {
				if (result) {
					if (result.iResult > 0) {
						$scope.order.nameTranslator = result.sResult;
						$scope.order.iSelectedTranslator = result.iResult;
					}
					else if (result.iResult == 0) {
						$scope.noIdentity = true;
						$scope.noIdentityAlert = result.sResult;
						$scope.order.nameTranslator = "";
						$scope.order.nvIdentityProvider = "";
					}
					else {
						$scope.noIdentity = true;
						$scope.noIdentityAlert = result.sResult;
					}
				}
				else {
					$scope.noIdentity = true;
					$scope.noIdentityAlert = 'ארעה שגיאה בלתי צפויה';
				}
			});
		};

        $scope.closePopupSend = function () {
            $scope.successSend = false;
        }

        $scope.closePopupIdentity = function () {
            $scope.noIdentity = false;
        }

        $scope.closePopupValid = function () {
            $scope.noValid = false;
        }


		$scope.sendReport = function () {
			
            if (!$scope.order.bAgree) alert();
            if (!$scope.order.iTypeOrder || !$scope.order.iTypeTranslation
				|| !$scope.order.nvIdentityCustomer || !$scope.order.nvIdentityProvider || !$scope.order.nameCustomer
				|| !$scope.order.nameTranslator || !$scope.order.dtDateTraslation_original
                || !$scope.order.dtTimeBegin_original || !$scope.order.dtTimeTranslation_original 
				|| !$scope.order.iAreaId || !$scope.order.iCityId || !$scope.isSign1 || !$scope.isSign2 || !$scope.isSign3) {
                $scope.noValid = true;
                return;
			}


			$scope.isSign1 = false
			$scope.isSign2 = false
			$scope.isSign3 = false
            $scope.order.iMonthYearId = $scope.defMonthYear;
            $scope.order.dtDateTraslation = angular.copy($scope.order.dtDateTraslation_original)
            $scope.order.dtTimeBegin = angular.copy($scope.order.dtTimeBegin_original)
            $scope.order.dtTimeTranslation = angular.copy($scope.order.dtTimeTranslation_original)
			$scope.order.dtTimeWaiting = angular.copy($scope.order.dtTimeWaiting_original)
			orderConnect.post(true, 'OrderInsert', { 'order': $scope.order, 'iUserManagerId': 1, 'isFromSite': 0, 'customer': $scope.customer, 'inValidOrder': $scope.inValidOrder }, function (result) {
				//if (result.iOrderId == -1) {
				//	$scope.noIdentity = true;
				//	$scope.noIdentityAlert = 'קיימת הזמנה בטווח השעות הנבחר';
				//}
				////if (result.iOrderId == -2) {
				////	$scope.noIdentity = true;
				////	$scope.noIdentityAlert = 'מכסת השעות ללקוח זה הסתיימה. הדוחות ממתינים אצלינו. לקבלת תוספת שעות יש לפנות למשרד הרווחה';
				////}
				//else
				if (result.iOrderId && result.iOrderId > 0) {
					$scope.successSend = true;

					orderConnect.post(true, 'GenerateAttendanceReport', {
						folderName: null,
						url: "NewOrder/pdfReport.html",
						identityTranslator: $scope.order.nvIdentityProvider
					}, function (result) {
						//if (result)
						{
							console.log("generate pdf");
							$scope.order =
								{
									dtDateTraslation_original: new Date()
								}
							$scope.customer = {}
						}
					})
				}
				else
					if (result.iOrderId == -1) {
						$scope.noIdentity = true;
						$scope.noIdentityAlert = 'קיימת הזמנה בטווח השעות הנבחר';
					}
					else
						if (result.iOrderId == -2)
						{
							$scope.noIdentity = true;
							$scope.noIdentityAlert = 'מכסת השעות ללקוח זה הסתיימה. הדוחות ממתינים אצלינו. לקבלת תוספת שעות יש לפנות למשרד הרווחה';
							$scope.order =
								{
									dtDateTraslation_original: new Date()
								}
							$scope.customer = {}

						}
                else {
                    $scope.noIdentity = true;
                    $scope.noIdentityAlert = 'ארעה שגיאה בלתי צפויה';
                }
			});
        };

        $scope.getData();
    }]);