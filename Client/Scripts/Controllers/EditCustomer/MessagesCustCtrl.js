"use strict"
		companionApp.controller('MessagesCustCtrl', ['$scope', '$rootScope', 'connect', 'codeTablesName', '$timeout', '$filter',
			function ($scope, $rootScope, connect, codeTablesName, $timeout, $filter) {
				$rootScope.newMessage1 = { dialogIsOpen: false };
				$rootScope.messageFromCust = false;
				//לא התבצעו שיחות 
				$scope.noMessage = null;

				$scope.bIsNewMessageOpen = false;
				$scope.showNewMessage = false;
				$scope.isCollapse = false;
				$scope.allMessages = null;


				$scope.getAllMessages = function () {
					connect.post(true, 'GetMessages', { iUserId: $scope.user.iUserId }, function (result) {
						$scope.allMessages = result;
						if (result.lengh == 0)
							$scope.noMessage = 'לא התבצעו שיחות עם חבר זה';
					});
				}
				$scope.getAllMessages();

				$scope.openNewMessage = function () {

					$rootScope.userToSend = $scope.user.iUserId;
					$rootScope.messageFromCust = true;
					$rootScope.newMessage1.dialogIsOpen = true;
					$rootScope.$broadcast('displayDialog', { id: 'newMessage1' });

					$scope.bIsNewMessageOpen = true;
					$scope.newMessage = {
						iMessage: -1,
						iUserId: $scope.user.iUserId,
						iCreateUserId: $rootScope.user.iUserId,
						nvCoordinatorName: $scope.user.nvName,
						nvSubject: '',
						nvComment: '',
						dtCreateDate: new Date()
					};
				};

				$scope.saveMessage = function () {
					$scope.$broadcast('show-errors-check-validity');
					if (!$scope.form.newMessageForm.$valid) return;

					connect.post(true, 'CreateNewMessage', { message: $scope.newMessage }, function (result) {
						$scope.bIsNewMessageOpen = false;
						$scope.newMessage = {};
						var savingStatus = "שיחה נוספה בהצלחה"
						$rootScope.notification(savingStatus);
						$scope.getAllMessages();
					});

				}
			
				$scope.cancelMessage = function () {
					$scope.bIsNewMessageOpen = false;
					$scope.newMessage = {};
				}
			}]);