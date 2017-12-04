'use strict'
companionApp.controller('ExistingCompanionshipCtrl', ['$scope', '$rootScope', '$timeout', 'connect', 'codeTablesName', '$filter', '$location', 'codeTablesId', 'alerts','createDialogFactory',
function ($scope, $rootScope, $timeout, connect, codeTablesName, $filter, $location, codeTablesId, alerts, createDialogFactory) {

    if ($scope.selectedMember == undefined) {
        $scope.selectedMember = $scope.searchMember;
    }
    $scope.noCompanionship = null;
    $scope.bIsNewConversationOpen = false;
    $scope.noConversation = null;
    $scope.User = $rootScope.user.iUserId;
    $scope.oneAtATime = false;
    $scope.form = { newConversationForm: {} };
    $scope.discharged = { comment: null };

    connect.post(true, connect.functions.GetExistingCompanionship, { iStudentId: $scope.selected.idStudent, iVolunteerId: $scope.selected.idVolunteer }, function (result) {

        $scope.companionship = result;
        if (result.length == 0)
            $scope.noCompanionship = "אין קשר קיים";
        else {
            connect.post(true, connect.functions.getNextConversation, { iCompanionshipId: $scope.companionship.iCompanionshipId }, function (result) {
                if (result == -100)
                    $scope.iNumDaysNextConversation = 20;
                else
                    $scope.iNumDaysNextConversation = result;


                if ($scope.selected.idStudent != undefined) {
                    $scope.nvStudentName = $scope.companionship.nvName;
                    $scope.nvVolunteerName = $scope.selectedMember.nvFirstName + ' ' + $scope.selectedMember.nvLastName;
                }
                else if ($scope.selected.idVolunteer != undefined) {
                    $scope.nvVolunteerName = $scope.companionship.nvName;
                    $scope.nvStudentName = $scope.selectedMember.nvFirstName + ' ' + $scope.selectedMember.nvLastName;
                }
                $scope.getAllConversations($scope.companionship.iCompanionshipId);
            });
        }
    });

    $scope.getAllConversations = function (iCompanionshipId) {
        connect.post(true, connect.functions.GetAllConversations, { iStudentId: null, iVolunteerId: null, iCompanionshipId: iCompanionshipId }, function (result) {
            $scope.CompanionshipsConversations = result;
            if (result.lengh == 0)
                $scope.noConversation = 'לא התבצעו שיחות עם חבר זה';
        });
    };

    $scope.openNewConversation = function (iStudentId, iVolunteerId) {
        $scope.bIsNewConversationOpen = true;
        var dtNextConversation = new Date();
        dtNextConversation.setDate(dtNextConversation.getDate() + $scope.iNumDaysNextConversation);
        $scope.newConversation = {
            iConversationId: -1,
            iCompanionshipId: $scope.companionship.iCompanionshipId,
            iCoordinatorId: $rootScope.user.iCoordinatorId,
            nvCoordinatorName: $scope.user.nvName,
            nvSubject: '',
            nvComment: '',
            dtConversationDate: new Date(),
            dtNextConversation: dtNextConversation,
            iStatusConversationType: null,
            iVolunteerId: iVolunteerId,
            iStudentId: iStudentId
        };
    }

    $scope.changeStatus = function () {
        if ($scope.companionship.iStatusType == codeTablesId.companionshipStatusType.passive) {

            $scope.statusListV = angular.copy($scope.statusList);
            $scope.statusListS = angular.copy($scope.statusList);
            //$scope.pop = '<input type="text" class="row" placeholder="הערת פרוק" ng-model="discharged.comment" />';
            //<br /><form-field span-text="סטטוס מתנדב" class="row">
            //<form-dropdown ng-model="discharged.iVolunteerStatus" enablesearch="false" data="statusListV" required></form-dropdown></form-field><br />
            //<form-field span-text="סטטוס מתלמד" class="row"><form-dropdown ng-model="discharged.iStudentStatus" enablesearch="false" data="statusListS" required></form-dropdown></form-field><br /><br />';
            //alerts.custom($scope.pop, 'הערת פרוק', $scope,
            //    function () {
            //        connect.post(true, connect.functions.UpdateCompanionshipStatus, { iCompanionshipId: $scope.companionship.iCompanionshipId, iStatusType: $scope.companionship.iStatusType, nvDischargedComment: $scope.discharged.comment, iStudentStatus: $scope.discharged.iStudentStatus, iVolunteerStatus: $scope.discharged.iVolunteerStatus, iUserId: $rootScope.user.iUserId }, function (result) {
            //            if (result) {
            //                $rootScope.$broadcast('updateMemberInGrid', { member: $scope.selectedMember });
            //            }
            //            var savingStatus = result ? "השינויים נשמרו בהצלחה" : "אירעה שגיאה";
            //            $rootScope.notification(savingStatus);
            //        });
            //    }, function () {
            //    });
            createDialogFactory({
                templateUrl: 'Partials/Templates/DischargeCompanionship.html' + $rootScope.appVersionParameter,
                title: 'פרוק חברותא',
                backdrop: true,
                scope: $scope,
                modalClass: "modal modalAlert"
            });
        }
        else {
            connect.post(true, connect.functions.UpdateCompanionshipStatus, { iCompanionshipId: $scope.companionship.iCompanionshipId, iStatusType: $scope.companionship.iStatusType, nvDischargedComment: $scope.discharged.comment, iStudentStatus: $scope.discharged.iStudentStatus, iVolunteerStatus: $scope.discharged.iVolunteerStatus, iUserId: $rootScope.user.iUserId }, function (result) {
                if (result && result > 0) {
                    $rootScope.$broadcast('updateMemberInGrid', { member: $scope.selectedMember });
                }
                var savingStatus = result ? "השינויים נשמרו בהצלחה" : "אירעה שגיאה";
                $rootScope.notification(savingStatus);
            });
        }
    };

    $scope.dischargeOK = function () {
        connect.post(true, connect.functions.UpdateCompanionshipStatus, { iCompanionshipId: $scope.companionship.iCompanionshipId, iStatusType: $scope.companionship.iStatusType, nvDischargedComment: $scope.discharged.comment, iStudentStatus: $scope.discharged.iStudentStatus, iVolunteerStatus: $scope.discharged.iVolunteerStatus, iUserId: $rootScope.user.iUserId }, function (result) {
            if (result) {
                $rootScope.$broadcast('updateMemberInGrid', { member: $scope.selectedMember });
            }
            var savingStatus = result ? "השינויים נשמרו בהצלחה" : "אירעה שגיאה";
            $rootScope.notification(savingStatus);
        });
    }

    //$scope.$watch('companionship.iStatusType', function (newNalue, oldValue) {
    //    if (newNalue != oldValue) {
    //        connect.post(true, connect.functions.UpdateCompanionshipStatus, { iCompanionshipId: $scope.companionship.iCompanionshipId, iStatusType: $scope.companionship.iStatusType, iUserId: $rootScope.user.iUserId }, function (result) {
    //            var savingStatus = result ? "השינויים נשמרו בהצלחה" : "אירעה שגיאה";

    //            $rootScope.notification(savingStatus);
    //        });
    //    }
    //});

    $scope.saveConversation = function () {
        $scope.$broadcast('show-errors-check-validity');
        if (!$scope.form.newConversationForm.$valid) return;

        connect.post(true, connect.functions.CreateNewConversation, { conversation: $scope.newConversation, iUserId: $rootScope.user.iUserId }, function (result) {
            $scope.bIsNewConversationOpen = false;
            $scope.newConversation = {};
            var savingStatus = "שיחה נוספה בהצלחה"
            $rootScope.notification(savingStatus);
            $scope.getAllConversations($scope.companionship.iCompanionshipId);
        });

    }

    $scope.cancelConversation = function () {
        $scope.bIsNewConversationOpen = false;
        $scope.newConversation = {};
    }


}]);