﻿"use strict";
companionApp.controller('MessagesCtrl', ['$scope', '$rootScope', '$routeParams', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'alerts', 'codeTablesId', function ($scope, $rootScope, $routeParams, connect, $location, $filter, $timeout, codeTablesName, alerts, codeTablesId) {
	$scope.typeSelect = 1;
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
	
	$scope.sendMessage = function ()
	{
		
		//אם השליחה היא לקבוצה
		if ($scope.newMessage1 != true && $rootScope.listToSend == undefined) {
			if ($scope.sendTo == 1)
				$scope.sendTo = null;
			$scope.userType = $scope.sendTo;
			connect.post(true, 'GetUsers',
				{ iUserType: $scope.sendTo },
				function (result) {
					$scope.userList = result;
					$scope.len = $scope.userList.length;
					//  אם נבחרה הודעת מייל
					if ($scope.typeSelect == 1) {
						connect.post(true, 'SendEmailToGroup', { lMember: $scope.userList, message: $scope.messageToSend, iUserId: $rootScope.user.iUserId },
							function (result) {
								$scope.res = result;
								$scope.getAllMessages();
								$scope.newMessage1 = false;
							});
					}
					//sms אם נבחרה הודעת 
					else {
						connect.post(true, 'SendSMSToGroup', { lMember: $scope.userList, message: $scope.messageToSend, iUserId: $rootScope.user.iUserId },
							function (result) {
								$scope.res = result;
								$scope.getAllMessages();
								$scope.newMessage1 = false;
							});
					}

				});
		}
		//אם השליחה היא ללקוח בודד
		else
		{
			if ($rootScope.listToSend)
			{
				$scope.userList = [];
				$rootScope.listToSend.forEach(function (user) {
					$scope.userList.push(user);
				})
			}
			
			//  אם נבחרה הודעת מייל
			if ($scope.typeSelect == 1 ) {
				connect.post(true, 'SendEmailToGroup', { lMember: $scope.userList, message: $scope.messageToSend, iUserId: $rootScope.user.iUserId },
					function (result) {
						$scope.res = result;
						$scope.getAllMessages();
						$scope.newMessage1 = false;
					});
			}
			//sms אם נבחרה הודעת 
			else {
				connect.post(true, 'SendSMSToGroup', { lMember: $scope.userList, message: $scope.messageToSend, iUserId: $rootScope.user.iUserId },
					function (result) {
						$scope.res = result;
						$scope.getAllMessages();
						$scope.newMessage1 = false;
					});
			}
		}

	
		
	}
	$scope.sendSumMessage = function ()
	{
		//$scope.dtStartDate;
		//$scope.dtEndDate;
	}


	//$scope.getData = function (num)
	//{
		
	//		$scope.userType = num;
	//		connect.post(true, 'GetUsers',
	//			{ iUserType: num },
	//			function (result) {
	//				$scope.userList = result;
	//			});
	//};

}]);