"use strict"
companionApp.controller('MonthCtrl', ['$scope', '$rootScope', 'connect', '$timeout', '$filter', 'alerts', 'createDialog', '$uibModal', 'codeTablesId',
	function ($scope, $rootScope, connect, $timeout, $filter, alerts, createDialog, $uibModal, codeTablesId, ) {
		$scope.dtGlobalDateBegin;// = $filter('date')($scope.date, 'dd-MM-yyyy');
		$scope.dtGlobalDateEnd; //= $filter('date')($scope.date, 'dd-MM-yyyy');
		$scope.iMonthId;

		$scope.saveDate = function ()
		{
			$scope.$broadcast('show-errors-check-validity');
			if (!$scope.formMonth.$valid)
			{
				var savingStatus = "ישנם למלא ערכים תקינים בכל השדות";
				$rootScope.notification(savingStatus);
				return;
			}
			connect.post(true, 'MonthUpdate', { iMonthId: $scope.iMonthId,dtGlobalDateBegin: $scope.dtGlobalDateBegin, dtGlobalDateEnd: $scope.dtGlobalDateEnd, iUserManagerId: $rootScope.user.iUserId }, function (result) {
				if (result && result > 0) {
					console.log('MontInsert:' + result);
					var savingStatus = "השינויים נשמרו במערכת";
					$rootScope.notification(savingStatus);
					alerts.alert('השינויים נשמרו במערכת')
					$scope.user.dialogIsOpen = false;
				}
				else {
					alert('ארעה שגיאה בלתי צפויה');
				}
			});
		}
	}]);