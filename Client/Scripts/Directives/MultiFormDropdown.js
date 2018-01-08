companionApp.directive('multiFormDropdown', function ($timeout, $window, $filter, $rootScope) {
    return {
        restrict: 'E',
        require: '^ngModel',
        templateUrl: 'Partials/Templates/multiFormDropdownTemplate.html' + $rootScope.appVersionParameter,
        replace: false,
        scope: {
            ngModel: '=',
            title: '@',
            data: '=',
            filter: '=',
            datafield: '@',
            identityfield: '@',
            submit: '&',
            disabled: '=',
            enablesearch: '=',
            multiselecttext: '@'
        },
        link: function (scope, elem, attr, ngModel) {
            //scope.data = angular.copy(scope.data);


            scope.filteredData = [];

            scope.refreshFilteredData = function () {
                scope.filteredData = $filter('filter')($filter('filter')(scope.data, scope.filter, true), { '$': scope.filterText });
            };

            scope.$watch('filter', function (newValue) {
                scope.refreshFilteredData();
            }, true);

            var getTopOffset = function () {
                if (elem.offset().top > 0) {
                    scope.screenHeight = $window.innerHeight - elem.offset().top - 150 + "px";

                }
                else {
                    $timeout(getTopOffset, 20);
                }
            };


            $timeout(function () {
                getTopOffset();
                if (attr.required)
                    ngModel.$error.required = ngModel.$modelValue == [];
                //default is the codeTable structure
                scope.identityfield = angular.isDefined(scope.identityfield) ? scope.identityfield : 'iId';
                scope.datafield = angular.isDefined(scope.datafield) ? scope.datafield : 'nvName';
                scope.enablesearch = angular.isDefined(scope.enablesearch) ? scope.enablesearch : true;
                scope.title = angular.isDefined(scope.title) ? scope.title : '';
                scope.filter = angular.isDefined(scope.filter) && scope.filter ? scope.filter : [];
                scope.multiselecttext = angular.isDefined(scope.multiselecttext) ? scope.multiselecttext : '';
            }
			);

            scope.focusInput = function () {
                scope.aaa = !scope.aaa;
                $timeout(function () {
                    elem[0].querySelector('#searchText').focus();
                });
            };

            scope.valueChange = function (val) {
                scope.searchText = '';
                val.selected = !val.selected;
                var value = val[scope.identityfield];
                if (!val.selected) {
                    //ngModel.$modelValue.pop(value);
                    var index = ngModel.$modelValue.indexOf(value);
                    ngModel.$modelValue.splice(index, 1);
                }
                else
                    ngModel.$modelValue.push(value);
                if (attr.required)
                    ngModel.$error.required = ngModel.$modelValue == [];
                ngModel.$dirty = true;
                //$timeout(function () {
                //    //scope.onchange();
                //});

            };

            scope.clearFilter = function () {
                scope.filterText = '';
                ngModel.$setViewValue([]);
                angular.forEach(scope.data, function (item) {
                    item.selected = false;
                });
                if (attr.required)
                    ngModel.$error.required = true;
                scope.refreshFilteredData();
                //check if originalSelectedValue exist in the filtered data, maybe the filters changed
                $timeout(function () {
                    if (scope.submit)
                        scope.submit();
                    //scope.clearfilter();
                });
            };

            var dataWatch = scope.$watch('data', function (newValue) {
                if (newValue) {
                    scope.originalngModel = angular.copy(ngModel.$modelValue);
                    //select the selected
                    $timeout(function () {
                        angular.forEach(scope.data, function (item) {
                            if (ngModel.$modelValue.indexOf(item[scope.identityfield]) > -1)
                                item.selected = true;
                        });
                        scope.refreshFilteredData();
                    }, 500);

                    if (attr.required)
                        ngModel.$error.required = ngModel.$modelValue == [];
                    //support refresh data
                    //dataWatch();
                }
            });

        }
    }
}
);