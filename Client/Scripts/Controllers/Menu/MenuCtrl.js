/// <reference path="../../../Partials/Pages/Messages/Messages.html" />
companionApp.controller('MenuCtrl', ['$scope', '$location', '$rootScope', 'codeTablesId', function ($scope, $location, $rootScope, codeTablesId) {
    $scope.isLogin = false;
    $scope.index = 0;
	$scope.active = 0;
	

    $scope.tabs =
         [
			{
                text: 'הזמנות',
                url: '/OrdersTabs'
            },
            {
                text: 'אלפון',
                url: '/ABCBookTabs'
            },
            {
                text: 'שליחת הודעות',
                url: '/Messages'
            },
            {
                text: 'הגדרות',
                url: '/SettingsTabs'
            },
            {
                text: 'דוחות',
                url: '/ReportsTabs'
			}
		];


    $scope.notification = function (alert) {
        $rootScope.notificationAlert = alert;
        $timeout(function () {
            $rootScope.notificationAlert = "";
        }, 1500);
    };

	$scope.navigate = function (page, index) {
        if (!$scope.tabs[index].url) return;
        $scope.index = index;
        $location.path(page);
    }

    //$scope.$watch(function () {
    //    return $location.path();
    //}, function (value, oldValue) {
    //    $scope.index = $scope.tabs.indexOf($filter('filter')($scope.tabs, { url: value }, true)[0]);
    //});


	$scope.tabClick = function (tab, index) {
        if (!$scope.tabs[index].url) return;
        $scope.index = index;
        changesAlert.alert(function () {
            if (tab.url != '') {
                //reload page
                if ($location.path() == tab.url) {
                    $route.reload();
                }
                else {
                    $location.path(tab.url);
                    $location.search({});
                }
            }
        });
    };

    $rootScope.$on('goToTab', function (event, index) {
        $scope.tabClick($scope.tabs[index], index);
    });
}]);

