"use strict"
companionApp.controller('RefundsCtrl', ['$scope', '$rootScope', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'codeTablesId',
	function ($scope, $rootScope, connect, $location, $filter, $timeout, codeTablesName, codeTablesId) {
		$scope.gridIdentity = 'volunteersAndStudents';
		$scope.columns = [
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
				title: 'אסמכתא',
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
			{ title: 'סוג מוצר', fieldName: 'nvFirstName' },
			{ title: 'שם מוצר', fieldName: 'nvLastName' },
			{ title: 'תאריך רכישה', fieldName: 'iAge', weight: 0.5 },
			{ title: 'סכום לתשלום', fieldName: 'nvAddress' },
			{ title: 'סך החזר', fieldName: 'nvCityType' },
			{ title: 'תאריך הזנה', fieldName: 'nvEmail' },
			{ title: 'שייך לחודש', fieldName: 'nvPhoneNumber' },
			{ title: 'הוזן ע"י', fieldName: 'nvMobileNumber' },
		
		];
	
	
}]);