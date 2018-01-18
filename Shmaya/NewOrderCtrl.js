"use strict"
NOApp.controller('NewOrderCtrl', ['$scope', 'orderConnect', '$filter', 'orderAlerts',
    function ($scope, orderConnect, $filter, orderAlerts) {

        $scope.successSend = false;

        $scope.maxDate = new Date();

        $scope.showWeeks = false;

        $scope.popup = {
            opened: false
        };

        $scope.open = function () {
            $scope.popup.opened = true;
        };

        $scope.open2 = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.popup.opened = true;
        };

        $scope.disabled = function (date, mode) {
            return (mode === 'day' && (date.getDay()));
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.getData = function () {
            orderConnect.post(true, 'GetUserCodeTables', { iUserId: 1 }, function (result) {
                $scope.codeTables = result;
                $scope.translateTypeList = $filter('filter')(result, { Key: 'translateType' }, true)[0].Value;
                $scope.orderTypeList = $filter('filter')(result, { Key: 'orderType' }, true)[0].Value;
                $scope.areaList = $filter('filter')(result, { Key: 'area' }, true)[0].Value;
                $scope.city = $filter('filter')(result, { Key: 'city' }, true)[0].Value;
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
                        orderAlerts.alert(result.sResult);
                        $scope.order.nameCustomer = "";
                        $scope.order.nvIdentity = "";
                    }
                    else
                        orderAlerts.alert(result.sResult);
                }
                else
                    OrderAlerts.alert('ארעה שגיאה בלתי צפויה');
            });
        };
        //OrderInsert(Orders order, int iUserManagerId)
        $scope.sendReport = function () {
            $scope.order.dtDateTraslation = angular.copy($scope.order.dtDateTraslation_original)
            $scope.order.dtTimeBegin = angular.copy($scope.order.dtTimeBegin_original)
            $scope.order.dtTimeTranslation = angular.copy($scope.order.dtTimeTranslation_original)
            orderConnect.post(true, 'OrderInsert', { 'order': $scope.order, 'iUserManagerId': 1 }, function (result) {
                if (result && result > 0) {
                    $scope.order = [];
                    $scope.successSend = true;
                }
                else
                    OrderAlerts.alert('ארעה שגיאה בלתי צפויה');
            });
        };

        $scope.getData();
    }]);