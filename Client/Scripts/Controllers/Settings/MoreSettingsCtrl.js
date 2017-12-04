companionApp.controller('MoreSettingsCtrl', ['$scope', '$rootScope', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'codeTablesId', function ($scope, $rootScope, connect, $location, $filter, $timeout, codeTablesName, codeTablesId) {
    connect.post(true, connect.functions.GetNumDays, {}, function (result) {
        $scope.listNumDays = result;
    });

    $scope.saveDetails = function () {
        angular.forEach($scope.listNumDays, function (value, index) {
            value.iCompanionshipId = -1;
            connect.post(true, connect.functions.SetNumDays, { setting: value, iUserId: $rootScope.user.iUserId }, function (result) {
                $scope.isUpdae = result;
            });
        });

        
    }
}]);
