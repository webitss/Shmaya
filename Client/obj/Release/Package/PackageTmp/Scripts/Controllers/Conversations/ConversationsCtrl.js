"use strict"
companionApp.controller('ConversationsCtrl', ['$scope', '$rootScope', 'connect', 'codeTablesName', '$timeout', '$filter',
	function ($scope, $rootScope, connect, codeTablesName, $timeout, $filter) {
		//לא התבצעו שיחות 
        $scope.noConversation = null;

        $scope.bIsNewConversationOpen = false;
        //$scope.date = new Date();
        //$scope.date = $filter('date')($scope.date, 'dd-MM-yyyy');
        $scope.showNewConversation = false;
        $scope.isCollapse = false;
		$scope.allConversations = ['stam'];
        
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
				if (result.lengh == 0)
					$scope.noConversation = 'לא התבצעו שיחות עם חבר זה';
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
            $scope.$broadcast('show-errors-check-validity');
            if (!$scope.form.newConversationForm.$valid) return;

			connect.post(true, 'CreateNewConversation', { conversation: $scope.newConversation/*, iCreateUserId: $rootScope.user.iUserId, iUserId: $scope.user.iUserId*/ }, function (result) {
                $scope.bIsNewConversationOpen = false;
                $scope.newConversation = {};
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


