"use strict"
companionApp.controller('RefundsCtrl', ['$scope', '$rootScope', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'codeTablesId', 'alerts',
	function ($scope, $rootScope, connect, $location, $filter, $timeout, codeTablesName, codeTablesId, alerts) {
	    $scope.prepareData = function () {
	        $scope.isDataLoaded = 0;
	        $scope.sumRefunds;
	        $scope.sumBalance;
			$scope.isEdit = false;
			$scope.isDelete = false;
			$scope.vat = 17;
			$scope.isReference = false;
			if ($scope.user.dtResetHours != null) {
				$scope.YearOfRenewal = $scope.user.dtResetHours.getFullYear();
				//$scope.YearOfRenewal = ((new Date()).getFullYear()) - (((new Date()).getFullYear() - $scope.user.dtResetHours.getFullYear()) % 4);
				//$scope.DateOfRenewal = new Date($scope.YearOfRenewal, $scope.user.dtResetHours.getMonth(), $scope.user.dtResetHours.getDay());
				while (($scope.YearOfRenewal) < (new Date().getFullYear()))
				{
					$scope.DateOfRenewal = new Date(($scope.user.dtResetHours.getFullYear() + 4), $scope.user.dtResetHours.getMonth(), $scope.user.dtResetHours.getDay());
					$scope.YearOfRenewal += 4;
				}
			}
	        if ($scope.DateOfRenewal != undefined && $scope.DateOfRenewal != null && $scope.DateOfRenewal != "")
	            $scope.DateOfRenewal = $filter('date')($scope.DateOfRenewal, 'dd/MM/yyyy');
	        $scope.refund2 = {};
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
						if ($scope.refund2.iMonthYearId instanceof String || typeof $scope.refund2.iMonthYearId === 'string')
						{
							$scope.tmpDate2 = $scope.refund2.iMonthYearId.substring(0, 2);
							$scope.tmpDate1 = $scope.refund2.iMonthYearId.substring(3, 7);
							$scope.tmpDate = parseInt($scope.tmpDate1) * 100 + parseInt($scope.tmpDate2)
							$scope.refund2.iMonthYearId = $scope.tmpDate
						}
						$scope.isEdit = true;
						$scope.pop = "<label>שם מוצר</label><form-dropdown ng-model='refund2.iProductId' enablesearch='false' data='productsList' identityfield='iProductId' datafield='nvPruductName' ng-change='change(refund2.iProductId)'></form-dropdown>" +
							"<label>תאריך רכישה</label><input type='date' class='form-control' required ng-model='refund2.dtPurchase_original' required/>" +
							"<label>שיוך לחודש ושנה</label><form-dropdown ng-model='refund2.iMonthYearId' enablesearch='false' data='monthYearList' required></form-dropdown>" +
							"<label>סכום לתשלום</label><input type='text' class='form-control' required ng-model='refund2.nPayment' required/>" +
							'<input type="file" class="form-control " ng-file-select="docFileSelect($files)" id="docFile" ng-if="!refund2.nvDocName" />' +
							'<button ng-click="deleteFile()" ng-if="refund2.nvDocName">מחק קובץ</button>';
				        alerts.custom($scope.pop, 'עריכת רכישה', $scope,
							function () {
								if (($scope.refund2.iProductId == 30 && $scope.flagChange == true) || ($scope.refund2.iProductId == 1 && $scope.flagChange == true))
									$scope.chngProd = true
							    if ($scope.checkRefund($scope.refund2) == false)
									return
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
										$scope.refund2.nRefund = $scope.refund2.nPayment * ((100 - $scope.vat)/100);
									else {
										if ($scope.sumBalance > ($scope.refund2.nPayment * 0.9))
											$scope.refund2.nRefund = $scope.refund2.nPayment * 0.9;
										else
											$scope.refund2.nRefund = $scope.sumBalance;
										$scope.sumRefunds += $scope.refund2.nRefund;
										$scope.sumBalance -= $scope.refund2.nRefund;
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

							        }
							        else 
									{
							            alert('ארעה שגיאה בלתי צפויה');
							        }
							    });

							}, function () { }

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
							alerts.alert("לא נבחרה אסמכתא");
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
		$scope.change = function (iProdId)
		{
			if (iProdId == 30 || iProdId == 1)
				$scope.flagChange = true;
			else
				$scope.flagChange = false;
		}
	    $scope.getData = function () {
	        connect.post(true, 'GetRefunds', { iUserId: $scope.user.iUserId },
				function (result) {
				    $scope.RefundsList = result;
					$scope.isDataLoaded++;
					$scope.sumBalance = $scope.user.nBankCommunication;
					$scope.sumRefunds = 0;
					$scope.RefundsList.forEach(function (refund)
					{
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
						if (refund.iProductId != 30 && refund.iProductId != 1)
						{
							$scope.sumRefunds += refund.nRefund;
							$scope.sumBalance -= refund.nRefund;
						}
				        //אם נקנה פקס ע"י לקוח זה
				        if (refund.dtPurchase != undefined && refund.dtPurchase != null && refund.dtPurchase != "")
				            if (refund.dtPurchase.getFullYear() + 5 > (new Date().getFullYear()) && refund.iProductId == 30)
								$scope.flagFax = 1;
					})
					connect.post(true, 'GetUserCodeTables', { iUserId: $rootScope.user.iUserId }, function (result) {
						$scope.codeTables = result;
						$scope.monthYearList = $filter('filter')(result, { Key: 'monthYear' }, true)[0].Value;
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
			$scope.isEdit = false;
	        $scope.pop = "<label>שם מוצר</label><form-dropdown ng-model='newRefund.iProductId' enablesearch='false' data='productsList' identityfield='iProductId' datafield='nvPruductName'></form-dropdown>" +
				"<label>תאריך רכישה</label><input type='date' class='form-control' required ng-model='newRefund.dtPurchase' required/>" +
				"<label>שיוך לחודש ושנה</label><form-dropdown ng-model='newRefund.iMonthYearId' enablesearch='false' data='monthYearList' required></form-dropdown>" +
				"<label>סכום לתשלום</label><input type='text' class='form-control' required ng-model='newRefund.nPayment' required/>"+
					'<input type="file" class="form-control " ng-file-select="docFileSelect($files)" id="docFile" />';
	        alerts.custom($scope.pop, 'הוספת רכישה', $scope,
				function () {
					if (($scope.newRefund.iProductId == 30 && $scope.flagChange == true) || ($scope.newRefund.iProductId == 1 && $scope.flagChange == true))
						$scope.chngProd = true
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
							$scope.newRefund.nRefund = $scope.newRefund.nPayment * ((100 - $scope.vat) / 100);
						else {
							if ($scope.sumBalance > ($scope.newRefund.nPayment * 0.9))
								$scope.newRefund.nRefund = $scope.newRefund.nPayment * 0.9;
							else
								$scope.newRefund.nRefund = $scope.sumBalance;
							$scope.sumRefunds += $scope.newRefund.nRefund;
							$scope.sumBalance -= $scope.newRefund.nRefund;
						}
				    connect.post(true, 'RefundInsert', { refund: $scope.newRefund, iUserManagerId: $rootScope.user.iUserId, iUserId: $scope.user.iUserId }, function (result) {
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
				}, function () { }

			);
	    }
		$scope.checkRefund = function (refund) {
			if ((refund.iProductId == 1 && $scope.user.iBuyCryingDetector == 1 && ($scope.chngProd == true || $scope.chngProd == undefined))) 
				if(refund.iProductId == 1 && refund.nPayment > 1075 && ($scope.chngProd == true || $scope.chngProd == undefined))
				{
					alerts.alert("לא ניתן לרכוש את המוצר");
					$scope.refund2 = {};
					$scope.newRefund = {};
					$scope.chngProd = false;
					$scope.flagChange = false;
					return false;
				}
			if (refund.iProductId == 30 && $scope.flagFax == 1 && ($scope.chngProd == true || $scope.chngProd == undefined)) {
				alerts.alert("לא ניתן לקבל החזר על המוצר");
				$scope.refund2 = {};
				$scope.newRefund = {};
				$scope.chngProd = false;
				$scope.flagChange = false;
	            return false;
	        }
	        return true;
		}

		$scope.deleteFile = function()
		{
			$scope.isDelete = true;
		}


		$scope.docFileSelect = function ($files, number) {
			$scope.isDelete = false;
	        $scope.isReference = false;
	        var fileType = $files[0].name.substring($files[0].name.indexOf('.') + 1, $files[0].name.length);
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