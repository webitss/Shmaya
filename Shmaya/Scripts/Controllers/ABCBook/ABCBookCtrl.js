"use strict"
companionApp.controller('ABCBookCtrl', ['$scope', '$rootScope', 'connect', '$timeout', '$filter', 'alerts', 'createDialog', '$uibModal', 'codeTablesId',
	function ($scope, $rootScope, connect, $timeout, $filter, alerts, createDialog, $uibModal, codeTablesId) {

	    $scope.variable = {
	        openDialog1: false,
	        openDialog2: false
	    };
	    $scope.isEdit;
	    $scope.userType;
	    $scope.user = {};
	    $rootScope.listToSend = [];
		$scope.newUser = { dialogIsOpen: false };
		$scope.user = { dialogIsOpen: false };
	    $rootScope.newMessage2 = { dialogIsOpen: false };
		$scope.messageFromSelect = false;

		$scope.prepareData = function () {
			$scope.getData();
			$scope.isDataLoadedAdministrator = 0;
	        $scope.isDataLoadedCustomers = 0;
			$scope.isDataLoadedProviders = 0;
	        $scope.gridIdentity = 'ABCBookCustomers';
	        $scope.columnsCustomers = [
				{
				    fieldName: 'iUserId',
				    title: 'עריכה',
				    template: '<div class="pass user-class glyphicon glyphicon-pencil" ng-click="col.clickEvent(item)"></div>',
					clickEvent: function (user)
					{
						//if (user.item == undefined)
						if (!isNaN(parseFloat(user.iUserId)) && !isNaN(user.iUserId - 0))
						{
							//$scope.user = angular.copy(user);
							connect.post(true, 'GetUsers', { iUserId: user.iUserId },
								function (result) {
									$scope.user = result[0];
									$scope.isEdit = true;
									$scope.user.dialogIsOpen = true;
									$rootScope.$broadcast('displayDialog', { id: $scope.user.iUserId });
								});
						}
				    },
				    weight: 0.5,
				    filter: false,
				    sort: false
				},
				{
				    fieldName: 'iUserId',
				    title: 'מחיקה',
				    template: '<div class=\'pass glyphicon glyphicon-remove color-text-gray\' ng-click=\'col.deleteACustomer(item)\'></div>',
				    deleteACustomer: function (item) {
						alerts.confirm('האם להפוך לקוח זה ללא פעיל? ', alerts.titles.message, function () {
							item.userType = 2;
				            $scope.deleteCustomer(item);
				        }, function () {
				        });
				    },
				    weight: 0.5,
				    filter: false,
				    sort: false
				},
				{
				    title: 'בחירה',
				    template: '<input type="checkbox" ng-change="col.addMemberToMessage(item)" style="margin-right: 16px;" ng-model="item.bChecked"/>',
				    addMemberToMessage: function (item) {
				        $scope.messageList(item);
				    },
				    weight: 0.5,
				    filter: false,
				    sort: false,
				    type: 'choose'
				},
				{ title: 'שם פרטי', fieldName: 'nvFirstName' },
				{ title: 'שם משפחה', fieldName: 'nvLastName' },
				{ title: 'ת.ז.', fieldName: 'nvID' },
				{ title: 'כתובת', fieldName: 'nvAdress' },
				{ title: 'טלפון', fieldName: 'nvPhoneNum' },
				{ title: 'טלפון נייד', fieldName: 'nvMobileNum' },
				{ title: 'מייל', fieldName: 'nvEmail' },
				{ title: 'סוג זכאות', fieldName: 'nvEntitlementType', weight: 0.8 },
				{ title: 'בנק שעות', fieldName: 'nBankHours' }
	        ];
	        $scope.gridIdentity = 'ABCBookProviders';
	        $scope.columnsProviders = [
				{
				    fieldName: 'iUserId',
				    title: 'עריכה',
				    template: '<div class="pass user-class glyphicon glyphicon-pencil" ng-click="col.clickEvent(item)"></div>',
					clickEvent: function (user) {
						//if (user.item == undefined)
						if (!isNaN(parseFloat(user.iUserId)) && !isNaN(user.iUserId - 0)) {
							//$scope.user = angular.copy(user);
							connect.post(true, 'GetUsers', { iUserId: user.iUserId },
								function (result) {
									$scope.user = result[0];
									$scope.isEdit = true;
									$scope.user.dialogIsOpen = true;
									$rootScope.$broadcast('displayDialog', { id: $scope.user.iUserId });
								});
						}
				    },
				    weight: 0.5,
				    filter: false,
				    sort: false
				},
				{
				    fieldName: 'iUserId',
				    title: 'מחיקה',
				    template: '<div class=\'pass glyphicon glyphicon-remove color-text-gray\' ng-click=\'col.deleteACustomer(item)\'></div>',
				    deleteACustomer: function (item) {
						alerts.confirm('האם להפוך נותן שירות זה ללא פעיל? ', alerts.titles.message, function () {
							item.userType = 3;
				            $scope.deleteCustomer(item);
				        }, function () {
				        });
				    },
				    weight: 0.5,
				    filter: false,
				    sort: false
				},
				{
				    title: 'בחירה',
				    template: '<input type="checkbox" ng-change="col.addMemberToMessage(item)" style="margin-right: 18px;" ng-model="item.bChecked"/>',
				    addMemberToMessage: function (item) {
				        $scope.messageList(item);
				    },
				    weight: 0.5,
				    filter: false,
				    sort: false,
				    type: 'choose'
				},
				{ title: 'סוג', fieldName: 'nvOrdersType' },
				{ title: 'שם פרטי', fieldName: 'nvFirstName' },
				{ title: 'שם משפחה', fieldName: 'nvLastName' },
				{ title: 'ת.ז.', fieldName: 'nvID', weight: 0.8 },
				{ title: 'כתובת', fieldName: 'nvAdress' },
				{ title: 'טלפון', fieldName: 'nvPhoneNum' },
				{ title: 'טלפון נייד', fieldName: 'nvMobileNum' },
				{ title: 'מייל', fieldName: 'nvEmail' },
				{ title: 'שעות עבודה', fieldName: 'nNumHours', weight: 0.8 }
	        ];


	        $scope.gridIdentity = 'ABCBookAdministrator';
	        $scope.columns = [
				{
					fieldName: 'iUserId',
					title: 'עריכה',
					template: '<div class="pass user-class glyphicon glyphicon-pencil" ng-click="col.clickEvent(item)"></div>',
					clickEvent: function (user)
					{
						if (!isNaN(parseFloat(user.iUserId)) && !isNaN(user.iUserId - 0)) {
							connect.post(true, 'GetUsers', { iUserId: user.iUserId },
								function (result) {
									$scope.user = result[0];
									$scope.isEdit = true;
									$scope.user.dialogIsOpen = true;
									$rootScope.$broadcast('displayDialog', { id: $scope.user.iUserId });
								});
						}
					},
					weight: 0.5,
					filter: false,
					sort: false
				},
                {
                    fieldName: 'iUserId',
                    title: 'מחיקה',
                    template: '<div class=\'pass glyphicon glyphicon-remove color-text-gray\' ng-click=\'col.deleteAAdministrator(item)\'></div>',
                    deleteAAdministrator: function (item) {
						alerts.confirm('האם להפוך מנהל זה ללא פעיל? ', alerts.titles.message, function () {
							item.userType = 1;
							$scope.deleteCustomer(item);
                        }, function () {
                        });
                    },
                    weight: 0.5,
                    filter: false,
                    sort: false
                },
                {
                    title: 'בחירה',
                    template: '<input type="checkbox" ng-change="col.addMemberToMessage(item)" style="margin-right: 23px;" ng-model="item.bChecked"/>',
                    addMemberToMessage: function (item) {
                        $scope.messageList(item);
                    },
                    weight: 0.5,
                    filter: false,
                    sort: false,
                    type: 'choose'
                },
                { title: 'שם פרטי', fieldName: 'nvFirstName' },
                { title: 'שם משפחה', fieldName: 'nvLastName' },
                { title: 'ת.ז.', fieldName: 'nvID', weight: 0.7 },
                { title: 'כתובת', fieldName: 'nvAdress' },
                { title: 'טלפון', fieldName: 'nvPhoneNum' },
                { title: 'טלפון נייד', fieldName: 'nvMobileNum', weight: 0.7 },
                { title: 'מייל', fieldName: 'nvEmail', weight: 1.2 },
                { title: 'עוסק', fieldName: 'nvWorkerType', weight: 0.7 }
	        ];
	    };

	    $scope.initData = function () {
	        $rootScope.listToSend = [];
	        if ($scope.showCustomer) {
	            angular.forEach($scope.ABCBookCustomers, function (item) {
	                if (item.bChecked) {
	                    item.bChecked = !item.bChecked
	                }
	            });
	        }
	        else if ($scope.showAdmin) {
	            angular.forEach($scope.ABCBookAdministrator, function (item) {
	                if (item.bChecked) {
	                    item.bChecked = !item.bChecked
	                }
	            });
	        }
	        else if (!$scope.showCustomer) {
	            angular.forEach($scope.ABCBookProviders, function (item) {
	                if (item.bChecked) {
	                    item.bChecked = !item.bChecked
	                }
	            });
	        }

	    };

	    $scope.messageList = function (user) {
	        if (user.bChecked == true) {
	            $scope.aMember = {
	                iUserId: user.iUserId,
	                nvName: user.nvFirstName + ' ' + user.nvLastName,
	                nvEmail: user.nvEmail,
	                nvMobileNumber: user.nvMobileNumber,
	                bChecked: user.bChecked
	            };
	            $rootScope.listToSend.push($scope.aMember);
	        }
	        else {//if (user.bChecked == false) 
	            var i = $rootScope.listToSend.length;
	            // reversed loop because you change the array
	            while (i--) {
	                var p = $rootScope.listToSend[i];
	                // If phone is checked, remove from list
	                if (p.bChecked) {
	                    $rootScope.listToSend.splice(i, 1);
	                }
	            }
	        }
	        if ($rootScope.listToSend.length > 0)
	            $scope.haveSend = true;
	        else
	            $scope.haveSend = false;
	    };

	    $scope.sendMessage = function () {
	        if ($rootScope.selectAll) {
	            if ($scope.showCustomer) {
	                angular.forEach($scope.ABCBookCustomers, function (item) {
	                    if (item.bChecked) {
	                        $scope.aMember = {
	                            iUserId: item.iUserId,
	                            nvName: item.nvFirstName + ' ' + item.nvLastName,
	                            nvEmail: item.nvEmail,
	                            nvMobileNumber: item.nvMobileNumber,
	                            bChecked: item.bChecked
	                        };
	                        $rootScope.listToSend.push($scope.aMember);
	                    }
	                });
	            }
	            else if ($scope.showAdmin) {
	                angular.forEach($scope.ABCBookAdministrator, function (item) {
	                    if (item.bChecked) {
	                        $scope.aMember = {
	                            iUserId: item.iUserId,
	                            nvName: item.nvFirstName + ' ' + item.nvLastName,
	                            nvEmail: item.nvEmail,
	                            nvMobileNumber: item.nvMobileNumber,
	                            bChecked: item.bChecked
	                        };
	                        $rootScope.listToSend.push($scope.aMember);
	                    }
	                });
	            }
	            else if (!$scope.showCustomer) {
	                angular.forEach($scope.ABCBookProviders, function (item) {
	                    if (item.bChecked) {
	                        $scope.aMember = {
	                            iUserId: item.iUserId,
	                            nvName: item.nvFirstName + ' ' + item.nvLastName,
	                            nvEmail: item.nvEmail,
	                            nvMobileNumber: item.nvMobileNumber,
	                            bChecked: item.bChecked
	                        };
	                        $rootScope.listToSend.push($scope.aMember);
	                    }
	                });
	            }
	        }
	        if ($rootScope.listToSend.length == 0)
	            //if ($scope.haveSend == false)
	        {
	            alerts.alert('יש לבחור נמענים לשליחת הודעה!', 'שגיאה');
	            return;
	        }
	        $scope.newMessage2.dialogIsOpen = true;
	        $scope.messageFromSelect = true;
	        $rootScope.$broadcast('displayDialog', { id: 'sendMassege' });
	    };

	    $scope.getData = function () {
	        if ($scope.showCustomer) {
	            $scope.page = 'לקוח';
	            $scope.userType = 2;
				connect.post(true, 'GetUsersBasic',
					{ iUserType: 2 },
					function (result) {
						$scope.ABCBookCustomers = result;
						$scope.ABCBookCustomersCopy = angular.copy($scope.ABCBookCustomers);
					    $scope.isDataLoadedCustomers++;
					});
	        }
	        else if (!$scope.showCustomer) {
	            $scope.page = 'נותן שרות';
	            $scope.userType = 3;
				connect.post(true, 'GetUsersBasic',
					{ iUserType: 3 },
					function (result) {
					    $scope.ABCBookProviders = result;
					    $scope.ABCBookProviders.forEach(function (user) {
					        user.nvOrdersType = '';
					        user.lOrderType.forEach(function (type) {
					            $scope.orderType1 = type;
					            $scope.userTypeList.forEach(function (orderType2) {
					                if ($scope.orderType1 == orderType2.iId) {
					                    user.nvOrdersType += orderType2.nvName;
					                    user.nvOrdersType += ', ';
					                }
					            })
					        })
					    })
					    $scope.isDataLoadedProviders++;
					});
	        }
	        if ($scope.showAdmin) {
	            $scope.page = 'מנהל';
	            $scope.userType = 1;
				connect.post(true, 'GetUsersBasic',
                    { iUserType: 1 },
                    function (result) {
						$scope.ABCBookAdministrator = result;
						$scope.isDataLoadedAdministrator++;
                    });
	        };
	    };

	    $scope.exportToExcel = function () {
	        $scope.$broadcast('exportToExcel', {
	            id: $scope.gridIdentity,
	            fileName: 'אלפון'
	        });
	    };

	    $scope.deleteCustomer = function (item) {
	        $rootScope.delete = true;
	        connect.post(true, "DeleteUser", { 'iUserId': item.iUserId }, function (result) {
				if (result) {
					if (item.userType == 2) {
						var index = $scope.ABCBookCustomers.indexOf(item);
						$scope.ABCBookCustomers.splice(index, 1);
						$scope.isDataLoadedCustomers++;
					}
					else
						if (item.userType == 3) {
							index = $scope.ABCBookProviders.indexOf(item);
							$scope.ABCBookProviders.splice(index, 1);
							$scope.isDataLoadedProviders++;
						}
						else
						{
							index = $scope.ABCBookAdministrator.indexOf(item);
							$scope.ABCBookAdministrator.splice(index, 1);
							$scope.isDataLoadedAdministrator++;
						}
	            } else {
	                alert('error!');
	            }
	        });
	    }

	    $scope.EditCust = function () {
	        $scope.editCustomer = true;
	        $rootScope.$broadcast('displayDialog', { id: 'editCustomer' });
	    }
	    $scope.AddNewABCBook = function () {
	        $scope.name = "אלפון";
	        $scope.newUser.dialogIsOpen = true;
	        console.log($scope.newUser.dialogIsOpen);
	        $scope.isEdit = false;
	        $scope.user = {};
	        $rootScope.$broadcast('displayDialog', { id: 'newUser' })
		}

	    $scope.prepareData();
	}]);
