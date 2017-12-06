"use strict"
companionApp.controller('ABCBookCtrl', ['$scope', '$rootScope', 'connect', '$timeout', '$filter', 'alerts', 'createDialog', '$uibModal', 'codeTablesId', function ($scope, $rootScope, connect, $timeout, $filter, alerts, createDialog, $uibModal, codeTablesId) {

	$scope.variable = {
        openDialog1: false,
        openDialog2: false
    };
	
	$scope.prepareData = function () {
		$scope.getData();
		$scope.isDataLoadedCustomers = 0;
		$scope.isDataLoadedProviders = 0;
        $scope.gridIdentity = 'ABCBookCustomers';
        $scope.columnsCustomers = [
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
					$scope.ABCBookCustomers = $rootScope.ABCBookCustomers;
					$scope.ABCBookCustomers = $filter('filter')($rootScope.ABCBookCustomers, { iVolunteerId: null });
                    $scope.isDataLoaded++;
                },
                sortVolunteers: function () {
					$scope.ABCBookCustomers = $rootScope.ABCBookCustomers;
					$scope.ABCBookCustomers = $filter('filter')($rootScope.ABCBookCustomers, { iStudentId: null });
                    $scope.isDataLoaded++;
                },
                showAll: function () {
					$scope.ABCBookCustomers = $rootScope.ABCBookCustomers;
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
			{ title: 'ת.ז.', fieldName: 'nvID', weight: 0.5 },
			{ title: 'כתובת', fieldName: 'nvAdress' },
			{ title: 'טלפון', fieldName: 'nvPhoneNum' },
			{ title: 'טלפון נייד', fieldName: 'nvMobileNum' },
			{ title: 'מייל', fieldName: 'nvEmail' },
            { title: 'סוג זכאות', fieldName: 'nvDepartmentName', weight: 0.8 },
			{ title: 'בנק שעות', fieldName: 'nNumHours' }
        ];
		$scope.gridIdentity = 'ABCBookProviders';
		$scope.columnsProviders = [
			{
				fieldName: 'iId',
				title: 'עריכה',
				titleTemplate: '</div>' +
				'<div class="pass user-class-white-all" style="display: inline-block;" title="הצג הכל" ng-click="col.showAll()"></div>&nbsp' +
				'<div class="pass user-class-blue" style="display: inline-block;" title="הצג מתלמדים" ng-click="col.sortStudents()"></div>&nbsp' +
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
					$scope.ABCBookProviders = $rootScope.ABCBookProviders;
					$scope.ABCBookProviders = $filter('filter')($rootScope.ABCBookProviders, { iVolunteerId: null });
					$scope.isDataLoaded++;
				},
				sortVolunteers: function () {
					$scope.ABCBookProviders = $rootScope.ABCBookProviders;
					$scope.ABCBookProviders = $filter('filter')($rootScope.ABCBookProviders, { iStudentId: null });
					$scope.isDataLoaded++;
				},
				showAll: function () {
					$scope.ABCBookProviders = $rootScope.ABCBookProviders;
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
			{ title: 'ת.ז.', fieldName: 'nvID', weight: 0.5 },
			{ title: 'כתובת', fieldName: 'nvAdress' },
			{ title: 'טלפון', fieldName: 'nvPhoneNum' },
			{ title: 'טלפון נייד', fieldName: 'nvMobileNum' },
			{ title: 'מייל', fieldName: 'nvEmail' },
			{ title: 'שעות עבודה', fieldName: 'nNumHours', weight: 0.8 }
		];
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
		if ($scope.showCustomer) {
			connect.post(true, 'GetUsers',
				{ iUserType: 2 },
				function (result) {
					$scope.ABCBookCustomers = result;
					$scope.isDataLoadedCustomers++;
				});
		}
		else if (!$scope.showCustomer) {
			connect.post(true, 'GetUsers',
				{ iUserType: 38 },
				function (result) {
					$scope.ABCBookProviders = result;
					$scope.isDataLoadedProviders++;
				});
		}
    };
		
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
	
    $scope.prepareData();
}]);
