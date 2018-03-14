"use strict"
var a;
var NOApp = angular.module('NOApp', ['ngRoute', 'ui.bootstrap', 'fundoo.services','signature']);

NOApp.config(function ($routeProvider, $compileProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'shmaya.html'
		})
        .otherwise({
            redirectTo: '/'
        });
});
