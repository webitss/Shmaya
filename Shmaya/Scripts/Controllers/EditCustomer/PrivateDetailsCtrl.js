'use strict'
companionApp.controller('PrivateDetailsCtrl', ['$scope', '$rootScope', '$timeout', 'connect', '$filter', '$location', 'codeTablesName', 'tablesId', 'alerts', 'codeTablesId', 'createDialog',
	function ($scope, $rootScope, $timeout, connect, $filter, $location, codeTablesName, tablesId, alerts, codeTablesId, createDialog) {
		$scope.difference = 0;
		$scope.tmpBankHours;
		$scope.nInitBankHours2 = $scope.user.nInitBankHours;
		if (!$scope.isEdit) {
			$scope.user = {
				dtCreateDate: new Date(),
				lOrderType: [],
				lLanguage: []

			};
		}

		$scope.checkIdentity = function ()
		{
			if (!$scope.isEdit)
			{
	            if (!$scope.user.nvId) return;
				connect.post(true, 'CheckIdentity', { 'nvIdentity': $scope.user.nvId }, function (result)
				{
					if (result && result > 0)
					{
	                    alerts.alert('מספר זהות קיים במערכת');
	                    $scope.user.nvId = '';
	                }
	            });
	        }
	    };

		$scope.saveDetails = function () {
			if ($scope.user.dtCreateDate && $scope.user.dtResetCommunication) {
				var _MS_PER_DAY = 1000 * 60 * 60 * 24;
				var utc1 = Date.UTC($scope.user.dtCreateDate.getFullYear(), $scope.user.dtCreateDate.getMonth(), $scope.user.dtCreateDate.getDate());
				var utc2 = Date.UTC($scope.user.dtResetCommunication.getFullYear(), $scope.user.dtResetCommunication.getMonth(), $scope.user.dtResetCommunication.getDate());

				$scope.difference = Math.floor((utc2 - utc1) / _MS_PER_DAY);
			}

			$scope.$broadcast('show-errors-check-validity');
			if (!$scope.formDetails.$valid) {
				var savingStatus = "ישנם למלא ערכים תקינים בכל השדות";
				$rootScope.notification(savingStatus);
				alerts.alert("יש למלא ערכים תקינים בכל השדות");
				return;
			}
			if ($scope.difference < 0)
			{
				var savingStatus = "אין להזין תאריך תחילת זכאות לפני תאריך הצטרפות";
				$rootScope.notification(savingStatus);
				alerts.alert("אין להזין תאריך תחילת זכאות לפני תאריך הצטרפות");
				return;
			}
			if ($scope.isEdit == true) {
				if ($scope.tmpBankHours!=undefined)
					$scope.user.nBankHours += $scope.tmpBankHours - $scope.nInitBankHours2;
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
				if ($scope.tmpBankHours != undefined)
					$scope.user.nBankHours += $scope.tmpBankHours - $scope.nInitBankHours2;
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
				$scope.nInitBankCommunication = $filter('filter')($scope.CommunicationCartList, { iCommunicationCart: iCommunicationCart }, true)[0].nTariff;
				$scope.user.nBankCommunication = 0;
		    };

			$scope.calculateBankHours = function (iEntitlementTypeId)
			{
				$scope.user.nInitBankHours = $filter('filter')($scope.EligibilityTableList, { iEntitlementTypeId: iEntitlementTypeId }, true)[0].nNumHours;
				$scope.user.nBankHours = $filter('filter')($scope.EligibilityTableList, { iEntitlementTypeId: iEntitlementTypeId }, true)[0].nNumHours;
			}

			$scope.addBankHours = function (num)
			{
				$scope.tmpBankHours = num;
			}


			$scope.getData = function () {
					connect.post(true, 'GetUserCodeTables', { iUserId: $rootScope.user.iUserId }, function (result) {
						$scope.codeTables = result;
						$scope.languageList = $filter('filter')(result, { Key: 'language' }, true)[0].Value;
						$scope.userTypeList = $filter('filter')(result, { Key: 'userType' }, true)[0].Value;
						$scope.userTypeList.splice(0, 2);
				});
	        connect.post(true, 'GetEligibiltyTable', {},
				function (result) {
					$scope.EligibilityTableList = result;
					if ($scope.EligibilityTableList != undefined)
						if ($scope.user && $scope.user.iEntitlementTypeId) {
						}
				});
	        connect.post(true, 'GetCommunicationCart', {},
				function (result) {
					$scope.CommunicationCartList = result;
					$scope.CommunicationCartList.forEach(function (item) {

						if (item.iCommunicationCart == $scope.user.iCommunicationCart)
							$scope.sumCommunication = item.nTariff;
					})

				    if ($scope.user && $scope.user.iCommunicationCart)
					  $scope.nInitBankCommunication = $filter('filter')($scope.CommunicationCartList, { iCommunicationCart: $scope.user.iCommunicationCart }, true)[0].nTariff;
				});
	        $scope.userTypeList.splice(0, 2);

	    }
	    $scope.getData();
	}]);