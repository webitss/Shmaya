"use strict"
//var mainApp = angular.module('mainApp', ['ngAnimate', 'ngRoute', 'ngStorage', 'ui.bootstrap', 'fundoo.services', 'ngSanitize', 'angularFileUpload', 'ui.calendar', 'ngAutocomplete']);
var companionApp = angular.module('companionApp', ['ngRoute', 'ngAnimate', 'ngAutocomplete', 'ui.bootstrap', 'fundoo.services','angularFileUpload']);
companionApp.config(['$routeProvider', '$compileProvider', function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'Partials/Pages/Login.html' + appVersionParameter,
			controller: 'LoginCtrl'
		})
		.when('/login', {
			templateUrl: 'Partials/Pages/Login.html' + appVersionParameter,
			controller: 'LoginCtrl'
		})
		.when('/ABCBookTabs', {
			templateUrl: 'Partials/Pages/ABCBook/ABCBookTabs.html' + appVersionParameter,
			controller: 'ABCBookTabsCtrl'
		})

		.when('/SettingsTabs', {
			templateUrl: 'Partials/Pages/Settings/SettingsTabs.html' + appVersionParameter,
			controller: 'SettingTabsCtrl'
		})
		.when('/Messages', {
			templateUrl: 'Partials/Pages/Messages/Messages.html' + appVersionParameter
			,controller: 'MessagesCtrl'
		})
		.when('/ReportsTabs', {
			templateUrl: 'Partials/Pages/Reports/ReportsTabs.html' + appVersionParameter,
			controller: 'ReportsTabsCtrl'
		})
		.when('/OrdersTabs', {
			templateUrl: 'Partials/Pages/Orders/OrdersTabs.html' + appVersionParameter,
			controller: 'OrdersTabsCtrl'
		});

	//app.config(['$qProvider', function ($qProvider) {
	//    $qProvider.errorOnUnhandledRejections(false);
}]);


companionApp.run(function ($rootScope, $location, connect, $timeout, $window) {

	//throw the event for 'screen height' refresh need after scrolling
	window.onmousewheel = function (e) {
		$rootScope.$broadcast('windowMousewheel')
	}

	$rootScope.notificationAlert = "";
	$rootScope.notification = function (alert) {
		$rootScope.notificationAlert = alert;
		$timeout(function () {
			$rootScope.notificationAlert = "";
		}, 1500);
	};

	$rootScope.appVersionParameter = appVersionParameter;
	$rootScope.$watch(function () {
		return $location.path();
	}, function (value, oldValue) {
		$rootScope.isLogin = !!($location.$$url == '/Login' || $location.$$url == '/');
		var currentURL = $location.$$absUrl;
		if (currentURL != '/Login' && currentURL != '/') {
			if ($rootScope.user == null || $rootScope.user == undefined) {
				var userJson = localStorage.getItem('AyeletHashacharCompanionship');
				if (userJson != 'null' && userJson != null) {
					$rootScope.isLogin = false;
					$rootScope.user = JSON.parse(userJson);
					$location.path('/ABCBook');
				} else {
					$location.path('/');
					// $rootScope.subMenu = 0;
				}
			}
		}
	});
});