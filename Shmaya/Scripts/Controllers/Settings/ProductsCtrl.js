"use strict"
companionApp.controller('ProductsCtrl', ['$scope', '$rootScope', 'connect', '$timeout', '$filter', 'alerts', 'createDialog', '$uibModal', 'codeTablesId',
	function ($scope, $rootScope, connect, $timeout, $filter, alerts, createDialog, $uibModal, codeTablesId) {
		$scope.newProduct = {};
		$scope.updateVat = function (num)
		{
			num = parseInt(num);
			$rootScope.vat = num;
			connect.post(true, 'UpdateVat', { vat: num},
				function (result) {
				});
		}
		$scope.prepareData = function () {
			$scope.getData();
			$scope.isDataLoaded = 0;
			$scope.gridIdentity = 'productsList';
			$scope.columns =
				[
					{
						fieldName: 'iProductId',
						title: 'עריכה',
						template: '<div class="pass user-class glyphicon glyphicon-pencil"  ng-click="col.clickEvent(item)"></div>',
						clickEvent: function (product) {
						    if (product.item == undefined) return;
							$scope.product2 = product.item;
							$scope.pop = "<label>סוג מוצר</label><form-dropdown ng-model='product2.iProductTypeId' enablesearch='false' data='productTypeList' identityfield='iId' datafield='nvName'></form-dropdown>" +
								"<label>שם מוצר</label><input type='text' class='form-control' required ng-model='product2.nvPruductName' required/>";
							alerts.custom($scope.pop, 'הוספת מוצר', $scope,
								function () {
									if (!$scope.product2.iProductTypeId || !$scope.product2.nvPruductName) {
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
									connect.post(true, 'ProductUpdate', { product: $scope.product2, iUserManagerId: $rootScope.user.iUserId }, function (result) {
										if (result && result > 0) {
											console.log('ProductUpdate:' + result);
											$scope.product2.dialogIsOpen = false;
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
					{ title: 'סוג מוצר', fieldName: 'nvProductTypeId' },
					{ title: 'שם מוצר', fieldName: 'nvPruductName' }
				];
		};

		$scope.getData = function () {
			connect.post(true, 'GetProduct', {},
				function (result) {
					$scope.productsList = result;
					$scope.isDataLoaded++;
				});
		}
		$scope.AddNewProduct = function () {
			$scope.pop = "<label>סוג מוצר</label><form-dropdown ng-model='newProduct.iProductTypeId' enablesearch='false' data='productTypeList' identityfield='iId' datafield='nvName'></form-dropdown>"+
				"<label>שם מוצר</label><input type='text' class='form-control' required ng-model='newProduct.nvPruductName' required/>" 
					alerts.custom($scope.pop, 'הוספת מוצר', $scope,
						function () {
							if (!$scope.newProduct.iProductTypeId || !$scope.newProduct.nvPruductName) {
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
							connect.post(true, 'ProductInsert', { product: $scope.newProduct, iUserManagerId: $rootScope.user.iUserId }, function (result) {
								if (result && result > 0) {
									console.log('ProductInsert:' + result);
									$scope.newProduct.dialogIsOpen = false;
									$scope.newProduct = {};
									$scope.getData();
								}
								else {
									alert('ארעה שגיאה בלתי צפויה');
								}
							});
						}, function () {
						    $scope.getData();
						}

		);
		}
		$scope.exportToExcel = function () {
			$scope.$broadcast('exportToExcel', {
				id: $scope.gridIdentity,
				fileName: 'מוצרים'
			});
		};

		$scope.prepareData();
	}]);