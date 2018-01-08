'use strict'
companionApp.controller('PrivateDetailsCtrl', ['$scope', '$rootScope', '$timeout', 'connect', '$filter', '$location', 'codeTablesName', 'tablesId', 'alerts', 'codeTablesId',
	function ($scope, $rootScope, $timeout, connect, $filter, $location, codeTablesName, tablesId, alerts, codeTablesId) {
	    $scope.saveDetails = function () {
	        $scope.$broadcast('show-errors-check-validity');
	        if (!$scope.formDetails.$valid) {
	            var savingStatus = "ישנם למלא ערכים תקינים בכל השדות";
	            $rootScope.notification(savingStatus);
	            //return;
	        }

	        //$scope.lTempLanguage = $scope.user.lLanguage;
	        //$scope.user.lLanguage = {};
	        //$scope.lTempLanguage.forEach(function (language)
	        //{
	        //	if (language.iTypeId != undefined)
	        //		$scope.iTypeId = language.iTypeId
	        //	else
	        //		$scope.iTypeId = language
	        //	language = {
	        //		"iTypeId": $scope.iTypeId,
	        //		"iUserId": $scope.user.iUserId
	        //	}
	        //	$scope.user.lLanguage.push(language)
	        //})
	        console.log($scope.user.lLanguage)
	        if ($scope.isEdit == true) {
	            connect.post(true, 'UserUpdate', { user: $scope.user, iUserManagerId: $rootScope.user.iUserId }, function (result) {
	                if (result && result > 0) {
	                    console.log('UserUpdate:' + result);
	                    var savingStatus = "השינויים נשמרו בהצלחה";
	                    $rootScope.notification(savingStatus);
	                    $scope.prepareData();
	                    $scope.user.dialogIsOpen = false;
	                }
	                else {
	                    alert('ארעה שגיאה בלתי צפויה');
	                }
	            });
	        }
	        else {
	            connect.post(true, 'UserInsert', { user: $scope.user, iUserManagerId: $rootScope.user.iUserId, userType: $scope.userType }, function (result) {
	                if (result && result > 0) {
	                    console.log('UserInsert:' + result);
	                    var savingStatus = "השינויים נשמרו בהצלחה";
	                    $rootScope.notification(savingStatus);
	                    $scope.prepareData();
						$scope.newUser.dialogIsOpen = false;
	                }
	                else {
	                    alert('ארעה שגיאה בלתי צפויה');
	                }
	            });
	        }
	    }

	    //$scope.lTempLanguage = $scope.user.lLanguage;
	    //$scope.user.lLanguage = {};
	    //$scope.lTempLanguage.forEach(function (language)
	    //{
	    //	if (language.iTypeId != undefined)
	    //		$scope.iTypeId = language.iTypeId
	    //	else
	    //		$scope.iTypeId = language
	    //	language = {
	    //		"iTypeId": $scope.iTypeId,
	    //		"iUserId": $scope.user.iUserId
	    //	}
	    //	$scope.user.lLanguage.push(language)
	    //})

	    $scope.calculateNumHours = function (iCommunicationCart) {
	        $scope.user.nNumHours = $filter('filter')($scope.CommunicationCartList, { iCommunicationCart: iCommunicationCart }, true)[0].nTariff;
	    };

	    $scope.calculateBankHours = function (iEntitlementTypeId) {
	        $scope.user.nBankHours = $filter('filter')($scope.EligibilityTableList, { iEntitlementTypeId: iEntitlementTypeId }, true)[0].nNumHours;
	    };

	    $scope.getData = function () {
	        connect.post(true, 'GetEligibiltyTable', {},
				function (result) {
				    $scope.EligibilityTableList = result;
				});
	        connect.post(true, 'GetCommunicationCart', {},
				function (result) {
				    $scope.CommunicationCartList = result;
				    //$scope.user.iCommunicationCart = 1;
				    //$scope.user.nNumHours = $filter('filter')($scope.CommunicationCartList, { iCommunicationCart: $scope.user.iCommunicationCart }, true)[0].nTariff;
				});
	        $scope.userTypeList.splice(0, 2);

	    }
	    $scope.getData();
	}]);