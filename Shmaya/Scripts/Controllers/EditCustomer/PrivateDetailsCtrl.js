'use strict'
companionApp.controller('PrivateDetailsCtrl', ['$scope', '$rootScope', '$timeout', 'connect', '$filter', '$location', 'codeTablesName', 'tablesId', 'alerts', 'codeTablesId',
	function ($scope, $rootScope, $timeout, connect, $filter, $location, codeTablesName, tablesId, alerts, codeTablesId) {
		$scope.defDtResetHours = new Date();//$filter('date')(new Date(), 'dd/MM/yyyy');
		$scope.nInitBankHours = null;
	    $scope.checkIdentity = function () {
	        if (!$scope.isEdit) {
	            if (!$scope.user.nvId) return;
	            connect.post(true, 'CheckIdentity', { 'nvIdentity': $scope.user.nvId }, function (result) {
	                if (result && result > 0) {
	                    alerts.alert('מספר זהות קיים במערכת');
	                    $scope.user.nvId = '';
	                }
	            });
	        }
	    };

		$scope.saveDetails = function () {
			if ($scope.user.dtResetHours && $scope.user.dtResetCommunication) {
				var _MS_PER_DAY = 1000 * 60 * 60 * 24;
				var utc1 = Date.UTC($scope.user.dtResetHours.getFullYear(), $scope.user.dtResetHours.getMonth(), $scope.user.dtResetHours.getDate());
				var utc2 = Date.UTC($scope.user.dtResetCommunication.getFullYear(), $scope.user.dtResetCommunication.getMonth(), $scope.user.dtResetCommunication.getDate());

				$scope.difference = Math.floor((utc2 - utc1) / _MS_PER_DAY);
			
	        $scope.$broadcast('show-errors-check-validity');
			if (!$scope.formDetails.$valid || $scope.difference<0) {
	            var savingStatus = "ישנם למלא ערכים תקינים בכל השדות";
				$rootScope.notification(savingStatus);
				alerts.alert("יש למלא ערכים תקינים בכל השדות");
				console.log(JSON.stringify($scope.formDetails));
	            return;
			}



			// test it
			//var a = new Date("2017-01-01"),
			//	b = new Date("2017-07-25"),
			//	difference = dateDiffInDays($scope.user.dtResetHours, $scope.user.dtResetCommunication);

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
				$scope.user.dtResetHours = $scope.defDtResetHours;
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

			$scope.calculateNBankCommunication = function (iCommunicationCart)
			{
			$scope.user.nBankCommunication = $filter('filter')($scope.CommunicationCartList, { iCommunicationCart: iCommunicationCart }, true)[0].nTariff;
	    };

			$scope.calculateBankHours = function (iEntitlementTypeId) {
				if ($scope.user && $scope.user.iEntitlementTypeId)
					$scope.nInitBankHours = $filter('filter')($scope.EligibilityTableList, { iEntitlementTypeId: iEntitlementTypeId }, true)[0].nNumHours;
				$scope.user.nBankHours = $filter('filter')($scope.EligibilityTableList, { iEntitlementTypeId: iEntitlementTypeId }, true)[0].nNumHours;
			}
		};

		$scope.getData = function () {
	        connect.post(true, 'GetEligibiltyTable', {},
				function (result) {
					$scope.EligibilityTableList = result;
					if ($scope.EligibilityTableList != undefined)
						if ($scope.user && $scope.user.iEntitlementTypeId)
							$scope.nInitBankHours = $filter('filter')($scope.EligibilityTableList, { iEntitlementTypeId: $scope.user.iEntitlementTypeId }, true)[0].nNumHours;
				});
	        connect.post(true, 'GetCommunicationCart', {},
				function (result) {
				    $scope.CommunicationCartList = result;
				    if ($scope.user && $scope.user.iCommunicationCart)
						$scope.user.nBankCommunication = $filter('filter')($scope.CommunicationCartList, { iCommunicationCart: $scope.user.iCommunicationCart }, true)[0].nTariff;
				});
	       // $scope.user.dtResetCommunication = new Date();
	        $scope.userTypeList.splice(0, 2);

	    }
	    $scope.getData();
	}]);