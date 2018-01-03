"use strict"
companionApp.factory("connect", ['$http', '$rootScope', '$location', 'alerts', '$timeout', '$log', 'forceLogOut', function ($http, $rootScope, alerts, $location, $timeout, $log, forceLogOut) {

    var callQueue = [];

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

    function popQueue(actionName) {
        callQueue.pop(actionName);
        if (callQueue.length == 0)
            $rootScope.isWait = false;
    }

    function logout(result, error) {
        if (error == 400 && result.Reason == "GuideExpired") {
            forceLogOut.doLogOut();
        }
    }

    var connectObj = {
        post: function (isWait, actionName, data, SuccessFunc, ErrorFunc) {
            if ($rootScope.user)
                data.nvGuide = $rootScope.user.nvGuide;
            var data = dateConvectionLoop(data, true);
            if (document.location.hostname != 'www.LoveAddress.co.il') {
                console.log(actionName);
                console.log(angular.toJson(data))
            }
            if (isWait)
                callQueue.push(actionName);
            $rootScope.isWait = isWait;
            //url +
            $http.post(url + actionName, data)
                .then
                (function (result, info) {
                    if ((result.data == null || result.data == undefined || result.data == -1 || result.data == false))
                        if (!ErrorFunc)
                            alerts.alert(alerts.messages.someError, alerts.titles.error);
                        else ErrorFunc();
                    else
                        SuccessFunc(dateConvectionLoop(result.data, false));
                },
                function (result, err) {
                    $log.error(result + " Failure");
                    //if (err == 998)
                    if (result.status == 998)
                        forceLogOut.doLogOut();
                    else {
                        if (ErrorFunc)
                            ErrorFunc(result);
                        else
                            alerts.alert(alerts.messages.someError, alerts.titles.error);
                    }
                })
                .finally(function () {
                    popQueue(actionName);
                    console.error;
                });
        },


        login: function (data, SuccessFunc) {
            $http.post(url + connectObj.functions.Login, data)
                .then(function (result, info) {
                    if ((result.data == null || result.data == undefined))
                        alerts.alert(alerts.messages.someError, alerts.titles.error);
                    else
                        SuccessFunc(result.data);
                }, function (result, err) {
                });
        },

        getServiceUrl: function () {
            var url = '';
            switch (document.location.hostname) {
                case 'localhost':
                    //D:\Dev\AyeletHashachar\AyeletHashacharCompanionship\AyeletHashacharService
                    //url = 'http://localhost:57982/AyeletHashachar/AyeletHashacharCompanionship/Service/';
					url = "http://localhost:47963/";

                    //url = "http://localhost/AyeletService/"
                    break;
                case '10.0.0.109':
                    url = 'http://10.0.0.109/AyeletService/';
                    break;
                case 'ws.webit-track.com':
                    url = "http://ws.webit-track.com/AyeletHashacharService/";
                    break;
                case 'qa.webit-track.com':
					url = "http://qa.webit-track.com/ShmayaCRMWs/";
                    break;
            }
            return url;
        },

        getFilesUrl: function () {
            return connectObj.getServiceUrl() + 'Files/';
        },

        functions: {
            GetMember:'GetAMember',
            GetABCBook: 'GetABCBook',
            DeleteMember: 'DeleteMember',
            GetMatchingCompanionships: 'GetMatchingCompanionships',
            GetAllConversations: 'GetAllConversations',
            GetConversation: 'GetConversation',
            CreateNewConversation: 'CreateNewConversation',
            CreateNewCompanionship: 'CreateNewCompanionship',
            getCompanionshipsHistory: 'getCompanionshipsHistory',
            GetExistingCompanionship: 'GetExistingCompanionship',
            GetCompanionshipConversations: 'GetCompanionshipConversations',
            UpdateCompanionshipStatus: 'UpdateCompanionshipStatus',
            //GetMember: 'GetMember',
            GetCities: 'GetCities',
            getSettings: 'getSettings',    
            GetMemberDetails: 'GetMemberDetails',
            GetCoordinators: 'GetCoordinators',
            GetCoordinatorsCodeTable: 'GetCoordinatorsCodeTable',
            MemberInsertUpdate: 'MemberInsertUpdate',
            GetMemberCodeTables: 'GetMemberCodeTables',
            Login: 'Login',
            getUsers: 'getUsers',
            GetUser: 'GetUser',
            DeleteUser: 'DeleteUser',
            UserInsertUpdate:'UserInsertUpdate',
            ExportToExcel: 'ExportToExcel',
            GeneratePdf: 'GeneratePdf',
            GetCoordinator: 'GetCoordinator',
            GetSysTables: 'GetSysTables',
            GetSysTableRow: 'GetSysTableRow',
            DeleteSysTableRow: 'DeleteSysTableRow',
            InsertSysTableRow: 'InsertSysTableRow',
            UpdateSysTableRow: 'UpdateSysTableRow',
            companionshipChekExists: 'companionshipChekExists',
            SendEmailToOne: 'SendEmailToOne',
            SendEmailToGroup: 'SendEmailToGroup',
            SendSMSToOne: 'SendSMSToOne',
            SendSMSToGroup:'SendSMSToGroup',
            GetAll: 'GetAll',
            GetAllVolunteers:'GetAllVolunteers',
            GetAllStudents :'GetAllStudents',
            GetAllCoordinators: 'GetAllCoordinators',
            CheckMemberExist: 'CheckMemberExist',
            CheckUserNameExist:'CheckUserNameExist',
            checkDepartmentExists:'checkDepartmentExists',
            //DepartmentInsert: 'DepartmentInsert',
            getNextConversation: 'getNextConversation',
            GetNumDays: 'GetNumDays',
            SetNumDays: 'SetNumDays',
            GetMemberBySearchText: 'GetMemberBySearchText'
        },

        dateConversationLoop: dateConvectionLoop
    };

    var url = connectObj.getServiceUrl() + 'Service.svc/';

    return connectObj;
}]);
