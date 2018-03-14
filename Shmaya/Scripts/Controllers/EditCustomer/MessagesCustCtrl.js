"use strict"
		companionApp.controller('MessagesCustCtrl', ['$scope', '$rootScope', 'connect', 'codeTablesName', '$timeout', '$filter',
			function ($scope, $rootScope, connect, codeTablesName, $timeout, $filter) {
				$rootScope.newMessage1 = { dialogIsOpen: false };
				$rootScope.messageFromCust = false;
				//לא נשלחו הודעות 
				$scope.noConversation = null;

				$scope.bIsNewMessageOpen = false;
				$scope.showNewMessage = false;
				$scope.isCollapse = false;
				$scope.allMessages = null;


				$scope.getAllMessages = function () {
					connect.post(true, 'GetMessages', { iUserId: $scope.user.iUserId }, function (result) {
						$scope.allMessages = result;
						if ($scope.allMessages.length == 0)
							$scope.noConversation = 'לא נשלחו הודעות למשתמש זה';
					});
				}
				$scope.getAllMessages();

				$scope.openNewMessage = function () {

					$rootScope.userToSend = $scope.user.iUserId;
					$rootScope.messageFromCust = true;
					$scope.newMessage1.dialogIsOpen = true;
					$rootScope.$broadcast('displayDialog', { id: 'newMessage1' });

					$scope.bIsNewMessageOpen = true;
					$scope.newMessage = {
						iMessage: -1,
						iUserId: $scope.user.iUserId,
						iCreateUserId: $rootScope.user.iUserId,
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
						$scope.noConversation = null;
						$scope.getAllMessages();
					});

				}
			
				$scope.cancelMessage = function () {
					$scope.bIsNewMessageOpen = false;
					$scope.newMessage = {};
				}
			}]);