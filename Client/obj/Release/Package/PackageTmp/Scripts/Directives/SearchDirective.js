companionApp.directive('search', function ($timeout, $rootScope) {
    return {
        restrict: 'E',
        templateUrl: 'Partials/Templates/SearchTemplate.html' + $rootScope.appVersionParameter,
        replace: true,
        scope: {
            searchmodel: '=',
            searchtext: '@'

        },
        link: function (scope, elem, attr) {
            $timeout(function () {

            });
            scope.onClick = function () {
                $timeout(function () {
                    elem[0].querySelector('#searchText').focus();
                });
            }

        }
    }
})
;