﻿"use strict"
companionApp.controller('RefundsCtrl', ['$scope', '$rootScope', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'codeTablesId', 'alerts', 'createDialog',
	function ($scope, $rootScope, connect, $location, $filter, $timeout, codeTablesName, codeTablesId, alerts, createDialog) {
	    $scope.prepareData = function () {
	        $scope.isDataLoaded = 0;
	        $scope.sumRefunds;
	        $scope.sumBalance;
	        $scope.isEdit = false;
	        $scope.isDelete = false;
			$scope.isReference = false;
			$scope.isShowAlert = false;


			if ($scope.user.dtResetCommunication != null) {
				$scope.YearOfRenewal = $scope.user.dtResetCommunication.getFullYear();
	            //$scope.YearOfRenewal = ((new Date()).getFullYear()) - (((new Date()).getFullYear() - $scope.user.dtCreateDate.getFullYear()) % 4);
	            //$scope.DateOfRenewal = new Date($scope.YearOfRenewal, $scope.user.dtCreateDate.getMonth(), $scope.user.dtCreateDate.getDay());
	            while (($scope.YearOfRenewal) < (new Date().getFullYear())) {
	                $scope.YearOfRenewal += 4;
	            }
				$scope.DateOfRenewal = new Date($scope.YearOfRenewal, $scope.user.dtResetCommunication.getMonth(), $scope.user.dtResetCommunication.getDate());
			}
			if ($scope.DateOfRenewal == $scope.user.dtResetCommunication && $scope.user.dtResetCommunication != undefined)
				$scope.DateOfRenewal = new Date($scope.YearOfRenewal+4, $scope.user.dtResetCommunication.getMonth(), $scope.user.dtResetCommunication.getDate());
	        if ($scope.DateOfRenewal != undefined && $scope.DateOfRenewal != null && $scope.DateOfRenewal != "")
	            $scope.DateOfRenewal = $filter('date')($scope.DateOfRenewal, 'dd/MM/yyyy');
	        $scope.refund2 = {};
	        $scope.currentDate = new Date();
	        $scope.newRefund = {};
	        $scope.flagFax = 0;
	        $scope.gridIdentity = 'RefundsList';
	        $scope.columns = [
				{
				    fieldName: 'iId',
				    title: 'עריכה',
				    template: '<div class="pass user-class glyphicon glyphicon-pencil"  ng-click="col.clickEvent(item)"></div>',
				    clickEvent: function (refund) {
						if (refund.item == undefined) return;
						$scope.refund2 = refund.item;
						if (!($scope.refund2.dtPurchase_original instanceof String || typeof $scope.refund2.dtPurchase_original === 'string'))
							$scope.refund2.dtPurchase = angular.copy($scope.refund2.dtPurchase_original)
						else
							$scope.refund2.dtPurchase_original = angular.copy(new Date($scope.refund2.dtPurchase_original))
				        if ($scope.refund2.iMonthYearId instanceof String || typeof $scope.refund2.iMonthYearId === 'string') {
				            $scope.tmpDate2 = $scope.refund2.iMonthYearId.substring(0, 2);
				            $scope.tmpDate1 = $scope.refund2.iMonthYearId.substring(3, 7);
				            $scope.tmpDate = parseInt($scope.tmpDate1) * 100 + parseInt($scope.tmpDate2)
				            $scope.refund2.iMonthYearId = $scope.tmpDate
				        }
				        $scope.isEdit = true;
						$scope.pop = "<label>שם מוצר</label><input type='text' class='form-control' required ng-model='refund2.nvPruductName' disabled />"+
							"<label>תאריך רכישה</label><input type='date' class='form-control' required ng-model='refund2.dtPurchase_original' required/>" +
							"<label>שיוך לחודש ושנה</label><form-dropdown ng-model='refund2.iMonthYearId' enablesearch='false' data='monthYearList' required></form-dropdown>" +
							"<label>סכום לתשלום</label><input type='text' class='form-control' required ng-model='refund2.nPayment' required/>" +
							'<input type="file" class="form-control " ng-file-select="docFileSelect($files)" id="docFile" ng-if="!refund2.nvDocName" />' +
							'<button ng-click="deleteFile()" ng-if="refund2.nvDocName">מחק קובץ</button>';
				        alerts.custom($scope.pop, 'עריכת רכישה', $scope,
							function () {
								if (new Date($scope.refund2.dtPurchase) > new Date()) {
							        createDialog({
										id: 'refund2dtPurchase',
							            template: "<div><span>אין להזין תאריך עתידי</span><button  ng-click='$modalCancel()' class='btn  pass color-grn btn-ayelet pull-left'><span> אישור</span></button>" + "</div>",
							            title: "שגיאה",
							            scope: $rootScope,
							            backdrop: true,
							            css: 'z-index: 2500;',
							            modalClass: "modal modalAlert"
							        });
							        return false;
							    }
								if (!$scope.refund2.nPayment || !$scope.refund2.iMonthYearId || !$scope.refund2.iProductId || !$scope.refund2.dtPurchase) {
							        createDialog({
										id: 'refund2Payment',
							            template: "<div><span>יש למלא את כל השדות</span><button  ng-click='$modalCancel()' class='btn  pass color-grn btn-ayelet pull-left'><span> אישור</span></button>" + "</div>",
							            title: "שגיאה",
							            scope: $rootScope,
							            backdrop: true,
							            css: 'z-index: 2500;',
							            modalClass: "modal modalAlert"
							        });
							        return false;
								}
								if (!(!isNaN(parseInt($scope.refund2.nPayment)) && angular.isNumber(parseInt($scope.refund2.nPayment)))) {
							        createDialog({
										id: 'refund2',
							            template: "<div><span>יש להכניס סכום בספרות בלבד!</span><button  ng-click='$modalCancel()' class='btn  pass color-grn btn-ayelet pull-left'><span> אישור</span></button>" + "</div>",
							            title: "שגיאה",
							            scope: $rootScope,
							            backdrop: true,
							            css: 'z-index: 2500;',
							            modalClass: "modal modalAlert"
							        });
									$scope.refund2.nPayment = '';
							        return false;
							    }
							    if ($scope.fileTypeError == true) {
							        createDialog({
							            id: 'fileType',
							            template: "<div><span>ניתן להכניס רק קבצי PDF או תמונות</span><button  ng-click='$modalCancel()' class='btn  pass color-grn btn-ayelet pull-left'><span> אישור</span></button>" + "</div>",
							            title: "שגיאה",
							            scope: $rootScope,
							            backdrop: true,
							            css: 'z-index: 2500;',
							            modalClass: "modal modalAlert"
							        });
							        return false;
							    }
							  //  if ($scope.refund2.iProductId == 30  || $scope.refund2.iProductId == 1 )
							  //  if ($scope.checkRefund($scope.refund2) == false)
									//return
								//חישוב סך החזר עבור גלאי בכי
								if ($scope.refund2.iProductId == 1)
								{
									$scope.refund2.nRefund = 1075;
									$scope.refund2.iBuyCryingDetector = 1;
									$scope.user.iBuyCryingDetector = 1
								}
								//חישוב סך החזר עבור פקס
								else
									if ($scope.refund2.iProductId == 30)
										$scope.refund2.nRefund = $scope.refund2.nPayment * ($rootScope.vat / 100);
									else
									{
										if ($scope.sumBalance > ($scope.refund2.nPayment * 0.9)) {
											$scope.refund2.nRefund = $scope.refund2.nPayment * 0.9;
											$scope.sumRefunds += $scope.refund2.nRefund;
											$scope.sumBalance -= $scope.refund2.nRefund;
										}
										else {
											$scope.refund2.nRefund = $scope.sumBalance + $scope.refund2.nRefund;
											$scope.sumRefunds = $scope.user.nBankCommunication;
											$scope.sumBalance = 0;
										}

									}
								$scope.refundToSend = angular.copy($scope.refund2);
								$scope.refundToSend.dtPurchase = angular.copy($scope.refund2.dtPurchase_original)
								$scope.refundToSend.dtCreateDate = null;
								if ($scope.refund2.iMonthYearId instanceof String || typeof $scope.refund2.iMonthYearId === 'string')
								{
									$scope.tmpDate2 = $scope.refundToSend.iMonthYearId.substring(0, 2);
									$scope.tmpDate1 = $scope.refundToSend.iMonthYearId.substring(3, 7);
									$scope.tmpDate = parseInt($scope.tmpDate1) * 100 + parseInt($scope.tmpDate2)
									$scope.refundToSend.iMonthYearId = $scope.tmpDate
								}
								connect.post(true, 'RefundUpdate', { refund: $scope.refundToSend, iUserManagerId: $rootScope.user.iUserId, isDelete: $scope.isDelete }, function (result) {
									if (result)
									{
							            console.log('RefundUpdate:');
							            var savingStatus = "השינויים נשמרו בהצלחה";
							            $scope.getData();
							            $rootScope.notification(savingStatus);
							            //$scope.nvDocPath = connect.getFilesUrl() + result;
										$scope.isReference = true;
										$scope.RefundsList.forEach(function (refund) {
											if (refund.iMonthYearId != 0) {
												refund.iMonthYearId = refund.iMonthYearId + ""
												$scope.tmpDate1 = refund.iMonthYearId.substring(0, 4);
												$scope.tmpDate2 = refund.iMonthYearId.substring(4, 6);
												$scope.tmpDate = $scope.tmpDate2 + '/' + $scope.tmpDate1
												refund.iMonthYearId = $scope.tmpDate
											}
										})
							        }
							        else {
							            alert('ארעה שגיאה בלתי צפויה');
							        }
							    });

							}, function () {
							    $scope.getData();
							}

						);
				    },
				    weight: 0.5,
				    filter: false,
				    sort: false
				},
				{
				    fieldName: 'iRefundId',
				    title: 'אסמכתא',
				    //template: '<div class="pass user-class glyphicon glyphicon-list"  ng-click="col.clickEvent(item)"></div>',
				    template: '<a href="{{item.nvDocPath}}" id="ref" ng-if="item.nvDocName" target="_blank"></a>' +
					'<div class="pass user-class glyphicon glyphicon-file" ng-click="clickEvent(item)"></div>',
				    clickEvent: function (item) {
				        if (item.item.nvDocName)
				            document.getElementById("ref").click();
				        else
				            alerts.alert("לא קיימת אסמכתא לרכישה זו");
				    },
				    weight: 0.5,
				    filter: false,
				    sort: false
				},
				{ title: 'סוג מוצר', fieldName: 'productType' },
				{ title: 'שם מוצר', fieldName: 'nvPruductName' },
				{ title: 'תאריך רכישה', fieldName: 'dtPurchase', type: 'date' },
				{ title: 'סכום לתשלום', fieldName: 'nPayment' },
				{ title: 'סך החזר', fieldName: 'nRefund' },
				{ title: 'תאריך הזנה', fieldName: 'dtCreateDate', type: 'date' },
				{ title: 'שיוך לחודש', fieldName: 'iMonthYearId' },
				{ title: 'הוזן ע"י', fieldName: 'nvCreatedByUser' },

	        ];
	        $scope.getData();
	    };
	    $scope.getData = function () {
	        connect.post(true, 'GetRefunds', { iUserId: $scope.user.iUserId },
				function (result) {
				    $scope.RefundsList = result;
					$scope.isDataLoaded++;
					 $scope.sumBalance = $scope.user.nBankCommunication;
				    $scope.sumRefunds = 0;
					$scope.RefundsList.forEach(function (refund) {
						refund.dtPurchase_original = angular.copy(refund.dtPurchase);
				        if (refund.iMonthYearId != 0) {
				            refund.iMonthYearId = refund.iMonthYearId + ""
				            $scope.tmpDate1 = refund.iMonthYearId.substring(0, 4);
				            $scope.tmpDate2 = refund.iMonthYearId.substring(4, 6);
				            $scope.tmpDate = $scope.tmpDate2 + '/' + $scope.tmpDate1
				            refund.iMonthYearId = $scope.tmpDate
				        }
				        else
				            refund.iMonthYearId = null;
				        if (refund.nvDocPath) {
				            refund.nvDocName = refund.nvDocPath;
				            refund.nvDocPath = connect.getFilesUrl() + refund.nvDocPath;
				        }
				        //אם לא מדובר בגלאי בכי או פקס - שהם לא מחושבים בסך ההחזר הכללי
				        if (refund.iProductId != 30 && refund.iProductId != 1) {
				            $scope.sumRefunds += refund.nRefund;
				            $scope.sumBalance -= refund.nRefund;
						}
						if ($scope.sumBalance == 0)
						{
							$scope.isShowAlert = true;
						}
				        //אם נקנה פקס ע"י לקוח זה
				        if (refund.dtPurchase != undefined && refund.dtPurchase != null && refund.dtPurchase != "")
				            if (refund.dtPurchase.getFullYear() + 5 > (new Date().getFullYear()) && refund.iProductId == 30)
				                $scope.flagFax = 1;
				    })
				    connect.post(true, 'GetUserCodeTables', { iUserId: $rootScope.user.iUserId }, function (result) {
				        $scope.codeTables = result;
				        $scope.monthYearList = $filter('filter')(result, { Key: 'monthYear' }, true)[0].Value;
				        $scope.yearList = $filter('filter')(result, { Key: 'year' }, true)[0].Value;
				        $scope.monthYearList.forEach(function (date) {
				            $scope.tmpDate1 = date.nvName.substring(0, 4);
				            $scope.tmpDate2 = date.nvName.substring(4, 6);
				            $scope.tmpDate = $scope.tmpDate2 + '/' + $scope.tmpDate1
				            date.nvName = $scope.tmpDate
				        })
				    });
				});
	        connect.post(true, 'GetProduct', {},
                function (result) {
                    $scope.productsList = result;
                    $scope.isDataLoaded++;
                });

	    };

	    $scope.AddNewRefund = function () {
	        //$scope.defYear = $filter('filter')($scope.yearList, { nvName: new Date().getFullYear() + '' }, true)[0].nvName;//(new Date()).getFullYear();
	        //$scope.defMonth = $scope.monthList[new Date().getMonth()].iId;//(new Date()).getMonth();
			//$scope.defMonthYear = parseInt($scope.defYear) * 100 + $scope.defMonth
			$scope.newRefund.iMonthYearId = parseInt(new Date().getFullYear()) * 100 + new Date().getMonth()+1;
			$scope.newRefund.dtPurchase_original = new Date();
			$scope.newRefund.dtPurchase = new Date();
	        $scope.isEdit = false;
	        $scope.pop = "<label>שם מוצר</label><form-dropdown ng-model='newRefund.iProductId' enablesearch='false' data='productsList' identityfield='iProductId' datafield='nvPruductName'></form-dropdown>" +
				"<label>תאריך רכישה</label><input type='date' class='form-control' required ng-model='newRefund.dtPurchase_original' min='{{currentDate | date:'yyyy-MM-dd'}}' required/>" +
				"<label>שיוך לחודש ושנה</label><form-dropdown ng-model='newRefund.iMonthYearId' enablesearch='false' data='monthYearList' required></form-dropdown>" +
				"<label>סכום לתשלום</label><input type='text' class='form-control' required ng-model='newRefund.nPayment' required/>" +
					'<input type="file" class="form-control " ng-file-select="docFileSelect($files)" id="docFile" />';
	        alerts.custom($scope.pop, 'הוספת רכישה', $scope,
				function () {
					$scope.newRefund.dtPurchase = angular.copy($scope.newRefund.dtPurchase_original);
					if (new Date($scope.newRefund.dtPurchase_original) > new Date()) {
				        createDialog({
				            id: 'newRefunddtPurchase',
							template: "<div><span>אין להזין תאריך עתידי</span><button  ng-click='$modalCancel()' class='btn  pass color-grn btn-ayelet pull-left'><span> אישור</span></button>" + "</div>",
				            title: "שגיאה",
				            scope: $rootScope,
				            backdrop: true,
				            css: 'z-index: 2500;',
				            modalClass: "modal modalAlert"
				        });
				        return false;
				    }
					if (!$scope.newRefund.nPayment || !$scope.newRefund.iMonthYearId || !$scope.newRefund.iProductId || !$scope.newRefund.dtPurchase_original) {
				        createDialog({
				            id: 'newRefundPayment',
				            template: "<div><span>יש למלא את כל השדות</span><button  ng-click='$modalCancel()' class='btn  pass color-grn btn-ayelet pull-left'><span> אישור</span></button>" + "</div>",
				            title: "שגיאה",
				            scope: $rootScope,
				            backdrop: true,
				            css: 'z-index: 2500;',
				            modalClass: "modal modalAlert"
				        });
				        return false;
				    }
				    if (!(!isNaN(parseInt($scope.newRefund.nPayment)) && angular.isNumber(parseInt($scope.newRefund.nPayment)))) {
				        createDialog({
				            id: 'newRefund',
				            template: "<div><span>יש להכניס סכום בספרות בלבד!</span><button  ng-click='$modalCancel()' class='btn  pass color-grn btn-ayelet pull-left'><span> אישור</span></button>" + "</div>",
				            title: "שגיאה",
				            scope: $rootScope,
				            backdrop: true,
				            css: 'z-index: 2500;',
				            modalClass: "modal modalAlert"
				        });
				        $scope.newRefund.nPayment = '';
				        return false;
				    }
				    if ($scope.fileTypeError == true) {
				        createDialog({
				            id: 'fileType',
				            template: "<div><span>ניתן להכניס רק קבצי PDF או תמונות</span><button  ng-click='$modalCancel()' class='btn  pass color-grn btn-ayelet pull-left'><span> אישור</span></button>" + "</div>",
				            title: "שגיאה",
				            scope: $rootScope,
				            backdrop: true,
				            css: 'z-index: 2500;',
				            modalClass: "modal modalAlert"
				        });
				        return false;
				    }
				    if ($scope.checkRefund($scope.newRefund) == false)
						return
					//חישוב סך החזר עבור גלאי בכי
					if ($scope.newRefund.iProductId == 1)
					{
						$scope.newRefund.nRefund = 1075;
						$scope.newRefund.iBuyCryingDetector = 1;
						$scope.user.iBuyCryingDetector = 1;
					}
					//חישוב סך החזר עבור פקס
					else
						if ($scope.newRefund.iProductId == 30)
							$scope.newRefund.nRefund = $scope.newRefund.nPayment * ($rootScope.vat / 100);
						else {
							if ($scope.sumBalance > ($scope.newRefund.nPayment * 0.9))
								$scope.newRefund.nRefund = $scope.newRefund.nPayment * 0.9;
							else
								$scope.newRefund.nRefund = $scope.sumBalance;
							$scope.sumRefunds += $scope.newRefund.nRefund;
							$scope.sumBalance -= $scope.newRefund.nRefund;
						}
					connect.post(true, 'RefundInsert', { refund: $scope.newRefund, iUserManagerId: $rootScope.user.iUserId, iUserId: $scope.user.iUserId }, function (result) {
						if ($scope.isShowAlert == true && $scope.newRefund.iProductId != 30 && $scope.newRefund.iProductId != 1)
							alerts.alert("לא ניתן לקבל החזרים עד לתאריך ההתחדשות");
				        if (result && result > 0) {
				            console.log('RefundInsert:' + result);
				            var savingStatus = "השינויים נשמרו בהצלחה";
				            $rootScope.notification(savingStatus);
				            $scope.newRefund = {};
				            $scope.getData();
				        }
				        else {
				            alerts.alert('ארעה שגיאה בלתי צפויה');
				        }
				    });
				}, function () {
					$scope.newRefund = {};
				    $scope.getData();
				}

			);
	    }
	    $scope.checkRefund = function (refund) {
	        if (refund.iProductId == 1 && $scope.user.iBuyCryingDetector == 1)
			{
				alerts.alert("לא ניתן לקבל החזר על המוצר");
	                $scope.refund2 = {};
	                $scope.newRefund = {};
	                return false;
	        }
	        if (refund.iProductId == 30 && $scope.flagFax == 1 ) {
	            alerts.alert("לא ניתן לקבל החזר על המוצר");
	            $scope.refund2 = {};
	            $scope.newRefund = {};
	            return false;
	        }
	        return true;
	    }

	    $scope.deleteFile = function () {
	        $scope.isDelete = true;
	    }


	    $scope.docFileSelect = function ($files, number) {
	        $scope.isDelete = false;
	        $scope.isReference = false;
	        var fileType = $files[0].name.substring($files[0].name.indexOf('.') + 1, $files[0].name.length);
	        var ext = fileType.toLowerCase();
	        if (jQuery.inArray(ext, ['pdf', 'png', 'jpg', 'jpeg']) == -1) {
	            createDialog({
	                id: 'fileType',
	                template: "<div><span>ניתן להכניס רק קבצי PDF או תמונות!</span><button  ng-click='$modalCancel()' class='btn  pass color-grn btn-ayelet pull-left'><span> אישור</span></button>" + "</div>",
	                title: "שגיאה",
	                scope: $rootScope,
	                backdrop: true,
	                css: 'z-index: 2500;',
	                modalClass: "modal modalAlert"
	            });
	            $scope.fileTypeError = true;
	            return false;
	        }
	        $scope.fileTypeError = false;
	        var fileMedia = $files[0].type.substring(0, $files[0].type.indexOf('/'));
	        if (window.FileReader) {
	            var url = '';
	            var fileReader = new FileReader();
	            fileReader.readAsDataURL($files[0]);
	            fileReader.onload = function (e) {
	                $timeout(function () {
	                    url = e.target.result.substring(0, e.target.result.indexOf('/') + 1);
	                    url = url + fileType;
	                    url = url + e.target.result.substring(e.target.result.indexOf(';'), e.target.result.length);
	                    if ($scope.isEdit == true)
	                        $scope.refund2.nvDocPath = url;
	                    else
	                        $scope.newRefund.nvDocPath = url;
	                });
	            }
	        }
	    };
	    $scope.prepareData();

	}]);