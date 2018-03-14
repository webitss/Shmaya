"use strict"
companionApp.controller('ConversationsCtrl', ['$scope', '$rootScope', 'connect', 'codeTablesName', '$timeout', '$filter','alerts',
	function ($scope, $rootScope, connect, codeTablesName, $timeout, $filter, alerts) {
		//לא התבצעו שיחות 
        $scope.noConversation = null;

        $scope.bIsNewConversationOpen = false;
        $scope.showNewConversation = false;
        $scope.isCollapse = false;
		$scope.getAllConversations = function () {
			connect.post(true, 'GetConversations', { iUserId: $scope.user.iUserId }, function (result) {
				$scope.allConversations = result;
				if ($scope.allConversations.length == 0)
					$scope.noConversation = 'לא התבצעו שיחות עם משתמש זה';
			});
		}
		$scope.getAllConversations();
		//יצירת שיחה חדשה
        $scope.openNewConversation = function () {
            $scope.bIsNewConversationOpen = true;
            $scope.newConversation = {
                iConversationId: -1,
				iUserId: $scope.user.iUserId,
				iCreateUserId:$rootScope.user.iUserId,
                nvSubject: '',
                nvComment: '',
				dtCreateDate: new Date()
            };
        };
        
		$scope.saveConversation = function () {
			if (!$scope.newConversationForm.$valid) {
				$scope.$broadcast('show-errors-check-validity');
					alerts.alert("יש למלא ערכים תקינים בכל השדות");
					return;
            }
			connect.post(true, 'CreateNewConversation', { conversation: $scope.newConversation }, function (result) {
                $scope.bIsNewConversationOpen = false;
				$scope.newConversation = {};
				$scope.noConversation = null;
                $scope.getAllConversations();
            });

        }

        $scope.cancelConversation = function () {
            $scope.bIsNewConversationOpen = false;
            $scope.newConversation = {};
		}

		


    }]);


