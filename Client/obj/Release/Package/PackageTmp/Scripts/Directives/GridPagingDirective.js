companionApp.directive('gridPager', function ($timeout, $filter, $rootScope) {
    return {
        restrict: 'E',
        templateUrl: 'Partials/Templates/GridPagingTemplate.html',
        replace: true,
        scope: {
            //data: '=',
            paging: '=?',
            gridPagingIdentity: '@?'
        },
        link: function (scope, elem, attr) {

            //$timeout(function () {
            //    if (scope.paging == undefined)
            //        scope.paging = [25, 50, 75];
            scope.paging = angular.isDefined(scope.paging) ? scope.paging : [25, 50, 75];
            scope.end = scope.paging[Math.floor(scope.paging.length / 2)];
            scope.start = 0;
            scope.count = scope.end;
            //});

            scope.length = 0;

            scope.updateCount = function (count) {
                scope.count = count;
            };

            scope.showLoading = function () {
                $rootScope.isWait = true;
                try {
                    $rootScope.$digest();
                } catch (e) {

                }
                $timeout(function () {
                    $rootScope.isWait = false;
                });

            };

            scope.updateData = function (from, to) {
                scope.showLoading();
                $timeout(function () {
                    var length = scope.length;
                    if (from < 0)
                        scope.start = 0;
                    else
                        scope.start = from;
                    if (to > length)
                        scope.end = length;
                    else
                        scope.end = to;
                    scope.updatePagingInGrid();
                });

            };

            scope.goToPage = function (pageNumber) {
                scope.showLoading();
                $timeout(function () {
                    scope.start = pageNumber * scope.count;
                    scope.end = scope.start + scope.count;
                    scope.updatePagingInGrid();
                });
            };

            scope.getCurrentPage = function () {
                var count = Math.floor(scope.length / scope.count);
                var offset = scope.start / scope.count;
                var final = Math.abs(offset - count)
                return (count - final + 1)
            };

            //return array pages count length for "while" repeat
            scope.getPagesCountArray = function (num) {
                return new Array(num);
            };

            scope.updatePagingInGrid = function () {
                //update grid fore refresh the filteredData
                $rootScope.$broadcast('updatePagingDate', {
                    id: scope.gridPagingIdentity,
                    count: scope.count,
                    start: scope.start,
                    end: scope.end
                });
            };

            $rootScope.$on('getPagingData', function (scopeDetails, data) {
                if (data.id == scope.gridPagingIdentity) {
                    data.callback({
                        count: scope.count,
                        start: scope.start,
                        end: scope.end
                    })
                }
            });

            //when the filters changed
            $rootScope.$on('updateDataLength', function (scopeDetails, data) {
                if (data.id == scope.gridPagingIdentity)
                    scope.length = data.length;
            });

        }
    }
});
