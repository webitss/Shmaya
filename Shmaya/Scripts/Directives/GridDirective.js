﻿companionApp.directive('grid', function ($timeout, $filter, $window, $compile, $rootScope, excelFactory, screenHeight, $location) {
    return {
        restrict: 'E',
        templateUrl: 'Partials/Templates/GridTemplate.html',
        replace: true,
        scope: {
            columns: '=',
            data: '=',
            isDataLoaded: '=',
            filterFields: '=?',
            saveOriginalFilters: '=?',
            clickEvent: '&?',
            dbClickEvent: '&?',
            expandrowtemplate: '@',
            expandedrowclass: '@',
            rowClass: '@?',
            footerText: '@?',
            fixedHeight: '@?',
            isSub: '@?',
            //required when 2 grids in one page
            gridIdentity: '@?',
            showAll: '=?'
		},

		link: function (scope, elem, attr) {
			var item;
			var status;


            //in first grid load
            if (!$rootScope.gridData)
                $rootScope.gridData = {};

            scope.currentPathIdentity = $location.path().split('/')[1] + (scope.gridIdentity ? scope.gridIdentity : '');

            if (!$rootScope.gridData[scope.currentPathIdentity])
                $rootScope.gridData[scope.currentPathIdentity] = {};

            if (!angular.equals($rootScope.gridData[scope.currentPathIdentity], {})) {
                scope.filterFields = $rootScope.gridData[scope.currentPathIdentity].filters;
                scope.currentsort = $rootScope.gridData[scope.currentPathIdentity].sort;
            }
            else {
                scope.filterFields = angular.isDefined(scope.filterFields) ? scope.filterFields : {};
                scope.currentsort = angular.isDefined(scope.currentsort) ? scope.currentsort : {};
            }

            scope.$on("$destroy", function () {
                if ($rootScope.gridData[scope.currentPathIdentity])
                    $rootScope.gridData[scope.currentPathIdentity] = { filters: scope.filterFields, sort: scope.currentsort };
            });


            $rootScope.$watch(function () {
                return $location.path();
            }, function (value, oldValue) {
                if (value != oldValue)
                    $rootScope.gridData[scope.currentPathIdentity] = undefined;
            });


            scope.saveOriginalFilters = angular.isDefined(scope.saveOriginalFilters) ? scope.saveOriginalFilters : false;
            scope.sortFields = [];

            scope.count = 0;
            scope.start = 0;
            scope.end = 0;

            //Temp variables
            scope.filteredData = [];
            scope.dataLength = '0';
            scope.columnsWidth = [];


            var columnsCount = 0;
            scope.$watch('columns', function () {

                var columnsCount = 0;
                scope.columnsWidth = [];

				angular.forEach(scope.columns, function (value, key) {

						scope.sortFields.push({ name: value.fieldName, value: true });
                    //columnsCount += angular.isString(value.width) || value.type == 'hidden' ? 0 : value.width ? value.width : 1;
                    columnsCount += value.type == 'hidden' ? 0 : value.weight ? value.weight : 1;
                });

                if (columnsCount > 0)
                    angular.forEach(scope.columns, function (col, index) {
                        scope.columnsWidth[index] = (100 / columnsCount) * (col.weight ? col.weight : 1) + '%';
                    });
            }, true);

            scope.changeSelected = function (fieldName) {
                scope.selectAll = !scope.selectAll;

                if (scope.selectAll) {
                    $rootScope.selectAll = scope.selectAll;
                    angular.forEach(($filter('orderBy')($filter('filter')(scope.data, scope.filterFields), scope.currentsort.name, scope.currentsort.value)), function (item) {
                        item.bChecked = scope.selectAll;
                    });
                }
                else
                    angular.forEach(scope.data, function (item) {
                        item.bChecked = scope.selectAll;
                    });
            };

            scope.sort = function (col, field, sortedIndex) {
                if (col.sort == true || col.sort == undefined) {
                    scope.currentsort = $filter('filter')(scope.sortFields, { name: field }, true)[0];
                    angular.forEach(scope.sortFields, function (value, key) {
                        if (value != scope.currentsort)
                            value.value = true;
                    });
                    scope.currentsort.value = !scope.currentsort.value;
                    if (scope.currentsort.value)
                        scope.sortedIndex = sortedIndex;
                    scope.refreshFilteredDate();
                    scope.goToFirstPage();
                }
            };

            window.onresize = function () {
                $timeout(function () {
                    if (scope.isSub == "true") {
                        scope.screenHeight = null;
                        return;
                    }
                    screenHeight.getScreenHeight('.gridBody', 90, function (result) {
                        scope.screenHeight = scope.fixedHeight ? scope.fixedHeight : result;
                    });
                });
            };
            window.onresize();

            scope.$on('clearFilter', function (scopeDetails, data) {
                if (data.id == scope.gridIdentity) {
                    scope.sortFields = [];
                    scope.currentsort = {};
                    scope.filterFields = {};
                    angular.forEach(scope.columns, function (value, key) {
                        scope.sortFields.push({ name: value.fieldName, value: true });
                    });
                    if (scope.saveOriginalFilters)
                        scope.filterFields = angular.copy(scope.originalfilters);
                    scope.refreshFilteredDate();
                }
            });

			scope.refreshFilteredDate = function () {
				if (scope.filterFields.nBankHours) {
					var data = [];
					angular.forEach(scope.data, function (value) {
						if (value.nBankHours <= parseInt(scope.filterFields.nBankHours))
							data.push(value);
					});
					//var data = scope.data.filter(word => word <= parseInt(scope.filterFields.nBankHours));
				}
				else
					if (scope.filterFields.iStatusId )
					{
						item = Object.assign({}, scope.filterFields);
						if (item.iStatusId)
							item.iStatusId = undefined;
						item.status = scope.filterFields.iStatusId
						var data = ($filter('orderBy')($filter('filter')(scope.data, item), scope.currentsort.name, scope.currentsort.value));
					

					}

					else {
						var data = ($filter('orderBy')($filter('filter')(scope.data, scope.filterFields), scope.currentsort.name, scope.currentsort.value));
					}
			
                if (scope.showAll)
                    scope.filteredData = data;
                else
                    scope.filteredData = data.slice(scope.start, scope.end);
                scope.dataLength = $filter('number')(data.length);
                angular.forEach(scope.columns, function (col) {
					if (col.doSum) {
						var sum = $filter('number')($filter('sumByField')(data, "iTimeTranslation"));
						var sum2 = $filter('number')($filter('sumByField')(data, "iTimeWaiting"));
                        if (sum.indexOf(',') != -1) {
                            sum = sum.split(',');
                            sum = sum[0] + sum[1];
						}
						if (sum2.indexOf(',') != -1) {
							sum2 = sum2.split(',');
							sum2 = sum2[0] + sum2[1];
						}
						sum = parseInt(sum, 10);
						sum2 = parseInt(sum2, 10);
						sum = sum + sum2;
                        sum /= 60;
                        col['sumByField'] = sum;
                        col['sumByField'] = parseFloat(col['sumByField']).toFixed(2);
                    }
                });
                $rootScope.$broadcast('updateDataLength', {
                    id: scope.gridIdentity,
                    length: data.length
                });
            };

			scope.$on('exportToExcel', function (scopeDetails, data) {
				//if (data.id == scope.gridIdentity) {
				alert("לחץ אישור להפקת הדוח")

			
				excelFactory.excelExport(data.fileName, scope.columns, $filter('orderBy')($filter('filter')(scope.data, scope.filterFields), scope.currentsort.name, scope.currentsort.value));
				//}
			});


            var dataWatch = scope.$watch('isDataLoaded', function (newValue) {
                if (scope.data != undefined) {
                    angular.forEach(scope.columns, function (item, index) {
                        if (item.type == 'date') {
                            scope.columns.push({
                                title: '',
                                fieldName: item.fieldName + '_original',
                                //width: '0%',
                                filter: true,
                                type: 'hidden'
                            });
                            scope.sortFields.push({ name: item.fieldName + '_original', value: true });
                            angular.forEach(scope.data, function (data) {
                                //data[item.fieldName + '_original'] = $filter('dateObjFromServer')(data[item.fieldName]);
                                //data[item.fieldName] = $filter('dateFromServer')(data[item.fieldName]);
                                data[item.fieldName + '_original'] = data[item.fieldName];
                                //if (item.type == 'format')
                                if (data[item.fieldName] != undefined && data[item.fieldName] != null && data[item.fieldName] != "")
                                    data[item.fieldName] = $filter('date')(data[item.fieldName], 'dd/MM/yyyy');
                            });
                        }

                        if (item.type == 'time') {
                            scope.columns.push({
                                title: '',
                                fieldName: item.fieldName + '_original',
                                //width: '0%',
                                filter: true,
                                type: 'hidden'
                            });
                            scope.sortFields.push({ name: item.fieldName + '_original', value: true });
                            angular.forEach(scope.data, function (data) {
                                //data[item.fieldName + '_original'] = $filter('dateObjFromServer')(data[item.fieldName]);
                                //data[item.fieldName] = $filter('dateFromServer')(data[item.fieldName]);
                                data[item.fieldName + '_original'] = data[item.fieldName];
                                //if (item.type == 'format')
                                if (data[item.fieldName] != undefined && data[item.fieldName] != null && data[item.fieldName] != "")
                                    data[item.fieldName] = $filter('date')(data[item.fieldName], 'HH:mm');
                            });
						}


						//if (item.type == 'timeRound') {
						//	scope.columns.push({
						//		title: '',
						//		fieldName: item.fieldName + '_original',
						//		//width: '0%',
						//		filter: true,
						//		type: 'hidden'
						//	});
						//	scope.sortFields.push({ name: item.fieldName + '_original', value: true });
						//	angular.forEach(scope.data, function (data) {
						//		//data[item.fieldName + '_original'] = $filter('dateObjFromServer')(data[item.fieldName]);
						//		//data[item.fieldName] = $filter('dateFromServer')(data[item.fieldName]);
						//		data[item.fieldName + '_original'] = data[item.fieldName];
						//		//if (item.type == 'format')
						//		if (data[item.fieldName] != undefined && data[item.fieldName] != null && data[item.fieldName] != "") {
						//			data[item.fieldName] = $filter('date')(data[item.fieldName], 'HH:mm');
						//			if (data[item.fieldName].substring(3, 4) == 3)
						//				data[item.fieldName] = data[item.fieldName].substring(0, 2) + '.50'
						//			else
						//				data[item.fieldName] = data[item.fieldName].substring(0, 2) + '.00'

						//		}
						//	});
						//}

                        //if not defined boolean text
                        if (item.type == 'boolean') {
                            angular.forEach(scope.data, function (data) {
                                item.fieldName = item.compareField + '_toCompare';
                                data[item.fieldName] = data[item.compareField] ? 'כן' : 'לא';

                            });
                        }
                        //var filterVal = scope.data[item.fieldName];
                        //if (item.type == 'format') {
                        //    if (item.formatterVal)
                        //        filterVal = $filter(item.formatter)(filterVal, item.formatterVal);
                        //    else
                        //        filterVal = $filter(item.formatter)(filterVal);
                        //}

                    });

                    $rootScope.$broadcast('getPagingData',
						{
						    callback: function (data) {
						        scope.count = data.count;
						        scope.start = data.start;
						        scope.end = data.end;
						        scope.refreshFilteredDate();
						    },
						    id: scope.gridIdentity
						});
                    //scope.goToFirstPage();
                    scope.scrollToTop();
                    if (scope.saveOriginalFilters)
                        scope.originalfilters = angular.copy(scope.filterFields);

                }
            }, true);

            scope.scrollToTop = function () {
                $timeout(function () {
                    try {
                        angular.element(".gridBody")[0].scrollTop = 0;
                    }
                    catch (err) {
                        console.log(err);
                    }
                });
            };

            scope.$watch('filterFields', function () {
                //order filters before refresh data
                angular.forEach(Object.keys(scope.filterFields), function (field, val) {
                    if (scope.filterFields[field] == '')
                        scope.filterFields[field] = undefined;
                });
                scope.goToFirstPage();
                if (scope.data != undefined)
                    scope.refreshFilteredDate();
            }, true);

            scope.goToFirstPage = function () {
                scope.start = 0;
                scope.end = scope.count;
            };

            //when the user paging, update the parameters
            $rootScope.$on('updatePagingDate', function (scopeDetails, data) {
                if (data.id == scope.gridIdentity) {
                    scope.count = data.count;
                    scope.start = data.start;
                    scope.end = data.end;
                    scope.refreshFilteredDate();
                    scope.scrollToTop();
                }
            });

        }
    }
})
	.directive('compileData', function ($compile) {
	    return {
	        scope: true,
	        link: function (scope, element, attrs) {
	            var elmnt;
	            attrs.$observe('template', function (myTemplate) {
	                if (angular.isDefined(myTemplate) && myTemplate != '') {
	                    elmnt = $compile(myTemplate)(scope);
	                    element.html(""); // dummy "clear"
	                    element.append(elmnt);
	                }
	            });
	        }
	    };
	});
