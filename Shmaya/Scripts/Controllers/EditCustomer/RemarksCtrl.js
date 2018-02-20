
	"use strict"
companionApp.controller('RemarksCtrl', ['$scope', '$rootScope', 'connect', 'codeTablesName', '$timeout', '$filter','alerts',
		function ($scope, $rootScope, connect, codeTablesName, $timeout, $filter,alerts) {
			//לא נרשמו הערות 
			$scope.noRemark = null;

			$scope.bIsNewRemarkOpen = false;
			$scope.showNewRemark = false;
			$scope.isCollapse = false;
			$scope.allRemarks = ['stam'];
			$scope.getAllRemarks = function () {
				connect.post(true, 'GetRemarks', { iUserId: $scope.user.iUserId }, function (result) {
					$scope.allRemarks = result;
					if ($scope.allRemarks.length == 0)
						$scope.noConversation = 'לא נרשמו הערות למשתמש זה';
				});
			}
			$scope.getAllRemarks();

			$scope.openNewRemark = function () {

				$scope.bIsNewRemarkOpen = true;
				$scope.newRemark = {
					iRemarkId: -1,
					iUserId: $scope.user.iUserId,
					iCreateUserId: $rootScope.user.iUserId,
					nvCoordinatorName: $scope.user.nvName,
					nvSubject: '',
					nvComment: '',
					dtCreateDate: new Date()
				};
			};

			$scope.saveRemark = function () {
				$scope.$broadcast('show-errors-check-validity');
				if (!$scope.newRemarkForm.$valid) {
					var savingStatus = "ישנם למלא ערכים תקינים בכל השדות";
					$rootScope.notification(savingStatus);
					alerts.alert("יש למלא ערכים תקינים בכל השדות");
					return;
				}
				connect.post(true, 'CreateNewRemark', { remark: $scope.newRemark }, function (result) {
					$scope.bIsNewRemarkOpen = false;
					$scope.newRemark = {};
					var savingStatus = "שיחה נוספה בהצלחה"
					$rootScope.notification(savingStatus);
					$scope.getAllRemarks();
				});

			}

			$scope.cancelRemark = function () {
				$scope.bIsNewRemarkOpen = false;
				$scope.newRemark = {};
			}




		}]);