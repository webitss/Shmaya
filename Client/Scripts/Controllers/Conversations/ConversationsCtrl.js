"use strict"
companionApp.controller('ConversationsCtrl', ['$scope', '$rootScope', 'connect', 'codeTablesName', '$timeout', '$filter',
    function ($scope, $rootScope, connect, codeTablesName, $timeout, $filter) {
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
        $scope.User = $rootScope.user.iUserId;

        //$scope.selected

        if ($scope.selected == undefined) {
            $scope.selected = $scope.searchMember;
        }

        $scope.getNextDate = function () {
            connect.post(true, connect.functions.GetExistingCompanionship, { iStudentId: $scope.selected.idStudent, iVolunteerId: $scope.selected.idVolunteer }, function (result1) {
                connect.post(true, connect.functions.getNextConversation, { iCompanionshipId: result1.iCompanionshipId }, function (result2) {
                    if (result2 == -100)
                        $scope.iNumDaysNextConversation = 20;
                    else
                        $scope.iNumDaysNextConversation = result2;
                });
            });
        }

        //$scope.oneAtATime = false;

        $scope.status = {
            isCustomHeaderOpen: false,
            isFirstOpen: false,
            isFirstDisabled: false
        };

        //  $scope.conversation.dtConversationDate = $filter('date')($scope.conversation.dtConversationDate, 'dd-MM-yyyy');

        $scope.getAllConversations = function () {
            if ($scope.selected.idStudent || $scope.selected.idVolunteer) {
                connect.post(true, connect.functions.GetAllConversations, { iStudentId: $scope.selected.idStudent, iVolunteerId: $scope.selected.idVolunteer, iCompanionshipId: null }, function (result) {
                    $scope.allConversations = result;
                    if (result.lengh == 0)
                        $scope.noConversation = 'לא התבצעו שיחות עם חבר זה';
                });
            }
        }
        $scope.getAllConversations();
        $scope.getNextDate();
        $scope.openNewConversation = function () {
            
            $scope.bIsNewConversationOpen = true;
            var dtNextConversation = new Date();
            dtNextConversation.setDate(dtNextConversation.getDate() + $scope.iNumDaysNextConversation);
            $scope.newConversation = {
                iConversationId: -1,
                iCompanionshipId: null,
                iCoordinatorId: $rootScope.user.iCoordinatorId,
                nvCoordinatorName: $scope.user.nvName,
                nvSubject: '',
                nvComment: '',
                dtConversationDate: new Date(),
                dtNextConversation: dtNextConversation,
                iStatusConversationType: null,
                iVolunteerId: $scope.selected.idVolunteer,
                iStudentId: $scope.selected.idStudent
            };
        };
        
        $scope.saveConversation = function () {
            $scope.$broadcast('show-errors-check-validity');
            if (!$scope.form.newConversationForm.$valid) return;

            connect.post(true, connect.functions.CreateNewConversation, { conversation: $scope.newConversation, iUserId: $rootScope.user.iUserId }, function (result) {
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


