companionApp.directive('dropdown', function ($timeout, $filter, $window, $rootScope) {
        return {
            restrict: 'E',
            templateUrl: 'Partials/Templates/DropdownTemplate.html' + $rootScope.appVersionParameter,
            replace: true,
            scope: {
                title: '@',
                data: '=',
                filter: '=',
                selectedvalue: '=',
                datafield: '@',
                identityfield: '@',
                onchange: '&',
                clearfilter: '=',
                onclearfilter: '&',
                ismulti: '=',
                multivalues: '=',
                disabled: '=?',
                enablesearch: '=',
                putdefultvalue: '=',
                emptytext: '@',
                multiselecttext: '@',
                defultvalue: '=',
                isbig: '@',
                showsubmitbutton: '=',
                showheader: '=',
                submitcallback: '&',
                dynamicstyle: '='
            },
            link: function (scope, elem, attr) {
                $timeout(function () {
                        getTopOffset();
                        //default is the codeTable structure
                        scope.identityfield = angular.isDefined(scope.identityfield) ? scope.identityfield : 'iId';
                        scope.datafield = angular.isDefined(scope.datafield) ? scope.datafield : 'nvName';
                        scope.enablesearch = angular.isDefined(scope.enablesearch) ? scope.enablesearch : true;
                        scope.title = angular.isDefined(scope.title) ? scope.title : '';
                        scope.putdefultvalue = angular.isDefined(scope.putdefultvalue) ? scope.putdefultvalue : true;
                        scope.ismulti = angular.isDefined(scope.ismulti) ? scope.ismulti : false;
                        scope.multivalues = angular.isDefined(scope.ismulti) && !scope.multivalues ? [] : scope.multivalues;
                        scope.filter = angular.isDefined(scope.filter) && !scope.filter ? [] : scope.filter;
                        scope.filter = angular.isDefined(scope.filter) && scope.filter ? scope.filter : [];
                        scope.isbig = angular.isDefined(scope.isbig) ? scope.isbig : false;
                        scope.clearfilter = angular.isDefined(scope.clearfilter) ? scope.clearfilter : true;
                        scope.submitcallback = angular.isDefined(scope.submitcallback) ? scope.submitcallback : true;
                        scope.emptytext = angular.isDefined(scope.emptytext) ? scope.emptytext : 'בחר ערך';
                        scope.multiselecttext = angular.isDefined(scope.multiselecttext) ? scope.multiselecttext : '';
                        scope.showsubmitbutton = angular.isDefined(scope.showsubmitbutton) ? scope.showsubmitbutton : false;
                        scope.showheader = angular.isDefined(scope.showheader) ? scope.showheader : true;

                        scope.userSelected = scope.putdefultvalue ? true : false;
                    }
                );


                var getTopOffset = function () {
                    if (elem.offset().top > 0) {
                        scope.screenHeight = $window.innerHeight - elem.offset().top - 150 + "px";

                    }
                    else {
                        $timeout(getTopOffset, 20);
                    }
                }

                scope.focusInput = function () {
                    $timeout(function () {
                        elem[0].querySelector('#searchText').focus();
                    });
                }

                scope.valueChange = function (val) {
                    scope.userSelected = true;
                    scope.selectedvalue = val[scope.identityfield];
                    $timeout(function () {
                        scope.onchange();
                    });
                    if (scope.ismulti) {
                        var indexOf = scope.multivalues.indexOf(val[scope.identityfield]);
                        if (indexOf == -1)
                            scope.multivalues.push(val[scope.identityfield]);
                        else scope.multivalues.splice(indexOf, 1);
                    }
                }

                scope.submitcallback = function () {
                    scope.multivalues = scope.data;
                }

                scope.clearFilter = function () {
                    scope.filterText = '';
                    //check if originalSelectedValue exist in the filtered data, maybe the filters changed
                    scope.setFirstValue(false);
                    if (scope.ismulti)
                        scope.multivalues = [];
                    if (!scope.putdefultvalue)
                        scope.userSelected = false;
                    $timeout(function () {
                        if (scope.onclearfilter)
                            scope.onclearfilter();
                        //scope.clearfilter();
                    });
                }

                scope.selectedValueFilter = function (row) {
                    // return (row[scope.identityfield] == scope.selectedvalue);
                    if (scope.ismulti && scope.multivalues.length == 1)
                        return (row[scope.identityfield] == scope.multivalues[0])
                    else return (row[scope.identityfield] == scope.selectedvalue);
                }

                scope.setFirstValue = function (isFirst) {
                    //if scope.selectedvalue already initialized
                    if (isFirst && scope.selectedvalue != undefined) {
                        if ($filter('filter')(scope.data, scope.selectedValueFilter, true).length > 0)
                            scope.userSelected = true;
                        return;
                    }
                    if (scope.defultvalue && scope.putdefultvalue)
                        scope.selectedvalue = scope.defultvalue;
                    else {
                        //    if ($filter('filter')($filter('filter')(scope.data, scope.filter, true), scope.originalSelectedValue, true).length > 0)
                        if (scope.originalSelectedValue)
                            scope.selectedvalue = scope.originalSelectedValue;
                        else if ($filter('filter')(scope.data, scope.filter, true)[0] && scope.putdefultvalue) {
                            scope.selectedvalue = $filter('filter')(scope.data, scope.filter, true)[0][scope.identityfield];
                            if (scope.ismulti && scope.putdefultvalue)
                                scope.multivalues.push(scope.selectedvalue);
                        }

                        //alert(scope.title + ' ' + scope.selectedvalue)
                        //    else
                        //        scope.selectedvalue = scope.data[0][scope.identityfield];
                    }
                };

                var dataWatch = scope.$watch('data', function (newValue) {
                    if (newValue && newValue.length > 0) {
                        scope.setFirstValue(true);
                        scope.originalSelectedValue = angular.copy(scope.selectedvalue);
                        dataWatch();
                    }
                }, true);

            }
        }
    }
)
;