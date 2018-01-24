companionApp.directive('formDropdown', function ($timeout, $window, $filter, $rootScope) {
        return {
            restrict: 'E',
            require: '^ngModel',
            templateUrl: 'Partials/Templates/FormDropdownTemplate.html' + $rootScope.appVersionParameter,
            replace: true,
            scope: {
                ngModel: '=',
                title: '@',
                data: '=',
                filter: '=?',
                datafield: '@?',
                identityfield: '@?',
                onchange: '&',
                disabled: '=?',
                enablesearch: '=?'
            },
            link: function (scope, elem, attr, ngModel) {

                ngModel.$name = scope.$eval(attr.name);
                scope.formController = elem.controller('form') || {$addControl: angular.noop};
                scope.formController.$addControl(ngModel);

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
                    console.log(key.which)
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
                                scope.valueChange(scope.filteredData()[scope.keyDown]);
                                //scope.status.isOpen = true;
                            }
                            break;
                    }
                    //scope.status.isopen = true;
                };

                scope.refreshFilteredData = function () {
                    scope.filteredData = $filter('filter')($filter('filter')(scope.data, scope.filter, true), {'$': scope.filterText});
                };

                var getTopOffset = function () {
                    if (elem.offset().top > 0) {
                        scope.screenHeight = $window.innerHeight - elem.offset().top - 145;
                        if (scope.screenHeight < 50)
                            scope.screenHeight = 50;
                        scope.screenHeight += "px";


                    }
                    else {
                        $timeout(getTopOffset, 20);
                    }
                };

                //$window.onmousewheel = function () {
                //    alert(8);
                //   // getTopOffset();
                //}

               
                $rootScope.$on('windowMousewheel', function () {
                    getTopOffset();
                });

                $timeout(function () {
                        getTopOffset();
                        if (attr.required)
                            scope.putValidation(!ngModel.$modelValue || ngModel.$modelValue == -1);
                        //default is the codeTable structure
                        scope.identityfield = angular.isDefined(scope.identityfield) ? scope.identityfield : 'iId';
                        scope.datafield = angular.isDefined(scope.datafield) ? scope.datafield : 'nvName';
                        scope.enablesearch = angular.isDefined(scope.enablesearch) ? scope.enablesearch : true;
                        scope.title = angular.isDefined(scope.title) ? scope.title : '';
                        scope.filter = angular.isDefined(scope.filter) && scope.filter ? scope.filter : [];
                    }
                );

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
                    scope.onchange({item: val});
                    //});
                    scope.keyDown = -1;
                    scope.searchText = '';
                    ngModel.$setViewValue(val[scope.identityfield]);
                    if (attr.required)
                        scope.putValidation(!ngModel.$modelValue || ngModel.$modelValue == -1);
                    ngModel.$dirty = true;


                };

                scope.clearFilter = function () {
                    scope.filterText = '';
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

                var dataWatch = scope.$watch('data', function (newValue) {

                    if (newValue ) {
                        scope.originalngModel = angular.copy(ngModel.$modelValue);
                        scope.refreshFilteredData();
                        if (attr.required)
                            scope.putValidation(!ngModel.$modelValue || ngModel.$modelValue == -1);
                        //support refresh data
                        //dataWatch();
                    }
                });

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
    }
);