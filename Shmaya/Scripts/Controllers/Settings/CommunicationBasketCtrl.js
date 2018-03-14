"use strict"
companionApp.controller('CommunicationBasketCtrl', ['$scope', '$rootScope', 'connect', '$timeout', '$filter', 'alerts', 'createDialog', '$uibModal', 'codeTablesId',
	function ($scope, $rootScope, connect, $timeout, $filter, alerts, createDialog, $uibModal, codeTablesId) {
	    $scope.newCommunication = {};
	    $scope.prepareData = function () {
	        $scope.getData();
	        $scope.isDataLoaded = 0;
	        $scope.gridIdentity = 'CommunicationCartList';
	        $scope.columns =
				[
					{
					    fieldName: 'iCommunicationCart',
					    title: 'עריכה',
					    template: '<div class="pass user-class glyphicon glyphicon-pencil"  ng-click="col.clickEvent(item)"></div>',
					    clickEvent: function (comm) {
					        if (comm.item == undefined) return;
					        $scope.comm = comm.item;
							$scope.pop = "<label>סוג זכאות</label><input type='text' class='form-control' required ng-model='comm.nvCommunicationCart' required/>" +
								"<label>תעריף</label><input type='text' class='form-control' required ng-model='comm.nTariff' required/>";
					        alerts.custom($scope.pop, 'הוספת ערך', $scope,
								function () {
									if (!$scope.comm.nTariff || !$scope.comm.nvCommunicationCart) {
										createDialog({
											id: 'eligibility2',
											template: "<div><span>חסרים שדות חובה</span><button  ng-click='$modalCancel()' class='btn  pass color-grn btn-ayelet pull-left'><span> אישור</span></button>" + "</div>",
											title: "שגיאה",
											scope: $rootScope,
											backdrop: true,
											css: 'z-index: 2500;',
											modalClass: "modal modalAlert"
										});
										return false;
									}
								    if ($scope.comm.nTariff.length > 15) {
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
								        connect.post(true, 'CommunicationUpdate', { comm: $scope.comm, iUserManagerId: $rootScope.user.iUserId }, function (result) {
								            if (result && result > 0) {
								                console.log('CommunicationUpdate:' + result);
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
					{ title: 'סוג זכאות', fieldName: 'nvCommunicationCart' },
					{ title: 'תעריף', fieldName: 'nTariff' }
				];
	    };

	    $scope.getData = function () {
	        connect.post(true, 'GetCommunicationCart', {},
				function (result) {
				    $scope.CommunicationCartList = result;
				    $scope.isDataLoaded++;
				});
	    }

	    $scope.AddNewCommunication = function () {
			$scope.pop = "<label>סוג זכאות</label><input type='text' class='form-control' required ng-model='newCommunication.nvCommunicationCart' required/>" +
				"<label>תעריף</label><input type='text' class='form-control' required ng-model='newCommunication.nTariff' required/>";
	        alerts.custom($scope.pop, 'הוספת ערך', $scope,
				function () {
					if (!$scope.newCommunication.nTariff || !$scope.newCommunication.nvCommunicationCart) {
						createDialog({
							id: 'eligibility2',
							template: "<div><span>חסרים שדות חובה</span><button  ng-click='$modalCancel()' class='btn  pass color-grn btn-ayelet pull-left'><span> אישור</span></button>" + "</div>",
							title: "שגיאה",
							scope: $rootScope,
							backdrop: true,
							css: 'z-index: 2500;',
							modalClass: "modal modalAlert"
						});
						return false;
					}
				
				    if ($scope.newCommunication.nTariff.length > 15) {
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
				        connect.post(true, 'CommunicationInsert', { comm: $scope.newCommunication, iUserManagerId: $rootScope.user.iUserId }, function (result) {
				            if (result && result > 0) {
				                console.log('CommunicationInsert:' + result);
				                $scope.newCommunication = {};
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
	            fileName: 'סלי תקשורת'
	        });
	    };

	    $scope.prepareData();
	}]);