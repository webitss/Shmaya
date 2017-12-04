"use strict"
companionApp.controller('MatchMemberDetailsCtrl', ['$scope', '$rootScope', 'connect', '$timeout', 'codeTablesId', function ($scope, $rootScope, connect, $timeout, codeTablesId) {
    //  $scope.iPersonId = $scope.selectedCompanionship.id;
    $scope.selectedCompanionship = $scope.item;
    connect.post(true, connect.functions.GetMember, { iStudentId: $scope.selectedCompanionship.iStudentId, iVolunteerId: $scope.selectedCompanionship.iVolunteerId },
        function (result) {
            $scope.companionship = result;
        });
 
}]);