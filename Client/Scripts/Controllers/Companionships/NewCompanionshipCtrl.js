"use strict"
companionApp.controller('NewCompanionshipCtrl', ['$scope', '$rootScope', 'connect', '$timeout', '$filter', 'codeTablesName', 'codeTablesId', 'alerts',
function ($scope, $rootScope, connect, $timeout, $filter, codeTablesName, codeTablesId, alerts) {
    $scope.alert = false;
    $scope.errorCoordinator = false;
    $scope.companionshipExists = "חבר זה כבר משויך לחברותא, לפרטי החברותא הקיימת פנו לטאב של קשר קיים";
    $scope.showCompanionshipExists = false;

    if ($scope.selectedMember == undefined) {
        $scope.selectedMember = $scope.searchMember;
    }
    $scope.createNewCompanionship = $scope.selectedMember;

    $scope.iStudentId = $scope.selectedMember.iStudentId ? $scope.selectedMember.iStudentId : null,
    $scope.iVolunteerId = $scope.selectedMember.iVolunteerId ? $scope.selectedMember.iVolunteerId : null;
    connect.post(true, connect.functions.companionshipChekExists, { iStudentId: $scope.iStudentId, iVolunteerId: $scope.iVolunteerId }, function (result) {
        if (result == -100)
            $scope.showCompanionshipExists = true;
    });

    if ($scope.selectedMember.iStatusType == codeTablesId.companionshipStatusType.passive)
        $scope.isActive = "לא ניתן ליצור קשר לחבר שאינו פעיל!";
    $scope.gridIdentity = 'companionshipList';

    $scope.schedule = { comment: null };

    $scope.selectedCompanionship = {
        id: -1,
        openPersonDetails: false
    };

    $scope.coordinator = { id: -1 };
    $scope.isDataLoaded = 0;

    $scope.columns = [
         {
             title: 'צור קשר',
             fieldName: 'nvCreateNewCompanionship',
             template: '<div ng-click="item.alert = false;col.clickEvent(item);" ng-disabled="col.coordinator.id == -1 && !col.disable" ng-class="{\'mouse-no\': col.coordinator.id == -1 && !col.disable}" class="glyphicon glyphicon-link color-text-lb"></div>',//btn btn-default command-button 
             clickEvent: function (item) {
                 if ($scope.coordinator.id == -1) {
                     if (item.alert == false) {
                         alerts.alert('יש לבחור רכז לפני יצירת קשר', 'שגיאה');
                         var savingStatus = "יש לבחור רכז לפני יצירת קשר";
                         item.alert = true;
                         $rootScope.notification(savingStatus);
                         $scope.errorCoordinator = true;
                     }
                 }
                 else {
                     //   $scope.disable = false;
                     if ($scope.pop == undefined) {
                         $scope.pop = "<input type='text' class='form-control' ng-model='schedule.comment' required/>";
                         alerts.custom($scope.pop, 'הערת שיבוץ', $scope,
                             function () {
                                 $scope.newCompanionship = {
                                     iCoordinatorId: $scope.coordinator.id,
                                     iStudentId: $scope.iStudentId ? $scope.iStudentId : item.iStudentId,
                                     iVolunteerId: $scope.iVolunteerId ? $scope.iVolunteerId : item.iVolunteerId,
                                     //nvSchedulingComment: 'נסיון יצירת קשר מהאתר',
                                     nvSchedulingComment: $scope.schedule.comment,
                                     iStatusType: codeTablesId.companionshipStatusType.active
                                 };

                                 connect.post(true, connect.functions.CreateNewCompanionship, { companionship: $scope.newCompanionship, iUserId: $rootScope.user.iUserId }, function (result) {
                                     //result < 1 ? alert('failed') : '';
                                     if (result == -100) {
                                         $scope.$modalClose();
                                         var savingStatus = "חבר זה כבר קשור לחברותא אחרת.";
                                         $rootScope.notification(savingStatus);
                                     }
                                     else if (result > 0) {
                                         //$scope.tabs[3].disabled = false;
                                         //$scope.tabs[1].disabled = true;
                                         $rootScope.$broadcast('updateMemberInGrid', { member: $scope.selectedMember });
                                     }
                                     var savingStatus = result > 0 ? "הקשר נשמר בהצלחה" : "אירעה שגיאה ביצירת הקשר";
                                     $rootScope.notification(savingStatus);
                                     $scope.$modalClose();
                                 });
                             }, function () { }
                        );
                     }
                 }

             },
             weight: 0.5,
             filter: false,
             coordinator: $scope.coordinator,
             sort: false,
         },
        {
            title: 'שם פרטי',
            fieldName: 'nvFirstName', filter: true
        },
        {
            title: 'שם משפחה',
            fieldName: 'nvLastName', filter: true
        },
        {
            title: 'כתובת',
            fieldName: 'nvAddress',
            filter: true
        },
         {
             title: 'רצינות',
             fieldName: 'nvSeriousness'
         },
        {
            title: 'סטטוס',
            fieldName: 'nvStatusType'
        }
    ];


    $scope.getData = function () {
        $scope.getInterestedDetails();
        $scope.getCoordinators();
        connect.post(true, connect.functions.GetMatchingCompanionships, { iPersonId: $scope.createNewCompanionship.iPersonId },
            function (result) {
                $scope.companionshipList = result;
                $scope.isDataLoaded++;
            });
    };

    $scope.getInterestedDetails = function () {
        connect.post(true, connect.functions.GetMemberDetails, { iPersonId: $scope.createNewCompanionship.iPersonId },
        function (result) {
            $scope.interested = result;
        });
    };

    $scope.getCoordinators = function () {
        //change iDepartmentId parameter to correct value
        connect.post(true, connect.functions.GetCoordinatorsCodeTable, { iDepartmentId: $scope.selectedMember.iDepartmentId }, function (result) {
            $scope.coordinatorList = $filter('filter')(result, { Key: codeTablesName.coordinators }, true)[0].Value;
        });

    }

    $scope.getData();
}]);