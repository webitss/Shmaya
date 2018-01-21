"use strict"
NOApp.controller('NewOrderCtrl', ['$scope', 'orderConnect', '$filter', 'orderAlerts',
    function ($scope, orderConnect, $filter, orderAlerts) {

        $scope.order =
            {
                dtDateTraslation_original: new Date()
            }

        $scope.successSend = false;

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
            orderConnect.post(true, 'GetUsers', { iUserType: 3, iStatusId: 0, iTypeTranslation: $scope.iTypeTranslation }, function (result) {
                if (result && result.length > 0)
                    $scope.ABCBookProviders = result;
                else
                    OrderAlerts.alert('ארעה שגיאה בלתי צפויה');
            });
        };

        $scope.checkIdentity = function () {
            if (!$scope.order.nvIdentity) return;
            orderConnect.post(true, 'GetUserByIdentity', { 'nvIdentity': $scope.order.nvIdentity }, function (result) {
                if (result) {
                    if (result.iResult > 0) {
                        $scope.order.nameCustomer = result.sResult;
                        $scope.order.iUserId = result.iResult;
                    }
                    else if (result.iResult == 0) {
                        $scope.noIdentity = true;
                        $scope.noIdentityALert = result.sResult;
                        $scope.order.nameCustomer = "";
                        $scope.order.nvIdentity = "";
                    }
                    else {
                        $scope.noIdentity = true;
                        $scope.noIdentityALert = result.sResult;
                    }
                }
                else {
                    $scope.noIdentity = true;
                    $scope.noIdentityALert = 'ארעה שגיאה בלתי צפויה';
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
                || !$scope.order.nvIdentity || !$scope.order.nameCustomer
                || !$scope.order.iSelectedTranslator || !$scope.order.dtDateTraslation_original
                || !$scope.order.dtTimeBegin_original || !$scope.order.dtTimeTranslation_original || !$scope.order.dtTimeWaiting_original
                || !$scope.order.iArea || !$scope.order.iCityId) {
                $scope.noValid = true;
                return;
            }
            $scope.order.iMonthYearId = $scope.defMonthYear;
            $scope.order.dtDateTraslation = angular.copy($scope.order.dtDateTraslation_original)
            $scope.order.dtTimeBegin = angular.copy($scope.order.dtTimeBegin_original)
            $scope.order.dtTimeTranslation = angular.copy($scope.order.dtTimeTranslation_original)
            $scope.order.dtTimeWaiting = angular.copy($scope.order.dtTimeWaiting_original)
            orderConnect.post(true, 'OrderInsert', { 'order': $scope.order, 'iUserManagerId': 1 }, function (result) {
                if (result && result > 0) {
                    $scope.order =
                    {
                        dtDateTraslation_original: new Date()
                    }
                    $scope.successSend = true;
                }
                else {
                    $scope.noIdentity = true;
                    $scope.noIdentityALert = 'ארעה שגיאה בלתי צפויה';
                }
            });
        };

        $scope.getData();
    }]);