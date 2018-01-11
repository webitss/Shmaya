companionApp.directive('dateRtl', function ($timeout, $compile, $filter) {
        var uniqueId = 1;
        return {
            restrict: 'E',
            require: '?ngModel',
            template: '<div><div ng-disabled="ngDisabled" class="date-wrapper form-control" style="height: 30px !important;">' +
            '<input style="border: none !important; height: 30px !important;" ng-disabled="ngDisabled" id="date-picker{{uniqueId}}" class="date-default" type="date"' +
            'ng-model="ngModel"' +
            'ng-style="isRTL ? {\'right\' : 0, \'padding-right\' : \'5px\'} : {\'left\' : 0, \'padding-left\' : \'5px\'}">' +
            '<input style="border: none !important" ng-disabled="ngDisabled" ng-focus="focusDatePicker()" nh-blur="blurDatePicker()" ng-style="isRTL ? {\'right\' : 0, \'margin-right\' : \'1px\', \'padding-right\' : \'5px\'} : {\'left\' : 0, \'margin-left\' : \'1px\', \'padding-right\' : \'5px\'}" ' +
            'class="date-override form-control"' +
            ' ng-model="overrideDate" ng-change="overrideDateChange()" placeholder="{{placeholder}}">' +
            '</div></div>',
            replace: true,
            scope: {
                ngModel: '=',
                minDate: '=?',
                maxDate: '=?',
                //showError: '=?',
                dateChange: '&?',
                ngDisabled: '=?',
                placeholder: '@'
            },
            link: function (scope, element, attr, ngModel) {

                ngModel.$name = scope.$eval(attr.name)
                scope.formController = element.controller('form') || {$addControl: angular.noop};
                scope.formController.$addControl(ngModel);

                scope.$on('$destroy', function () {
                    if (!attr.required) return;
                    try {
                        scope.formController.$removeControl(ngModel);
                    }
                    catch (e) {
                        console.log(e);
                    }
                });

                scope.uniqueId = uniqueId;
                uniqueId++;
                scope.ngDisabled = angular.isDefined(scope.ngDisabled) ? scope.ngDisabled : false;
                scope.placeholder = angular.isDefined(scope.placeholder) ? scope.placeholder : '';

                scope.overrideDate = '';
                scope.isRTL = (window.navigator.userLanguage || window.navigator.language) == 'he';
                scope.validationDateFormat = 'yyyy-MM-dd';
                scope.displayDateFormat = 'dd/MM/yyyy';
                scope.minDateRange = '';
                scope.maxDateRange = '';

                scope.focused = false;
                scope.focusDatePicker = function () {
                    if (!scope.focused) {
                        $timeout(function () {
                            scope.focused = true;
                            element[0].querySelector('#date-picker' + scope.uniqueId).focus();
                            $timeout(function () {
                                element[0].querySelector('.date-override').focus();
                            }, 1000);
                        });
                    }
                };

                scope.blurDatePicker = function () {
                    scope.focused = false;
                };

                scope.$watchGroup(['minDate', 'maxDate'], function (newValue, oldValue) {

                    $timeout(function () {
                        var input = element[0].querySelector('#date-picker' + scope.uniqueId);
                        if (scope.minDate) {
                            scope.minDate.setHours(0, 0, 0, 0);
                            scope.minDateRange = $filter('date')(scope.minDate, scope.validationDateFormat);
                            if (scope.minDateRange != '')
                                input.setAttribute("min", $filter('date')(scope.minDate, scope.validationDateFormat));
                        }
                        if (scope.maxDate) {
                            scope.maxDate.setHours(23, 59, 59, 59);
                            input.setAttribute("max", $filter('date')(scope.maxDate, scope.validationDateFormat));
                        }
                        scope.doValidation();
                    });
                });

                scope.$watch('ngModel', function (newValue, oldValue) {
                    scope.overrideDate = $filter('date')(scope.ngModel, scope.displayDateFormat);
                    scope.dateValueChange();
                    if ((newValue && !oldValue) || (newValue && oldValue && newValue.getTime() != oldValue.getTime())) {
                        scope.doValidation();
                    }
                }, true);


                scope.overrideDateChange = function () {
                    var date = scope.overrideDate;
                    // var split = date.split("/");
                    // if (!(split.length == 3 && split[0].length == 2 && split[1].length == 2 && split[2].length == 4)) {
                    //     scope.pushError('invalid');
                    //     scope.pushError('required');
                    //     if (date == '')
                    //         scope.ngModel = null;
                    //     scope.dateValueChange();
                    //     return;
                    // }

                    if ((!date || date == "") && attr.required) {
                        scope.pushError('required');
                        return;
                    }
                    else {
                        var split = date.split("/");
                        if (!(split.length == 3 && split[0].length == 2 && split[1].length == 2 && split[2].length == 4)) {
                            scope.pushError('invalid');
                            return;
                        }
                    }

                    scope.popError('invalid');
                    scope.popError('required');

                    scope.ngModel = $filter('newDateWithFormat')(scope.overrideDate);
                    scope.dateValueChange();
                };

                scope.dateValueChange = function () {
                    if (scope.dateChange)
                        scope.dateChange();
                };

                scope.doValidation = function () {

                    scope.popError('invalid');
                    scope.popError('required');
                    scope.popError('max');
                    scope.popError('min');

                    if (!ngModel.$modelValue || ngModel.$modelValue == "Invalid Date") {
                        ngModel.$modelValue = null;
                        scope.pushError('invalid');
                        scope.pushError('required');
                        return;
                    }
                    if (scope.maxDate && ngModel.$modelValue && ngModel.$modelValue.getTime() > scope.maxDate.getTime()) {
                        scope.pushError('invalid');
                        scope.pushError('max');

                    }
                    if (scope.minDate && ngModel.$modelValue && ngModel.$modelValue.getTime() < scope.minDate.getTime()) {
                        scope.pushError('invalid');
                        scope.pushError('min');
                    }
                };

                scope.pushError = function (error) {
                    if (!attr.required) return;
                    try {
                        ngModel.$error[error] = true;
                        //to be supported in 'show-error' directive
                        scope.formController[attr.name]['$' + error] = true;
                        var errorList = scope.formController.$error[error];
                        if (!errorList) {
                            scope.formController.$error[error] = [];
                            errorList = scope.formController.$error[error];
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
                        console.log(e);
                    }
                };

                scope.popError = function (error) {
                    if (!attr.required) return;
                    try {
                        ngModel.$error[error] = false;
                        //to be supported in 'show-error' directive
                        scope.formController[attr.name]['$' + error] = false;
                        var errorList = scope.formController.$error[error];
                        if (!errorList) return;
                        angular.forEach(errorList, function (item, index) {
                            if (item.$name == attr.name)
                                errorList.splice(index, 1);
                        });

                        if (errorList.length == 0)
                            delete scope.formController.$error[error];
                    }
                    catch (e) {
                        console.log(e);
                    }
                };
            }
        }
    }
);