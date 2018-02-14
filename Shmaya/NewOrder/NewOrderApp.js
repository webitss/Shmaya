"use strict"
var a;
var NOApp = angular.module('NOApp', ['ngRoute', 'ui.bootstrap', 'fundoo.services']);

NOApp.config(function ($routeProvider, $compileProvider) {
    $routeProvider
        .when('/', {
            //controller: 'NewOrderCtrl',
            templateUrl: 'shmaya.html'
        })
        .otherwise({
            redirectTo: '/'
        });
});

//NOApp.run(function ($rootScope, $location) {
//    $location.path('/')
//});