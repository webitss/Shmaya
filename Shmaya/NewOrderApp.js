"use strict"
var NOApp = angular.module('NOApp', ['ngRoute', 'ui.bootstrap']);

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