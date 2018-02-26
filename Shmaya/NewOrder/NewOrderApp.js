"use strict"
var a;
var NOApp = angular.module('NOApp', ['ngRoute', 'ui.bootstrap', 'fundoo.services','signature']);

NOApp.config(function ($routeProvider, $compileProvider) {
    $routeProvider
        .when('/', {
            //controller: 'NewOrderCtrl',
            templateUrl: 'shmaya.html'
		})
		.when('/pdfReport', {
			//controller: 'NewOrderCtrl',
			templateUrl: 'pdfReport.html'
		})
        .otherwise({
            redirectTo: '/'
        });
});

//NOApp.run(function ($rootScope, $location) {
//    $location.path('/')
//});