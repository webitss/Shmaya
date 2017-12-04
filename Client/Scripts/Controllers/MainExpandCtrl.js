"use strict"
companionApp.controller('MainExpandCtrl', ['$scope', '$rootScope', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'codeTablesId', function ($scope, $rootScope, connect, $location, $filter, $timeout, codeTablesName, codeTablesId) {
    $scope.selectedMember = $scope.item != undefined ? $scope.item : $scope.searchMember;


    $scope.index = -1;


    $scope.loadCodeTablesList = false;
    $scope.tabs = [
    { title: 'פרטים אישיים', content: 'Partials/Pages/ABCBook/ABCBookDetailes.html', disabled: false },
    { title: 'יצירת קשר חדש', content: 'Partials/Pages/Companionships/CreateNewCompanionship.html', disabled: $scope.selected.newMember },//|| $scope.selectedMember.iCompanionshipStatusType != codeTablesId.companionship.noCompanionship 
    { title: 'פרטי שיחות', content: 'Partials/Pages/Conversations.html', disabled: $scope.selected.newMember },
    { title: 'קשר קיים', content: 'Partials/Pages/Companionships/ExistingCompanionship.html', disabled: $scope.selected.newMember },//|| $scope.selectedMember.iCompanionshipStatusType == codeTablesId.companionship.noCompanionship 
    { title: 'היסטוריית קשרים', content: 'Partials/Pages/CompanionshipsHistory.html', disabled: $scope.selected.newMember },// || $scope.selectedMember.iStatusType == codeTablesId.statusType.newMember || $scope.selectedMember.iStatusType == codeTablesId.statusType.waitToNew 
    { title: 'שליחת הודעות', content: 'Partials/Pages/Messages/Messages.html', disabled: $scope.selected.newMember }
    ];

    $scope.prepareData = function () {
        $scope.getCodeTables();
        $scope.init();
    };

    $scope.getCodeTables = function () {
        connect.post(true, connect.functions.GetMemberCodeTables, { iUserId: 1 }, function (result) {
            $scope.codeTables = result;
            $scope.maritalStatusList = $filter('filter')(result, { Key: codeTablesName.maritalStatus }, true)[0].Value;
            $scope.genderList = $filter('filter')(result, { Key: codeTablesName.gender }, true)[0].Value;
            $scope.cityList = $filter('filter')(result, { Key: codeTablesName.city }, true)[0].Value;
            $scope.educationList = $filter('filter')(result, { Key: codeTablesName.education }, true)[0].Value;
            $scope.experienceList = $filter('filter')(result, { Key: codeTablesName.experience }, true)[0].Value;
            $scope.employmentList = $filter('filter')(result, { Key: codeTablesName.employment }, true)[0].Value;
            $scope.kollellList = $filter('filter')(result, { Key: codeTablesName.kollell }, true)[0].Value;
            $scope.nameSourceList = $filter('filter')(result, { Key: codeTablesName.nameSource }, true)[0].Value;
            $scope.fileSourceList = $filter('filter')(result, { Key: codeTablesName.fileSource }, true)[0].Value;
            $scope.yearList = $filter('filter')(result, { Key: codeTablesName.year }, true)[0].Value;
            $scope.donationList = $filter('filter')(result, { Key: codeTablesName.donation }, true)[0].Value;
            $scope.statusList = $filter('filter')(result, { Key: codeTablesName.status }, true)[0].Value;
            //for (var i = 0; i < $scope.statusList.length; i++) {
            //    if ($scope.statusList[i].iId == codeTablesId.statusType.waitToAgain)
            //        $scope.statusList.splice(i, 1);
            //}
            $scope.seriousnessList = $filter('filter')(result, { Key: codeTablesName.Seriousness }, true)[0].Value;
            $scope.conversationStatusList = $filter('filter')(result, { Key: codeTablesName.conversationStatus }, true)[0].Value;
            $scope.dayList = $filter('filter')(result, { Key: codeTablesName.day }, true)[0].Value;
            $scope.dayPartList = $filter('filter')(result, { Key: codeTablesName.dayPart }, true)[0].Value;
            $scope.styleList = $filter('filter')(result, { Key: codeTablesName.style }, true)[0].Value;
            $scope.InterstList = $filter('filter')(result, { Key: codeTablesName.memberFieldInterst }, true)[0].Value;
            $scope.departmentList = $filter('filter')(result, { Key: codeTablesName.department }, true)[0].Value;
            //$scope.conversationStatus = $filter('filter')(result, { Key: codeTablesName.iconversationStatus }, true)[0].Value;
            $scope.companionshipStatus = $filter('filter')(result, { Key: codeTablesName.companionshipStatus }, true)[0].Value;
            $scope.languageList = $filter('filter')(result, { Key: codeTablesName.Language }, true)[0].Value;
            $scope.loadCodeTablesList = true;
            $scope.index = 0;
        });

        //$scope.iDepartmentId = $scope.selectedMember ? $scope.selectedMember.iDepartmentId : $rootScope.user.iDepartmentId;
        //if ($scope.iDepartmentId == undefined)
        //    $scope.iDepartmentId = 0;
        //connect.post(true, connect.functions.GetCoordinatorsCodeTable, { iDepartmentId: $scope.iDepartmentId }, function (result) {
        //    $scope.coordinatorList = $filter('filter')(result, { Key: codeTablesName.coordinators }, true)[0].Value;
        //});

    }

    $scope.init = function () {
        if ($scope.item && $scope.item.iStudentId) {
            $scope.selected = {
                idStudent: $scope.item.iStudentId,
                idVolunteer: undefined
            }
        }
        else if ($scope.item && $scope.item.iVolunteerId) {
            $scope.selected = {
                idVolunteer: $scope.item.iVolunteerId,
                idStudent: undefined
            }
        }
    }
    $scope.prepareData();

}]);