"use strict"
var a;
var pdfReportApp = angular.module('pdfReportApp', ['ngRoute', 'ui.bootstrap', 'fundoo.services', 'signature']);

pdfReportApp.config(function ($routeProvider, $compileProvider) {
	$routeProvider
		.when('/pdfReport', {
			//controller: 'NewOrderCtrl',
			templateUrl: 'pdfReport.html'
		})
		.otherwise({
			redirectTo: '/'
		});
});