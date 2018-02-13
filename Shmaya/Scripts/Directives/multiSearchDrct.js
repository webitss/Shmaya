/**
 * Created by user on 03/11/2015.
 */
companionApp.directive('searchInput', function($timeout, $filter) {
    return {
        restrict: 'E',
        template: '<div class="search-list" ng-mouseleave="updateOpenList(false); isShow = searchText == \'\' ? false : isShow" ng-class="{\'disabled-sign\' : disabled,\'ng-invalid-required\':requiredfield==null||requiredfield==-1}">' +
            '   <div class="search-input form-control secletion-search">' +

            '      <i class=" search-input-icon glyphicon glyphicon-triangle-bottom bcursor " ng-click="updateOpenList(true)" ng-show="bcursor == true"></i>' +
            '      <i class=" search-input-icon glyphicon glyphicon-remove " ng-click="disabled ? \'\' : initSearch()" ng-show="bcancel == true"></i>' +
            '      <div>' + /*ng-class="{\'col-md-8\':bcancel == true,\'col-md-9\':bcancel == false}"*/
            '           <input style="width:100%" ng-disabled="disabled" ng-class="{\'disabled-sign\' : disabled}" placeholder="{{placeholder}}" ng-change="searchText == \'\' ? initSearch() : \'\'" ' +
            '                  ng-keyup="searchKeyDown($event)" ng-model="searchText" ng-click="updateOpenList(true)"/>' +
            '      </div>' +
            '   </div>' +
       
            '<ul role="menu" aria-labelledby="single-button" class="search-items secletion-search-ul" ng-if="open || ((searchText && sourcedata | filter : searchText) && isShow)">'+
            '       <div vs-repeat>' +
            '           <li style = "" ng-repeat="d in filteredData | limitTo:18 track by $index" ng-class="{\'search-items-over\': keyDown == $index}" ng-mouseover="searchMouseOver($index)" ng-click="choose(d, $event)">' +
            '               <span ng-repeat="f in searchfield track by $index" style = "">{{d[f]}} </span>' +
            '           </li>' +
            '       </div>' +
            '      <li ng-if="islink" ng-click="linkFunc($event)" ng-class="{\'search-items-over\': keyDown == 100}" ng-mouseover="searchMouseOver(100)">' +
            '          <strong >{{linktext}} </strong>' +
            '      </li>' +
            '   </ul>' +

            '</div>',
        replace: true,
        scope: {
            placeholder: '@',
            sourcedata: '=',
            onchoose: '&',
            searchfield: '=',
            ismulti: '=',
            defultvalue: '=?', //TODO: ngModel
            identityfield: '@',
            searchText: '=?',
            ngchangefnc: '&',
            islink: '=?',
            linkaction: '&',
            linktext: '@',
            disabled: '=?',
            requiredfield: '=',
            bcancel: '=?',
            bcursor: '=?',
            inputclass: '@?'
        },
        link: function(scope, elem, attr) {

            scope.open = false;
            scope.search = [];

            scope.disabled = angular.isDefined(scope.disabled) ? scope.disabled : false;
            scope.bcancel = angular.isDefined(scope.bcancel) ? scope.bcancel : true;
            scope.bcursor = angular.isDefined(scope.bcursor) ? scope.bcursor : false;
            scope.islink = scope.islink || false;
            scope.placeholder = scope.placeholder || 'חפש...';
            scope.filteredData = [];

            scope.$watch('searchText', function() {
                if (scope.ngchangefnc)
                    scope.ngchangefnc({ searchText: scope.searchText });
            });
            //         $timeout(function () {
            scope.keyDown = -1;
            scope.choose = function(data, $event) {
                scope.open = false;

                $event['itemIndex'] = scope.filteredData.indexOf(data);
                scope.onchoose({ itemSearch: data, event: $event });

                scope.keyDown = -1;
                if (scope.ismulti) {
                    scope.searchText = '';
                } else {
                    scope.searchText = '';
                    angular.forEach(scope.searchfield, function(itemSearch, ind) {
                        scope.searchText += (scope.searchText != '' ? ' ' : '') + data[scope.searchfield[ind]];
                    });
                }
                scope.isShow = false;
            };

            scope.linkFunc = function($event) {
                $event['itemIndex'] = scope.filteredData.length;
                scope.linkaction({ event: $event });
            };

            scope.searchMouseOver = function(index) {
                scope.keyDown = index;
            };

            scope.searchKeyDown = function(key) {
                scope.isShow = true;
                switch (key.which) {
                    case 27:
                        scope.searchText = '';
                        break;
                    case 38:
                        scope.keyDown--;
                        if (scope.keyDown < 0)
                            scope.keyDown = scope.filteredData.length - 1;
                        break;
                    case 40:
                        scope.keyDown++;
                        if (scope.islink && scope.keyDown == scope.filteredData.length)
                            scope.keyDown = 100;
                        else if (scope.keyDown > scope.filteredData.length - 1)
                            scope.keyDown = 0;
                        break;
                    case 13:
                        if (scope.islink && scope.keyDown == 100)
                            scope.linkFunc(key);
                        else {
                            var data = scope.GetfilteredData();
                            if (data.length == 1)
                                scope.choose(data[0]);
                            else if (data.length > 1)
                                scope.choose(data[scope.keyDown]);
                            else
                                scope.choose(null);
                        }
                        break;
                    default:
                        scope.GetfilteredData();
                        break;
                }
            };

            scope.initSearch = function() {
                    scope.searchText = '';
                    scope.onchoose();
                    scope.GetfilteredData();
                }
                //        });

            scope.GetfilteredData = function() {
                scope.filteredData = [];
                if (undefined != $filter('filter')(scope.sourcedata, { search: scope.searchText }, false)) {
                    if (scope.searchText == '' || undefined == scope.searchText)
                        scope.filteredData = scope.sourcedata.slice(0, 18);
                    else
                        scope.filteredData = $filter('filter')(scope.sourcedata, { search: scope.searchText }, false).slice(0, 18);
                } else
                    scope.filteredData = [];
                return scope.filteredData;
            };

            scope.updateOpenList = function(val) {
                if (scope.open == false && val == true) {
                    scope.GetfilteredData()
                }
                scope.open = val;
            };

            // var defValWatch =
            scope.$watch('defultvalue', function(newValue, oldValue) {
                if (newValue != undefined && newValue != '' && scope.sourcedata)
                    scope.setDefaultValue();
                else
                    scope.searchText = '';
            }, true);

            scope.$watch('sourcedata', function(newValue, oldValue) {
                if (newValue && scope.defultvalue != undefined && scope.defultvalue != '' && scope.defultvalue != -1)
                    scope.setDefaultValue();
                scope.GetfilteredData();

                if (scope.searchfield.length == 2 && scope.sourcedata)
                    for (var i = 0; i < scope.sourcedata.length; i++) {
                        scope.sourcedata[i]['search'] = (scope.sourcedata[i][scope.searchfield[0]].trim() + ' ' + scope.sourcedata[i][scope.searchfield[1]].trim() + ' ' + scope.sourcedata[i][scope.searchfield[0]].trim()).trim();
                    }
                else
                if (scope.sourcedata)
                    for (var i = 0; i < scope.sourcedata.length; i++) {
                        scope.sourcedata[i]['search'] = scope.sourcedata[i][scope.searchfield].trim();
                    }
            }, true);

            scope.setDefaultValue = function() {
                angular.forEach(scope.sourcedata, function(value, key) {
                    if (value[scope.identityfield] == scope.defultvalue) {
                        scope.searchText = '';
                        angular.forEach(scope.searchfield, function(itemSearch, ind) {
                            scope.searchText += (scope.searchText != '' ? ' ' : '') + value[scope.searchfield[ind]];
                        });
                    }
                });
                //defValWatch();
                // dataWatch();
            };
        }
    }
});