"use strict"
companionApp.controller('RefundsCtrl', ['$scope', '$rootScope', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'codeTablesId', 'alerts',
	function ($scope, $rootScope, connect, $location, $filter, $timeout, codeTablesName, codeTablesId, alerts) {
	    $scope.prepareData = function () {
	        $scope.isDataLoaded = 0;
	        $scope.sumRefunds = 0;
	        $scope.sumBalance = 0;
	        $scope.isEdit = false;
	        $scope.isReference = false;
	        $scope.YearOfRenewal = ((new Date()).getFullYear()) - (((new Date()).getFullYear() - $scope.user.dtCreateDate.getFullYear()) % 4);
	        $scope.DateOfRenewal = new Date($scope.YearOfRenewal, $scope.user.dtCreateDate.getMonth(), $scope.user.dtCreateDate.getDay());
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
				        $scope.refund2 = refund.item;
				        $scope.isEdit = true;
				        $scope.pop = "<label>שם מוצר</label><form-dropdown ng-model='refund2.iProductId' enablesearch='false' data='productsList' identityfield='iProductId' datafield='nvPruductName'></form-dropdown>" +
							"<label>תאריך רכישה</label><input type='date' class='form-control' required ng-model='refund2.dtPurchase' required/>" +
							"<label>שיוך לחודש</label><form-dropdown ng-model='refund2.iMonthId' enablesearch='false' data='monthList' identityfield='iId' datafield='nvName'></form-dropdown>" +
							"<label>סכום לתשלום</label><input type='text' class='form-control' required ng-model='refund2.nPayment' required/>" +
							'<input type="file" class="form-control " ng-file-select="docFileSelect($files)" id="docFile" />' +
							'<a href="{{refund2.nvDocPath}}" ng-if="refund2.nvDocName" target="_blank">מסמך אסמכתא</a>';
				        alerts.custom($scope.pop, 'עריכת רכישה', $scope,
							function () {
							    if ($scope.checkRefund($scope.refund2) == false)
							        return
							    connect.post(true, 'RefundUpdate', { refund: $scope.refund2, iUserManagerId: $rootScope.user.iUserId }, function (result) {
							        if (result) {
							            console.log('RefundUpdate:');
							            var savingStatus = "השינויים נשמרו בהצלחה";
							            $scope.getData();
							            $rootScope.notification(savingStatus);
							            //$scope.nvDocPath = connect.getFilesUrl() + result;
							            $scope.isReference = true;

							        }
							        else {
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
				    template: '<a href="{{nvDocPath}}" ng-if="refund2.nvDocName" target="_blank">מסמך אסמכתא</a>',
				    clickEvent: function (refund) {
				        alert(nvDocPath);
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
				{ title: 'שיוך לחודש', fieldName: 'nvMonthName' },
				{ title: 'הוזן ע"י', fieldName: 'nvCreatedByUser' },

	        ];
	        $scope.getData();
	        console.log($scope.refund2.nvDocPath);
	    };


	    $scope.getData = function () {
	        connect.post(true, 'GetRefunds', { iUserId: $scope.user.iUserId },
				function (result) {
				    $scope.RefundsList = result;
				    $scope.isDataLoaded++;
				    $scope.RefundsList.forEach(function (refund) {
				        refund.nvDocName = refund.nvDocPath;
				        refund.nvDocPath = connect.getFilesUrl() + refund.nvDocPath;
				        $scope.sumRefunds += refund.nRefund;
				        $scope.sumBalance += (refund.nPayment - refund.nRefund)
				        //אם נקנה פקס ע"י לקוח זה
				        if (refund.dtPurchase != undefined && refund.dtPurchase != null && refund.dtPurchase != "")
				            if (refund.dtPurchase.getFullYear() + 5 > (new Date().getFullYear()) && refund.iProductId == 30)
				                $scope.flagFax = 1;
				    })
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
				"<label>שיוך לחודש</label><form-dropdown ng-model='newRefund.iMonthId' enablesearch='false' data='monthList' identityfield='iId' datafield='nvName'></form-dropdown>" +
				"<label>סכום לתשלום</label><input type='text' class='form-control' required ng-model='newRefund.nPayment' required/>"; +
				'<input type="file" class="form-control " ng-file-select="docFileSelect($files)" id="docFile" />';
	        alerts.custom($scope.pop, 'הוספת רכישה', $scope,
				function () {
				    if ($scope.checkRefund($scope.newRefund) == false)
				        return
				    connect.post(true, 'RefundInsert', { refund: $scope.newRefund, iUserManagerId: $rootScope.user.iUserId, iUserId: $scope.user.iUserId }, function (result) {
				        if (result && result > 0) {
				            console.log('RefundInsert:' + result);
				            var savingStatus = "השינויים נשמרו בהצלחה";
				            $rootScope.notification(savingStatus);
				            $scope.getData();
				        }
				        else {
				            alert('ארעה שגיאה בלתי צפויה');
				        }
				    });
				}, function () { }

			);
	    }
	    $scope.checkRefund = function (refund) {
	        if (refund.iProductId == 1 && $scope.user.iBuyCryingDetector == 1) {
	            var savingStatus = "לא ניתן לרכוש את המוצר";
	            $rootScope.notification(savingStatus);
	            return false;
	        }
	        if (refund.iProductId == 30 && $scope.flagFax == 1) {
	            savingStatus = "לא ניתן לקבל החזר על המוצר";
	            $rootScope.notification(savingStatus);
	            return false;
	        }
	        return true;
	    }


	    $scope.docFileSelect = function ($files, number) {
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