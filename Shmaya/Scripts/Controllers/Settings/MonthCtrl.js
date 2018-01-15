"use strict"
companionApp.controller('MonthCtrl', ['$scope', '$rootScope', 'connect', '$timeout', '$filter', 'alerts', 'createDialog', '$uibModal', 'codeTablesId',
	function ($scope, $rootScope, connect, $timeout, $filter, alerts, createDialog, $uibModal, codeTablesId, ) {
		//$scope.dtGlobalDateBegin;
		//$scope.dtGlobalDateEnd; 
		//$scope.iMonthId;

		//$scope.saveDate = function ()
		//{
		//	$scope.$broadcast('show-errors-check-validity');
		//	if (!$scope.formMonth.$valid)
		//	{
		//		var savingStatus = "ישנם למלא ערכים תקינים בכל השדות";
		//		$rootScope.notification(savingStatus);
		//		return;
		//	}
		//	connect.post(true, 'MonthUpdate', { iMonthId: $scope.iMonthId,dtGlobalDateBegin: $scope.dtGlobalDateBegin, dtGlobalDateEnd: $scope.dtGlobalDateEnd, iUserManagerId: $rootScope.user.iUserId }, function (result) {
		//		if (result && result > 0) {
		//			console.log('MontInsert:' + result);
		//			var savingStatus = "השינויים נשמרו במערכת";
		//			$rootScope.notification(savingStatus);
		//			alerts.alert('השינויים נשמרו במערכת')
		//			$scope.user.dialogIsOpen = false;
		//		}
		//		else {
		//			alert('ארעה שגיאה בלתי צפויה');
		//		}
		//	});
		//}
		$scope.newMonth = {};
		$scope.prepareData = function ()
		{
			$scope.getData();
			$scope.isDataLoaded = 0;
			$scope.gridIdentity = 'monthesList';
			$scope.columns =
				[
					{
						fieldName: 'iPaymentId',
						title: 'עריכה',
						template: '<div class="pass user-class glyphicon glyphicon-pencil"  ng-click="col.clickEvent(item)"></div>',
						clickEvent: function (month)
						{
							if (month.item == undefined) return;
							$scope.month2 = month.item;
							$scope.pop = "<label>בחר חודש ושנה</label><form-dropdown ng-model='month2.iMonthYearId' enablesearch='false' data='monthYearList' identityfield='iId' datafield='nvName' required></form-dropdown>" +
								"<label>מתאריך</label><input type='date' class='form-control' required ng-model='month2.dtGlobalDateBegin' required/>" +
								"<label>עד תאריך</label><input type='date' class='form-control' required ng-model='month2.dtGlobalDateEnd' required/>";
							alerts.custom($scope.pop, 'הוספת הגדרה', $scope,
								function () {
									$scope.monthToSend = angular.copy($scope.month2);
									$scope.monthToSend.dtGlobalDateBegin = angular.copy($scope.month2.dtGlobalDateBegin_original);
									$scope.monthToSend.dtGlobalDateEnd = angular.copy($scope.month2.dtGlobalDateEnd_original);
									connect.post(true, 'MonthUpdate', { month: $scope.monthToSend, iUserManagerId: $rootScope.user.iUserId }, function (result)
									{
										if (result && result > 0)
										{
											console.log('MonthUpdate:' + result);
											var savingStatus = "השינויים נשמרו בהצלחה";
											$rootScope.notification(savingStatus);
											//$scope.user.dialogIsOpen = false;
										}
										else
										{
											alert('ארעה שגיאה בלתי צפויה');
										}
									});
								}, function () { }

							);
						},
						weight: 0.5,
						filter: false,
						sort: false
					},
					{ title: 'חודש ושנה', fieldName: 'iMonthYearId' },
					{ title: 'מתאריך', fieldName: 'dtGlobalDateBegin',type:'date' },
					{ title: 'עד תאריך', fieldName: 'dtGlobalDateEnd', type: 'date' }
				];
		};

		$scope.getData = function () {
			connect.post(true, 'GetMonthes', {},
				function (result) {
					$scope.monthesList = result;
					$scope.isDataLoaded++;
				});
		}

		$scope.AddNewMonth = function () {
			$scope.pop = "<label>חודש ושנה</label><input type='text' class='form-control' required ng-model='newMonth.iMonthYearId' required/>"  +
				"<label>מתאריך</label><input type='date' class='form-control' required ng-model='newMonth.dtGlobalDateBegin' required/>" +
				"<label>עד תאריך</label><input type='date' class='form-control' required ng-model='newMonth.dtGlobalDateEnd' required/>";
			alerts.custom($scope.pop, 'הוספת ערך', $scope,
				function () {
					connect.post(true, 'monthInsert', { month: $scope.newMonth, iUserManagerId: $rootScope.user.iUserId }, function (result) {
						if (result && result > 0) {
							console.log('monthInsert:' + result);
							var savingStatus = "השינויים נשמרו בהצלחה";
							$rootScope.notification(savingStatus);
							$scope.newMonth = {};
							//$scope.newEligibility.dialogIsOpen = false;
							$scope.getData();
						}
						else {
							alert('ארעה שגיאה בלתי צפויה');
						}
					});
				}, function () { }

			);
		}

		$scope.prepareData();
	}]);