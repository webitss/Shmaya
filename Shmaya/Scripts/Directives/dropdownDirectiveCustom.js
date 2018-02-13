myApp.directive('formDropdownCustom', function ($timeout, $window, $filter, $rootScope, language) {
    return {
        restrict: 'E',
        require: '^ngModel',
        templateUrl: 'Pages/Template/DropdownTemplate.html' + $rootScope.appVersionParameter,
        replace: true,
        scope: {
            ngModel: '=',
            spanText: '@?',
            data: '=',
            filterBy: '=',
            datafield: '@',
            identityfield: '@',
            onchange: '&',
            disabled: '=',
            enablesearch: '=',
            isSortRequired: '=?',
            largeList: '=?',
            sumworkers: '@?',
        },
        link: function (scope, elem, attr, ngModel) {

            ngModel.$name = scope.$eval(attr.name);
            scope.formController = elem.controller('form') || { $addControl: angular.noop };
            scope.formController.$addControl(ngModel);

            scope.getText = function (nvInternalTextName, dafaultText) {
                if ($rootScope.flagLanguage)
                    return language.getText(nvInternalTextName) ? language.getText(nvInternalTextName) : dafaultText;
                else
                    return dafaultText;
            };
            scope.chooseText = scope.getText('txt_Choose_159', 'בחר');

            scope.status = {
                isopen: false
            };
            scope.filter = {
                text: ''
            };

            scope.$on('$destroy', function () {
                try {
                    scope.formController.$removeControl(ngModel);
                }
                catch (e) {
                }
            });

            //scope.status = {isOpen: false};
            scope.keyDown = -1;
            scope.filteredData = [];

            scope.searchMouseOver = function (index) {
                scope.keyDown = index;
            };

            scope.keyUp = function (key) {
                switch (key.which) {
                    case 27:
                        //scope.status.isOpen = false;
                        break;
                    case 38:
                        scope.keyDown--;
                        if (scope.keyDown < 0)
                            scope.keyDown = scope.filteredData.length - 1;
                        break;
                    case 40:
                        scope.keyDown++;
                        if (scope.keyDown > scope.filteredData.length - 1)
                            scope.keyDown = 0;
                        break;
                    case 13:
                        if (scope.keyDown > -1) {
                            scope.valueChange(scope.filteredData[scope.keyDown]);
                            scope.status.isopen = false;
                        }
                        break;
                }
                //scope.status.isopen = true;
            };

            scope.$watch('filterBy', function () {
                if (scope.filterBy) {
                    scope.refreshFilteredData();
                }
            });

            scope.$watch('status.isopen', function () {
                //console.log(ngModel)
                if (!scope.status.isopen && scope.filter.text != '') {
                    if (scope.data) {
                        var arr = $filter('filter')(scope.data, function (row) {
                            return (row[scope.datafield] == scope.filter.text);
                        });
                        if (arr == undefined || arr.length == 0) {
                            var data = {};
                            data[scope.identityfield] = -1;
                            scope.valueChange(data);
                        }
                        else {
                            scope.valueChange(arr[0]);
                        }


                        //ngModel.$setViewValue(-1);
                        //scope.filter.text = '';

                    }

                }
            });

            scope.refreshFilteredData = function () {
                if (scope.data) {
                    var tempFilterData = $filter('filter')(scope.data, scope.filterBy, true);
                    scope.filteredData = $filter('filter')(tempFilterData, { '$': scope.filter.text });

                    var arr = $filter('filter')(tempFilterData, function (row) {
                        return (row[scope.identityfield] == ngModel.$viewValue);
                    });
                    if (arr == undefined || arr.length == 0) {
                        ngModel.$setViewValue(-1);
                    }
                }
            };

            var getTopOffset = function () {
                if (elem.offset().top > 0) {
                    scope.screenHeight = $window.innerHeight - elem.offset().top - 150;
                    if (scope.screenHeight < 200)
                        scope.screenHeight = 200;
                    scope.screenHeight += "px";


                }
                else {
                    $timeout(getTopOffset, 20);
                }
            };

            $timeout(function () {
                getTopOffset();
                if (attr.required)
                    scope.putValidation(!ngModel.$modelValue || ngModel.$modelValue == -1);
                //default is the codeTable structure
                scope.identityfield = angular.isDefined(scope.identityfield) ? scope.identityfield : 'iId';
                scope.datafield = angular.isDefined(scope.datafield) ? scope.datafield : 'nvName';
                scope.enablesearch = angular.isDefined(scope.enablesearch) ? scope.enablesearch : true;
                scope.spanText = angular.isDefined(scope.spanText) ? scope.spanText : '';
                scope.filter = angular.isDefined(scope.filterBy) && scope.filterBy ? scope.filterBy : [];
                scope.isSortRequired = angular.isDefined(scope.isSortRequired) ? scope.isSortRequired : true;
                scope.largeList = angular.isDefined(scope.largeList) ? scope.largeList : false;
                scope.sumworkers = angular.isDefined(scope.sumworkers) ? scope.sumworkers : -1;

                var dataWatch = scope.$watch('data', function (newValue) {
                    if (newValue) {
                        scope.originalngModel = angular.copy(ngModel.$modelValue);
                        scope.refreshFilteredData();
                        if (attr.required)
                            scope.putValidation(!ngModel.$modelValue || ngModel.$modelValue == -1);
                        //support refresh data
                        //dataWatch();
                    }
                });
            });

            scope.selectedValueFilter = function (row) {
                return (row[scope.identityfield] == ngModel.$modelValue);
            };

            scope.focusInput = function () {
                $timeout(function () {
                    elem[0].querySelector('#searchText').focus();
                });
            };

            scope.valueChange = function (val) {
                //$timeout(function () {
                //onchange method called first, because $setViewValue() change the old value in controller (example in ProgramStructure -> branchSemesters dropdown)
                scope.onchange({ item: val });
                //});
                scope.keyDown = -1;
                //scope.searchText = '';
                scope.filter.text = '';
                ngModel.$setViewValue(val[scope.identityfield]);
                if (attr.required)
                    scope.putValidation(!ngModel.$modelValue || ngModel.$modelValue == -1);
                ngModel.$dirty = true;


            };

            scope.clearFilter = function () {
                scope.filter.text = '';
                ngModel.$setViewValue(-1);
                if (attr.required)
                    scope.putValidation(true);
                scope.refreshFilteredData();
                //check if originalSelectedValue exist in the filtered data, maybe the filters changed
                $timeout(function () {
                    if (scope.onclearfilter)
                        scope.onclearfilter();
                    //scope.clearfilter();
                });
            };


            scope.putValidation = function (required) {
                scope.formController.$invalid = required || scope.formController.$invalid;
                scope.formController.$valid = !scope.formController.$invalid;

                if (required) {
                    try {
                        ngModel.$error['required'] = true;
                        //to be supported in 'show-error' directive
                        scope.formController[attr.name]['$invalid'] = true;
                        var errorList = scope.formController.$error['required'];
                        if (!errorList) {
                            scope.formController.$error['required'] = [];
                            errorList = scope.formController.$error['required'];
                        }

                        var exist = false;
                        angular.forEach(errorList, function (item, index) {
                            if (item.$name == attr.name) {
                                item = ngModel;
                                exist = true;
                            }
                        });
                        if (!exist)
                            errorList.push(ngModel);
                    }
                    catch (e) {
                        console.log(e)
                    }
                }
                else {
                    ngModel.$error['required'] = false;
                    //to be supported in 'show-error' directive
                    try {
                        scope.formController[attr.name]['$invalid'] = false;
                        var errorList = scope.formController.$error['required'];
                        if (!errorList) return;
                        angular.forEach(errorList, function (item, index) {
                            if (item.$name == attr.name)
                                errorList.splice(index, 1);
                        });

                        if (errorList.length == 0)
                            delete scope.formController.$error['required'];
                    }
                    catch (e) {
                        console.log(e)
                    }
                }
            };

        }
    }
});

myApp.filter('customOrder', function ($filter) {
    return function (item, prediate, isSortRequired) {
        if (!isSortRequired)
            return item;
        else {
            var result = $filter("orderBy")(item, prediate);
            return result;
        }

    }
});