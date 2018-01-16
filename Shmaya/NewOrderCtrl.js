"use strict"
companionApp.controller('NewOrderCtrl', ['$scope', '$rootScope', '$timeout', 'connect', '$filter', '$location', 'alerts',
    function ($scope, $rootScope, $timeout, connect, $filter, $location, alerts) {

        $scope.getData = function () {
            connect.post(true, 'GetUserCodeTables', { iUserId: $rootScope.user.iUserId }, function (result) {
                $scope.codeTables = result;
                $scope.translateTypeList = $filter('filter')(result, { Key: 'translateType' }, true)[0].Value;
                $scope.orderTypeList = $filter('filter')(result, { Key: 'orderType' }, true)[0].Value;
                $scope.areaList = $filter('filter')(result, { Key: 'area' }, true)[0].Value;
                $scope.city = $filter('filter')(result, { Key: 'city' }, true)[0].Value;
            });
            $scope.getTranslators();
        };

        $scope.getTranslators = function (iTypeTranslation) {
            connect.post(true, 'GetUsers', { iUserType: 3, iStatusId: 0, iTypeTranslation: $scope.iTypeTranslation }, function (result) {
                if (result && result.length > 0)
                    $scope.ABCBookProviders = result;
                else
                    alerts.alert('ארעה שגיאה בלתי צפויה');
            });
        };

        $scope.getData();
    }]);