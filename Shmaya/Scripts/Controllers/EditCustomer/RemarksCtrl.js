
	"use strict"
companionApp.controller('RemarksCtrl', ['$scope', '$rootScope', 'connect', 'codeTablesName', '$timeout', '$filter','alerts',
		function ($scope, $rootScope, connect, codeTablesName, $timeout, $filter,alerts) {
			//לא התבצעו שיחות 
			$scope.noRemark = null;

			$scope.bIsNewRemarkOpen = false;
			//$scope.date = new Date();
			//$scope.date = $filter('date')($scope.date, 'dd-MM-yyyy');
			$scope.showNewRemark = false;
			$scope.isCollapse = false;
			$scope.allRemarks = ['stam'];

			//$scope.conversation = {
			//    nvSubject: undefined,
			//    nvComment: undefined,
			//    dtNextConversation: undefined,
			//    iStatusConversationType: undefined
			//};
			//$scope.User = $rootScope.user.iUserId;

			//$scope.selected



			//$scope.oneAtATime = false;

			//  $scope.conversation.dtConversationDate = $filter('date')($scope.conversation.dtConversationDate, 'dd-MM-yyyy');

			$scope.getAllRemarks = function () {
				connect.post(true, 'GetRemarks', { iUserId: $scope.user.iUserId }, function (result) {
					$scope.allRemarks = result;
					if (result.lengh == 0)
						$scope.noRemark = 'לא התבצעו שיחות עם חבר זה';
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
				if (!$scope.form.newRemarkForm.$valid) {
				    alerts.alert('ערכים נחוצים חסרים או שגויים');
				    return;
				}
				connect.post(true, 'CreateNewRemark', { remark: $scope.newRemark/*, iCreateUserId: $rootScope.user.iUserId, iUserId: $scope.user.iUserId*/ }, function (result) {
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