companionApp.directive('wait', function ($rootScope) {
        return {
            restrict: 'E',
            template: '<div class="modal-backdrop fade in wait" ng-show="$root.isWait">' +
            '              <div id="loader-wrapper">' +
            '                   <svg version="1.1" class="svg-loader" x="0px" y="0px" viewBox="0 0 80 80" xml:space="preserve">' +
            '                        <path id="spinner" fill="#0382C6" d="M40,72C22.4,72,8,57.6,8,40C8,22.4,22.4,8,40,8c17.6,0,32,14.4,32,32c0,1.1-0.9,2-2,2s-2-0.9-2-2c0-15.4-12.6-28-28-28S12,24.6,12,40s12.6,28,28,28c1.1,0,2,0.9,2,2S41.1,72,40,72z"></path>' +
            '                   </svg>' +
            '              </div>' +
            '          </div>',
            replace: true,
            scope: {},
            link: function (scope, elem, attr) {
                //$rootScope = $rootScope;
                //alert($rootScope);
                //scope.isWait = $rootScope.isWait;
            }
        }
    }
);