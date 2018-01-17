"use strict"
orderApp.controller('NewOrderCtrl', ['$scope', '$rootScope', '$timeout', 'connect', '$filter', '$location', 'alerts',
    function ($scope, $rootScope, $timeout, connect, $filter, $location, alerts) {
        alert();

        $scope.successSend = false;

        $scope.maxDate = new Date();

        $scope.showWeeks = false;

        $scope.popup = {
            opened: false
        };

        $scope.open = function ($event) {
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
            OrderConnect.post(true, 'GetUserCodeTables', { iUserId: $rootScope.user.iUserId }, function (result) {
                $scope.codeTables = result;
                $scope.translateTypeList = $filter('filter')(result, { Key: 'translateType' }, true)[0].Value;
                $scope.orderTypeList = $filter('filter')(result, { Key: 'orderType' }, true)[0].Value;
                $scope.areaList = $filter('filter')(result, { Key: 'area' }, true)[0].Value;
                $scope.city = $filter('filter')(result, { Key: 'city' }, true)[0].Value;
            });
            $scope.getTranslators();
        };

        $scope.getTranslators = function (iTypeTranslation) {
            OrderConnect.post(true, 'GetUsers', { iUserType: 3, iStatusId: 0, iTypeTranslation: $scope.iTypeTranslation }, function (result) {
                if (result && result.length > 0)
                    $scope.ABCBookProviders = result;
                else
                    OrderAlerts.alert('ארעה שגיאה בלתי צפויה');
            });
        };

        $scope.getData();
    }]);