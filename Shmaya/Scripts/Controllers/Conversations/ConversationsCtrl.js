"use strict"
companionApp.controller('ConversationsCtrl', ['$scope', '$rootScope', 'connect', 'codeTablesName', '$timeout', '$filter','alerts',
	function ($scope, $rootScope, connect, codeTablesName, $timeout, $filter, alerts) {
		//לא התבצעו שיחות 
        $scope.noConversation = null;

        $scope.bIsNewConversationOpen = false;
        //$scope.date = new Date();
        //$scope.date = $filter('date')($scope.date, 'dd-MM-yyyy');
        $scope.showNewConversation = false;
        $scope.isCollapse = false;
		//$scope.allConversations = ['stam'];
        
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

		$scope.getAllConversations = function () {
			connect.post(true, 'GetConversations', { iUserId: $scope.user.iUserId }, function (result) {
				$scope.allConversations = result;
				if ($scope.allConversations.length == 0)
					$scope.noConversation = 'לא התבצעו שיחות עם לקוח זה';
			});
		}
		$scope.getAllConversations();

        $scope.openNewConversation = function () {
            
            $scope.bIsNewConversationOpen = true;
            $scope.newConversation = {
                iConversationId: -1,
				iUserId: $scope.user.iUserId,
				iCreateUserId:$rootScope.user.iUserId,
                nvCoordinatorName: $scope.user.nvName,
                nvSubject: '',
                nvComment: '',
				dtCreateDate: new Date()
            };
        };
        
		$scope.saveConversation = function () {
			if (!$scope.newConversationForm.$valid) {
				$scope.$broadcast('show-errors-check-validity');
					var savingStatus = "ישנם למלא ערכים תקינים בכל השדות";
					$rootScope.notification(savingStatus);
					alerts.alert("יש למלא ערכים תקינים בכל השדות");
					return;
            }
			connect.post(true, 'CreateNewConversation', { conversation: $scope.newConversation/*, iCreateUserId: $rootScope.user.iUserId, iUserId: $scope.user.iUserId*/ }, function (result) {
                $scope.bIsNewConversationOpen = false;
				$scope.newConversation = {};
				$scope.noConversation = null;
                var savingStatus = "שיחה נוספה בהצלחה"
                $rootScope.notification(savingStatus);
                $scope.getAllConversations();
            });

        }

        $scope.cancelConversation = function () {
            $scope.bIsNewConversationOpen = false;
            $scope.newConversation = {};
		}

		


    }]);


