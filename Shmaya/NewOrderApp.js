"use strict"
var a = 2;
var orderApp = angular.module('orderApp', ['ngRoute', 'fundoo.services']);
orderApp.config(['$routeProvider', '$compileProvider', function ($routeProvider) {
    $routeProvider
		.when('/', {
		    templateUrl: 'shmaya.html' + appVersionParameter,
		    controller: 'NewOrderCtrl'
		})
        .when('/shmaya', {
            templateUrl: 'shmaya.html' + appVersionParameter,
            controller: 'NewOrderCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);