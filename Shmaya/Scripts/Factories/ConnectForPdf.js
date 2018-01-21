"use strict";
appFWPdf.factory("ConnectForPdf", ['$http', function ($http) {
    var urlBase = 'http://localhost:14733/Service1.svc/';
    //qa
  //  var urlBase = 'http://qa.webit-track.com/FWSalryWS/Service1.svc/';
    return {
        post: function (actionName, data, SuccessFunc, ErrorFunc) {
            $http.post(urlBase + actionName, data)
                        .success(function (result) {
                            SuccessFunc(result);
                        }).error(function (result) {
                            ErrorFunc(result);
                        });
        },
        get: function (actionName, SuccessFunc, ErrorFunc) {
            $http.get(urlBase + actionName)
                .success(function (result) {
                    SuccessFunc(result);
                }).error(function (result) {
                    ErrorFunc(result);
                });
        },
    };
}]);