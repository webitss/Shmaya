companionApp.controller('CompanionshipsHistoryCtrl', ['$scope', '$rootScope', 'connect', '$filter', 'codeTablesId', 'alerts', function ($scope, $rootScope, connect, $filter, codeTablesId, alerts) {

    if ($scope.selected == undefined) {
        $scope.selected = $scope.searchMember;
    }

    $scope.statusToChange = codeTablesId.companionshipStatusType.passive;
    $scope.oneAtATime = false;
    $scope.isCollapse = false;

    connect.post(true, connect.functions.getCompanionshipsHistory, { iStudentId: $scope.selected.idStudent, iVolunteerId: $scope.selected.idVolunteer }, function (result) {
        $scope.history = result;
        if (result.length == 0)
            $scope.noCompanionship = "אין קשרים קודמים";
    });

    $scope.changeCompanionshipStatus = function (iCompanionshipId) {
        if ($scope.selectedMember.iCompanionshipStatusType != 735)
            alerts.alert('לא ניתן לשחזר חברותא לחבר שיש לו חברותא פעילה!', 'שגיאה!')
        else {
            connect.post(true, connect.functions.UpdateCompanionshipStatus, { iCompanionshipId: iCompanionshipId, iStatusType: codeTablesId.companionshipStatusType.active, nvDischargedComment: '', iStudentStatus: codeTablesId.statusType.active, iVolunteerStatus: codeTablesId.statusType.active, iUserId: $rootScope.user.iUserId }, function (result) {
                var savingStatus = result != -1 ? "השינויים נשמרו בהצלחה" : "אירעה שגיאה";
                if (result != -1)
                    $rootScope.$broadcast('updateMemberInGrid', { member: $scope.selected });
                $rootScope.notification(savingStatus);
            });
        }
    }
}]);