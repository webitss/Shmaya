"use strict"
companionApp.controller('EligibilityTableCtrl', ['$scope', '$rootScope', 'connect', '$timeout', '$filter', 'alerts', 'createDialog', '$uibModal', 'codeTablesId',
	function ($scope, $rootScope, connect, $timeout, $filter, alerts, createDialog, $uibModal, codeTablesId) {
	    $scope.newEligibility = {};
	    $scope.prepareData = function () {
	        $scope.getData();
	        $scope.isDataLoaded = 0;
	        $scope.gridIdentity = 'EligibilityTableList';
	        $scope.columns =
				[
					{
					    fieldName: 'iEntitlementTypeId',
					    title: 'עריכה',
					    template: '<div class="pass user-class glyphicon glyphicon-pencil"  ng-click="col.clickEvent(item)"></div>',
					    clickEvent: function (eligibility) {
					        if (eligibility.item == undefined) return;
					        $scope.eligibility2 = eligibility.item;
					        $scope.pop = '<label>סוג זכאות</label><input type="text" class="form-control" required ng-model="eligibility2.nvEntitlementType" required/>' +
								'<label>מספר שעות</label><input type="text" class="form-control" required ng-model="eligibility2.nNumHours" required/>';
					        alerts.custom($scope.pop, ' עריכת ערך ', $scope,
								function () {
								    if ($scope.eligibility2.nNumHours.length > 15) {
								        createDialog({
								            id: 'eligibility2',
								            template: "<div><span>מספר שעות גדול מידי</span><button  ng-click='$modalCancel()' class='btn  pass color-grn btn-ayelet pull-left'><span> אישור</span></button>" + "</div>",
								            title: "שגיאה",
								            scope: $rootScope,
								            backdrop: true,
								            css: 'z-index: 2500;',
								            modalClass: "modal modalAlert"
								        });
								        return false;
								    }
								    else {
								        connect.post(true, 'EligibilityUpdate', { eligibility: $scope.eligibility2, iUserManagerId: $rootScope.user.iUserId }, function (result) {
								            if (result && result > 0) {
								                console.log($scope.eligibility.iEntitlementTypeId,
                                                    $scope.eligibility.nvEntitlementType,
                                                    $scope.eligibility.nNumHours,
                                                    $rootScope.user.iUserId
                                                )

								                console.log('EligibilityUpdate:' + result);
								                var savingStatus = "השינויים נשמרו בהצלחה";
								                $rootScope.notification(savingStatus);
								                $scope.user.dialogIsOpen = false;
								            }
								            else {
								                alert('ארעה שגיאה בלתי צפויה');
								            }
								        });
								        return true;
								    }
								}, function () {
								    $scope.getData();
								}

							);
					    },
					    weight: 0.5,
					    filter: false,
					    sort: false
					},
					{ title: 'סוג זכאות', fieldName: 'nvEntitlementType' },
					{ title: 'מספר שעות זכאות', fieldName: 'nNumHours' }
				];


	    };

	    $scope.getData = function () {
	        connect.post(true, 'GetEligibiltyTable', {},
				function (result) {
				    $scope.EligibilityTableList = result;
				    $scope.isDataLoaded++;
				});
	    }
	    $scope.AddNewEligibility = function () {
	        $scope.pop = '<label>סוג זכאות</label><input type="text" class="form-control" required ng-model="newEligibility.nvEntitlementType" required/>' +
				'<label>מספר שעות</label><input type="text" class="form-control" required ng-model="newEligibility.nNumHours" required/>'
	        alerts.custom($scope.pop, 'הוספת ערך', $scope,
				function () {
				    if ($scope.newEligibility.nNumHours.length > 15) {
				        createDialog({
				            id: 'newEligibility',
				            template: "<div><span>מספר שעות גדול מידי</span><button  ng-click='$modalCancel()' class='btn  pass color-grn btn-ayelet pull-left'><span> אישור</span></button>" + "</div>",
				            title: "שגיאה",
				            scope: $rootScope,
				            backdrop: true,
				            css: 'z-index: 2500;',
				            modalClass: "modal modalAlert"
				        });
				        return false;
				    }
				    else {
				        connect.post(true, 'EligibilityInsert', { eligibility: $scope.newEligibility, iUserManagerId: $rootScope.user.iUserId }, function (result) {
				            if (result && result > 0) {
				                console.log('EligibilityInsert:' + result);
				                var savingStatus = "השינויים נשמרו בהצלחה";
				                $rootScope.notification(savingStatus);
				                $scope.newEligibility.dialogIsOpen = false;
				                $scope.newEligibility = {}
				                $scope.getData();
				            }
				            else {
				                alert('ארעה שגיאה בלתי צפויה');
				            }
				        });
				        return true;
				    }
				}, function () {
				    $scope.getData();
				}

			);
	    }
	    $scope.exportToExcel = function () {
	        $scope.$broadcast('exportToExcel', {
	            id: $scope.gridIdentity,
	            fileName: 'זכאות'
	        });
	    };

	    $scope.prepareData();



	}]);