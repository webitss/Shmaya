"use strict";
companionApp.controller('MessagesCtrl', ['$scope', '$rootScope', '$routeParams', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'alerts', 'codeTablesId',
    function ($scope, $rootScope, $routeParams, connect, $location, $filter, $timeout, codeTablesName, alerts, codeTablesId) {
    $scope.typeSelect = 1;
   // $rootScope.listToSend = undefined;
    $scope.sendTo = 2;
    $scope.userList = [];
    $scope.userList.push($scope.user)
    $scope.messageToSend =
	{
	    nvSubject: null,
	    nvMessage: null,
	    nvFrom: null,
	    iUserId: $scope.user.iUserId,
	    iCreateUserId: $rootScope.user.iUserId
		}
	$scope.sendMessage = function () {
		$scope.$broadcast('show-errors-check-validity');
		if (!$scope.massegeForm.$valid) {
			var savingStatus = "ישנם למלא ערכים תקינים בכל השדות";
			$rootScope.notification(savingStatus);
			alerts.alert("יש למלא ערכים תקינים בכל השדות");
			console.log(JSON.stringify($scope.formDetails));
			return;
		}
		//אם השליחה היא לקבוצה
		if ($rootScope.messageFromCust != true && $rootScope.listToSend == undefined /*&& scope.messageFromSelect != true*/) {
            if ($scope.sendTo == 1)
                $scope.sendTo = null;
            $scope.userType = $scope.sendTo;
			connect.post(true, 'GetUsers',
				{ iUserType: $scope.sendTo, iStatusId:1 },
				function (result) {
				    $scope.userList1 = result;
				    $scope.userList = [];
				    angular.forEach($scope.userList1, function (value) {
				        if (value.nvEmail != null && value.nvEmail != undefined)
				            $scope.userList.push(value);
				    });
				    $scope.len = $scope.userList.length;
				    //  אם נבחרה הודעת מייל
				    if ($scope.typeSelect == 1) {
				        connect.post(true, 'SendEmailToGroup', { lMember: $scope.userList, message: $scope.messageToSend, iUserId: $rootScope.user.iUserId },
							function (result) {
							    $scope.res = result;
								$scope.getAllMessages();
								alerts.alert('ההודעה נשלחה בהצלחה')
							},
							function () {
								alerts.alert('השליחה נכשלה');
							});
				    }
				        //sms אם נבחרה הודעת 
				    else {
				        connect.post(true, 'SendSMSToGroup', { lMember: $scope.userList, message: $scope.messageToSend, iUserId: $rootScope.user.iUserId },
							function (result) {
							    $scope.res = result;
								$scope.getAllMessages();
								alerts.alert('ההודעה נשלחה בהצלחה')
							},
							function () {
								alerts.alert('השליחה נכשלה');
							});
				    }

				});
		}

            //אם השליחה היא ללקוח בודד
        else {
            if ($rootScope.listToSend) {
                $scope.userList = [];
                $rootScope.listToSend.forEach(function (user) {
                    $scope.userList.push(user);
                })
            }

			if ($rootScope.messageFromCust == true) {
                $scope.userList = [];
                $scope.userList.push($scope.user);
            }

            //  אם נבחרה הודעת מייל
			if ($scope.typeSelect == 1) {
                connect.post(true, 'SendEmailToGroup', { lMember: $scope.userList, message: $scope.messageToSend, iUserId: $rootScope.user.iUserId },
					function (result) {
						$scope.res = result;
						if ($rootScope.messageFromCust == true) {
							$rootScope.messageFromCust = false;
							$scope.getAllMessages();
							$scope.newMessage1.dialogIsOpen = false;
						}
						if ($scope.newMessage2.dialogIsOpen == true)
							$scope.newMessage2.dialogIsOpen = false;
					    alerts.alert('ההודעה נשלחה בהצלחה')
					}, function () {
						alerts.alert('השליחה נכשלה');
						if ($scope.newMessage2.dialogIsOpen == true)
							$scope.newMessage2.dialogIsOpen = false;
						if ($rootScope.newMessage1.dialogIsOpen == true)
							$scope.newMessage1.dialogIsOpen = false;
					});
            }
                //sms אם נבחרה הודעת 
            else {
                connect.post(true, 'SendSMSToGroup', { lMember: $scope.userList, message: $scope.messageToSend, iUserId: $rootScope.user.iUserId },
					function (result) {
						$scope.res = result;
						if ($rootScope.messageFromCust == true)
						{
							$scope.getAllMessages();
						}
						if ($rootScope.messageFromCust == true)
							$scope.newMessage1.dialogIsOpen = false;
					});
            }
        }



    }
	$scope.sendSumMessage = function () {
        connect.post(true, 'SendSumMessage', { folderName: "sumMessage", url: "PdfToProviders?iUserId=12&dtDateBegin=01-01-2017&dtDateEnd=01-01-08" },
			function (result) {
			    if (result) {
			        console.log(result);
			        alert(result);
			    }
			    else
			        alert("not succese")
			});
    }


    $scope.getData = function () {

        $scope.userType = 3;
        connect.post(true, 'GetUsers',
            { iUserType: 3, iStatusId: 1 },
            function (result) {
                $scope.providersList = result;
            });
    };

}]);