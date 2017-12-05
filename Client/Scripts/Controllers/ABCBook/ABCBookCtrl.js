"use strict"
companionApp.controller('ABCBookCtrl', ['$scope', '$rootScope', 'connect', '$timeout', '$filter', 'alerts', 'createDialog', '$uibModal', 'codeTablesId', function ($scope, $rootScope, connect, $timeout, $filter, alerts, createDialog, $uibModal, codeTablesId) {
    $scope.newStudents = false;
    $scope.listToSend = [];

    $scope.newMessage = { isOpen: false };

    $scope.haveSend = false;
    $scope.aMember =
            {
                iPersonId: null,
                nvName: null,
                nvEmail: null,
                nvMobileNumber: null
            };

    $scope.variable = {
        openDialog1: false,
        openDialog2: false
    };

    $scope.displaymembers = { inCompanionship: $rootScope.user.iUserType == codeTablesId.permissionType.coordinator };
    $scope.coordinatorPermission = $rootScope.user.iUserType == codeTablesId.permissionType.coordinator || $rootScope.user.iUserType == codeTablesId.permissionType.schedulingCoordinator

    $scope.searchText = { searchAbcBook: null };

    $scope.showNewStudents = function () {
        $scope.newStudents = true;
        connect.post(true, "GetNewStudents", { iCoordinatorId: $rootScope.user.iCoordinatorId }, function (result) {
            $scope.volunteersAndStudents = result;
            $scope.isDataLoaded++;
        });
    }

    $scope.search = function () {
        if ($scope.searchText.searchAbcBook == null || $scope.searchText.searchAbcBook == undefined || $scope.searchText.searchAbcBook == "") return;
        if ($scope.searchText.searchAbcBook.length != 10) return;
        connect.post(true, connect.functions.GetMemberBySearchText, { searchText: $scope.searchText.searchAbcBook, iUserId: $rootScope.user.iUserId }, function (result) {
            $scope.searchMember = result;

            if (result == undefined || result == null || result.length == 0)
                alerts.alert('מספר לא קיים');
            else if ($scope.searchMember.iDepartmentId == -1)
                alerts.alert('מספר לא קיים במחלקה');
            else {
                $scope.searchMember.getSearch = true;
                $scope.searchMember.iVolunteerId ? ($scope.selected.idVolunteer = $scope.searchMember.iVolunteerId) : ($scope.selected.idStudent = $scope.searchMember.iStudentId);
                $rootScope.$broadcast('displayDialog', { id: $scope.searchMember.iPersonId });
            }
            $scope.searchText.searchAbcBook = "";
        });
    }

    $scope.prepareData = function () {
        $scope.selected = { idStudent: undefined, idVolunteer: undefined, newMemeber: false, nvDepartmentName: null };

        $rootScope.delete = undefined;
        $scope.createNewCompanionship = { iPersonId: undefined };
        $scope.type = undefined;
        $scope.isDataLoaded = 0;
        $scope.gridIdentity = 'volunteersAndStudents';
        $scope.columns = [
            {
                fieldName: 'iId',
                title: 'עריכה',
                titleTemplate: '</div>'+
                    '<div class="pass user-class-white-all" style="display: inline-block;" title="הצג הכל" ng-click="col.showAll()"></div>&nbsp' +
                    '<div class="pass user-class-blue" style="display: inline-block;" title="הצג מתלמדים" ng-click="col.sortStudents()"></div>&nbsp'+
                    '<div class="pass user-class-green" style="display: inline-block;" title="הצג מתנדבים" ng-click="col.sortVolunteers()"></div>' +
                    '</div>',
                template: '<div class=\'pass user-class\'  ng-click=\'col.clickEvent(item)\' title="{{item.iStudentId?\'מתלמד\':\'מתנדב\'}}" ng-class="{\'user-class-blue\': item.iStudentId, \'user-class-green\': item.iVolunteerId}"></div>',
                clickEvent: function (item) {
                    item.dialogIsOpen = true;
                    $scope.selected.nvDepartmentName = item.nvDepartmentName;
                    $rootScope.$broadcast('displayDialog', { id: item.iPersonId });
                    $rootScope.$broadcast('showComment', { id: item.iPersonId });
                },
                sortStudents: function () {
                    $scope.volunteersAndStudents = $rootScope.volunteersAndStudents;
                    $scope.volunteersAndStudents = $filter('filter')($rootScope.volunteersAndStudents, { iVolunteerId: null });
                    $scope.isDataLoaded++;
                },
                sortVolunteers: function () {
                    $scope.volunteersAndStudents = $rootScope.volunteersAndStudents;
                    $scope.volunteersAndStudents = $filter('filter')($rootScope.volunteersAndStudents, { iStudentId: null });
                    $scope.isDataLoaded++;
                },
                showAll: function () {
                    $scope.volunteersAndStudents = $rootScope.volunteersAndStudents;
                    $scope.isDataLoaded++;
                },
                weight: 0.9,
                filter: false,
                sort: false
            },
            {
                title: 'שליחת הודעה',
                template: '<input type="checkbox" ng-if="item.bNotReceivingMessages!=true" ng-change="col.addMemberToMessage(item)" ng-model="item.bChecked"/>',
                addMemberToMessage: function (item) {
                    $scope.messageList(item);
                },
                weight: 0.9,
                filter: false,
                sort: false
            },
            {
                fieldName: 'iPersonId',
                title: 'מחיקה',
                type: ($rootScope.user.iUserType != codeTablesId.permissionType.systemAdministrator && $rootScope.user.iUserType != codeTablesId.permissionType.schedulingCoordinator) ? 'hidden' : 'visible',
                template: '<div class=\'pass glyphicon glyphicon-remove color-text-gray\' ng-click=\'col.deleteAMember(item)\'></div>',
                deleteAMember: function (item) {
                    $scope.someone = item.nvFirstName + ' ' + item.nvLastName;
                    alerts.confirm('האם ברצונך להסיר את ' + $scope.someone + ' מהאלפון?', alerts.titles.message, function () {
                        $scope.deleteMember(item);
                    }, function () {
                    });
                },
                weight: 0.5,
                filter: false,
                sort: false
            },
            {
                title: 'מצב הקשר',
                fieldName: 'nvCompanionshipStatus'
            },
            {
                title: 'מצב הקשר',
                fieldName: 'iCompanionshipStatusType',
                type: 'hidden'
            },
            { title: 'שם פרטי', fieldName: 'nvFirstName' },
            { title: 'שם משפחה', fieldName: 'nvLastName' },
            { title: 'ת.ז.', fieldName: 'iAge', weight: 0.5 },
            { title: 'כתובת', fieldName: 'nvAddress' },
            { title: 'טלפון', fieldName: 'nvPhoneNumber' },
			{ title: 'טלפון נייד', fieldName: 'nvMobileNumber' },
			{ title: 'מייל', fieldName: 'nvEmail' },
            { title: 'סוג זכאות', fieldName: 'nvDepartmentName', weight: 0.8 },
            { title: 'בנק שעות', fieldName: 'nvStatusType' }
        ];
        //   $scope.getData();

        //$scope.calculateAge = function () {
        //    if (!$scope.member) return;
        //    var ageDifMs = Date.now() - $scope.member.dtDateBirth.getTime();
        //    var ageDate = new Date(ageDifMs);
        //    //$scope.member.iAge = Math.abs(ageDate.getUTCFullYear() - 1970);
        //};
    };

    $scope.messageList = function (person) {
        if (person.bChecked == true) {
            $scope.aMember = {
                iPersonId: person.iPersonId,
                nvName: person.nvFirstName + ' ' + person.nvLastName,
                nvEmail: person.nvEmail,
                nvMobileNumber: person.nvMobileNumber,
                bChecked: person.bChecked
            };
            $scope.listToSend.push($scope.aMember);
        }
        else {//if (person.bChecked == false) 
            var i = $scope.listToSend.length;
            // reversed loop because you change the array
            while (i--) {
                var p = $scope.listToSend[i];
                // If phone is checked, remove from list
                if (p.bChecked) {
                    $scope.listToSend.splice(i, 1);
                }
            }
        }
        if ($scope.listToSend.length > 0)
            $scope.haveSend = true;
        else
            $scope.haveSend = false;
    };

    $scope.sendMessage = function () {
        if ($scope.haveSend == false) {
            alerts.alert('יש לבחור נמענים לשליחת הודעה!', 'שגיאה');
            return;
        }
        $scope.newMessage.isOpen = true;
        $rootScope.$broadcast('displayDialog', { id: 'sendMassege' });
    };


    $scope.getData = function () {
        //$scope.newStudents = false;
        connect.post(true, connect.functions.GetABCBook,
            {
                iUserId: $rootScope.user.iUserId,
                iUserType: $rootScope.user.iUserType,
                bInCompanionship: $scope.displaymembers.inCompanionship
            },
            function (result) {
                $scope.volunteersAndStudents = result;
                $rootScope.volunteersAndStudents = $scope.volunteersAndStudents;
                $scope.isDataLoaded++;
            });
    };

    $scope.details = {};

    $scope.AddNew = function (type) {
        $scope.name = "אלפון";
        if (type == 1) {
            $scope.selected = {
                idVolunteer: -1,
                idStudent: null
            }
        }
        else if (type == 2)
            $scope.selected = {
                idStudent: -1,
                idVolunteer: null
            }
        $scope.selected.newMember = true;
		$rootScope.$broadcast('displayDialog', { id: 'editCustomer' });
	}
	$scope.EditCust = function ()
	{
		$scope.editCustomer = true;
		$rootScope.$broadcast('displayDialog', { id: 'newMember' });
	}

    $scope.exportToExcel = function () {
        $scope.$broadcast('exportToExcel', {
            id: $scope.gridIdentity,
            fileName: 'אלפון'
        });
    };

    $scope.deleteMember = function (item) {
        $rootScope.delete = true;
        connect.post(true, connect.functions.DeleteMember, { 'iPersonId': item.iPersonId, iUserId: $rootScope.user.iUserId }, function (result) {
            if (result) {
                //$scope.removeMember(item);
                $scope.getData();
            } else {
                alert('error!');
            }
        });
    }

    //$scope.removeMember = function (item) {
    //    var index = $scope.volunteersAndStudents.indexOf(item);
    //    $scope.volunteersAndStudents.splice(index, 1);
    //    $scope.isDataLoaded++;
    //}

    $scope.$watch('displaymembers.inCompanionship', function () {
        $scope.getData();
    });


    $scope.$on('insertNewMember', function (scopeDetails, data) {
        //$scope.volunteersAndStudents.push(data.newMember);
        //$scope.isDataLoaded++;
        $scope.getData();
    });

    $scope.$on('updateMemberInGrid', function (scopeDetails, data) {
        $scope.getData();
        //var item = $filter('filter')($scope.volunteersAndStudents, { iPersonId: data.member.iPersonId }, true)[0];
        //angular.extend(item, data.member);
        //$scope.isDataLoaded++;
    });

    //$scope.$on('updateCompanionshipStatus', function (data) {
    //    data.CompanionshipStatus = 
    //    //var item = $filter('filter')($scope.volunteersAndStudents, { iPersonId: data.member.iPersonId }, true)[0];
    //    //angular.extend(item, data.member);
    //    //$scope.isDataLoaded++;
    //});

    $rootScope.$on('deleteList', function () {
        $scope.listToSend = [];
        $scope.haveSend = false
    });

    $scope.prepareData();
}]);
