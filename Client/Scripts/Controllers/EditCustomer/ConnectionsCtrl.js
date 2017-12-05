"use strict"
companionApp.controller('ConnectionsCtrl', ['$scope', '$rootScope', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'codeTablesId',
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
			{ title: 'סטטוס', fieldName: 'nvFirstName' },
			{ title: 'מספר הזמנה', fieldName: 'nvLastName' },
			{ title: 'שם מתורגמן', fieldName: 'iAge', weight: 0.5 },
			{ title: 'סוג הזמנה', fieldName: 'nvAddress' },
			{ title: 'סוג תרגום', fieldName: 'nvCityType' },
			{ title: 'תאריך תרגום', fieldName: 'nvEmail' },
			{ title: 'שיוך לחודש', fieldName: 'nvPhoneNumber' },
			{ title: 'זמן תרגום', fieldName: 'nvMobileNumber' },
			{ title: 'שעת התחלה', fieldName: 'nvMobileNumber' }

		];
	}]);