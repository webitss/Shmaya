"use strict";
appMessagePdf.factory("ConnectForPdf", ['$http', function ($http) {
    //var urlBase = 'http://qa.webit-track.com/ShmayaCRMWs/Service.svc/';
	var urlBase = "http://localhost:27786/Service.svc/";
    function dateConvectionLoop(data, isPost) {
        if (!angular.isObject(data)) {
            var prop = data;
            if (isPost == false && angular.isString(prop) && prop.indexOf("/Date(") > -1) {

                var date = prop.substring(prop.indexOf("(") + 1, (prop.indexOf("+") != -1 ? prop.indexOf("+") : prop.indexOf(")")));
                prop = new Date(parseInt(date));
            }
            else if (isPost && angular.isDate(prop)) {
                prop = '/Date(' + Date.UTC(prop.getFullYear(), prop.getMonth(), prop.getDate(), prop.getHours(), prop.getMinutes()) + ')/';
            }
            //if (prop == "PT0S")
            //    prop = null;
            return prop;
        }
        var isArr = angular.isArray(data);
        if (isArr)
            var nData = [];
        else
            var nData = {};
        angular.forEach(data, function (prop, key) {
            if (isPost == false && angular.isString(prop) && prop.indexOf("/Date(") > -1) {

                var date = prop.substring(prop.indexOf("(") + 1, (prop.indexOf("+") != -1 ? prop.indexOf("+") : prop.indexOf(")")));
                prop = new Date(parseInt(date));
            }
            else if (isPost && angular.isDate(prop)) {
                prop = '/Date(' + Date.UTC(prop.getFullYear(), prop.getMonth(), prop.getDate(), prop.getHours(), prop.getMinutes()) + ')/';
            }
            else if (angular.isObject(prop) || angular.isArray(prop))
                prop = dateConvectionLoop(prop, isPost);
            //if (prop == "PT0S")
            //    prop = null;
            if (isArr)
                nData.push(prop);
            else
                nData[key] = prop;
        });
        return nData;
    }

    return {

        post: function (actionName, data, SuccessFunc, ErrorFunc) {
            var data = dateConvectionLoop(data, true);
            $http.post(urlBase + actionName, data)
                        .success(function (result) {
                            SuccessFunc(result);
                        }).error(function (result) {
                            if (ErrorFunc)
                                ErrorFunc(result);
                        });
        },
        get: function (actionName, SuccessFunc, ErrorFunc) {
            $http.get(urlBase + actionName)
                .success(function (result) {
                    SuccessFunc(result);
                }).error(function (result) {
                    if (ErrorFunc)
                        ErrorFunc(result);
                });
        },
    };
}]);