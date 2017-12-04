"use strict"
companionApp.controller('MessagesCtrl', ['$scope', '$rootScope', '$routeParams', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'alerts', 'codeTablesId', function ($scope, $rootScope, $routeParams, connect, $location, $filter, $timeout, codeTablesName, alerts, codeTablesId) {

    if ($scope.selected == undefined) {
        $scope.selected = $scope.searchMember;
    }

    $scope.iUser = $rootScope.user;
    $scope.titleList = ["מתנדבים", "מתלמדים", "רכזים", "הכל"];
    $scope.classes =
        [
            'circle-chose',
            'circle-not-chose',
            'circle-not-chose',
            'circle-not-chose'
        ];
    $scope.codeTablesId = codeTablesId;
    $scope.canSend = true;
    $scope.whom = $routeParams.whom ? $routeParams.whom : $scope.whom;
    $scope.whom = $scope.whom != undefined ? $scope.whom : $scope.searchMember.iPersonId;
    $scope.form = { massegeForm: null };
    $scope.all = false;
    $scope.toList = null;
    $scope.messageToSend =
        {
            nvSubject: null,
            nvMessage: null,
            nvFrom: $rootScope.user.nvDepartmentEmail ? $rootScope.user.nvDepartmentEmail : null,
            nvTo: null
        };
    $scope.user = {
        nvDepartmentEmail: $rootScope.user.nvDepartmentEmail,
        nvDepartmentMobileNumber: $rootScope.user.nvDepartmentMobileNumber
    };
    $scope.to =
        {
            mailingList: null,
            members: false,
            volunteers: false,
            students: false,
            coordinators: false
        };

    $scope.sms = false;
    $scope.mail = true;
    $scope.classSMS = 'circle-not-chose';
    $scope.classMail = 'circle-chose';

    $scope.initList = function (i) {
        connect.post(true, connect.functions.GetAll, { iUserId: $rootScope.user.iUserId }, function (result) {
            if (result) {
                $scope.allMembers = $scope.toList = result;
                $scope.chageClass(3);
                $scope.aMember =
                {
                    iPersonId: null,
                    nvName: null,
                    nvEmail: null,
                    nvMobileNumber: null,
                    bNotReceivingMessages: false,
                    iGenderType: null
                };
                if (i == 1)
                    $scope.nextOne();
                else if (i == 2 && $scope.sms == true)
                    $scope.all = true;
            }
        });
    }

    if (($routeParams.whom != '*' && $routeParams.whom != '#' && $routeParams.whom == undefined) && ($scope.whom != undefined && $scope.whom != '#'))
        $scope.initList(1);
    else {
        $scope.whom = $routeParams.whom ? $routeParams.whom : $scope.whom;
        if ($scope.whom == '*')
            $scope.initList(2);
        else if ($scope.whom == '#') {
            //  $scope.toList = $scope.list;
            $scope.toList = $scope.listToSend;
            $scope.title = 'נבחרים';
            $scope.all = true;
        }
    }
    $scope.nextOne = function () {
        $scope.aMember = $filter('filter')($scope.allMembers, { iPersonId: $scope.whom })[0];

        if ($scope.aMember.bNotReceivingMessages == true) {
            $scope.canSend = false;
            $scope.messageCantSend = $scope.aMember.nvName + ($scope.aMember.iGenderType == 5 ? " אינו מעוניין " : " אינה מעוניינת ") + "לקבל הודעות!";
        }
    }

    $scope.chageClass = function (int) {
        for (var i = 0; i < $scope.classes.length; i++) {
            if (i == int)
                $scope.classes[i] = 'circle-chose';
            else
                $scope.classes[i] = 'circle-not-chose';
        }
    };

    $scope.messageTo = function (int) {
        $scope.functionName = null;
        $scope.chageClass(int);
        if (int == 0) //volunteers
            $scope.functionName = connect.functions.GetAllVolunteers;
        else if (int == 1) //students
            $scope.functionName = connect.functions.GetAllStudents;
        else if (int == 2) //coordinators
            $scope.functionName = connect.functions.GetAllCoordinators;
        else if (int == 3) {//members
            $scope.initList(2);
            $scope.toList = $scope.allMembers;
            $scope.title = $scope.titleList[3];
        }
        if (int != 3)
            connect.post(true, $scope.functionName, { iUserId: $rootScope.user.iUserId }, function (result) {
                if (result) {
                    $scope.toList = result;
                    $scope.title = $scope.titleList[int];
                    $scope.all = true;
                }
            });
    }

    $scope.func = function (iPersonId) {
        angular.forEach($scope.allMembers, function (value, key) {
            if (value.iId == iPersonId) {
                $scope.aMember = value;
            }
        });
    }

    $scope.chageSendOption = function (type) {
        $scope.messageToSend =
       {
           nvSubject: null,
           nvMessage: null
       };
        if (type == 1) {
            $scope.messageToSend.nvFrom = $rootScope.user.nvDepartmentEmail;
            $scope.sms = true;
            $scope.mail = false;
            $scope.whom = $routeParams.whom;
            if ($scope.whom != '*')
                $scope.all = false;
            else
                $scope.initList(2);
            $scope.classSMS = 'circle-chose';
            $scope.classMail = 'circle-not-chose';
            $scope.toList = $scope.allMembers;
            //$scope.list = { mailingList: $scope.toList };
        }
        else if (type == 2) {
            $scope.messageToSend.nvFrom = $rootScope.user.nvDepartmentEmail;
            $scope.sms = false;
            $scope.mail = true;
            $scope.whom = $routeParams.whom;
            $scope.all = false;
            $scope.classSMS = 'circle-not-chose';
            $scope.classMail = 'circle-chose';
        }
    };

    $scope.checkValidation = function () {
        $scope.$broadcast('show-errors-check-validity');
        if (!$scope.form.massegeForm.$valid) {
            var savingStatus = "ישנם ערכים לא חוקיים";
            $rootScope.notification(savingStatus);
            return false;
        }
    }

    $scope.sendSMS = function () {
        $scope.messageToSend.nvFrom = $scope.user.nvDepartmentMobileNumber;
        if ($scope.whom == '*' || $scope.whom == '#') {
            $scope.listToSend = [];
            angular.forEach($scope.toList, function (value, key) {
                if (value.bNotReceivingMessages == false || value.bNotReceivingMessages == undefined) {
                    $scope.listToSend.push(value);
                }
            });
            if ($scope.listToSend.length == 1)
                connect.post(true, connect.functions.SendSMSToOne, { member: $scope.aMember, message: $scope.messageToSend, iUserId: $rootScope.user.iUserId }, function (result) {
                    if (result) {
                        alert("נשלח SMS ל" + $scope.aMember.nvName + " !");
                    }
                    else
                        alerts.alert('ארעה שגיאה בשליחת המייל', 'הערה');
                });
            else if ($scope.listToSend.length > 1)
                connect.post(true, connect.functions.SendSMSToGroup, { lMember: $scope.listToSend, message: $scope.messageToSend, iUserId: $rootScope.user.iUserId }, function (result) {
                    if (result) {
                        if ($scope.listToSend.length > 2)
                            alert("נשלח SMS ל" + $scope.title + " !");
                        else {
                            alert("נשלח SMS ל" + $scope.listToSend[0].nvName + " ול" + $scope.listToSend[1].nvName + " !");
                            alert($scope.listToSend);
                        }
                    }
                    else
                        alerts.alert('ארעה שגיאה בשליחת המייל', 'הערה');
                });
        }
        else {
            $scope.messageToSend.nvTo = $scope.aMember.nvMobileNumber;
            connect.post(true, connect.functions.SendSMSToOne, { member: $scope.aMember, message: $scope.messageToSend, iUserId: $rootScope.user.iUserId }, function (result) {
                if (result) {
                    alert("נשלח SMS ל" + $scope.aMember.nvName + " !");
                }
                else
                    alerts.alert('ארעה שגיאה בשליחת הSMS', 'הערה');
            });
        }

    };

    $scope.sendEmail = function () {
        $scope.messageToSend.nvFrom = $scope.user.nvDepartmentEmail;
        if ($scope.whom == '*' || $scope.whom == '#') {
            $scope.listToSend = [];
            angular.forEach($scope.toList, function (value, key) {
                if (value.bNotReceivingMessages == false || value.bNotReceivingMessages == undefined) {
                    if (value.nvEmail == null || value.nvEmail == undefined)
                        alerts.alert('ל'+value.nvName+' אין כתובת מייל!', 'שגיאה');

                    else
                        $scope.listToSend.push(value);
                }
            });

            if ($scope.listToSend.length == 1)
                if ($scope.listToSend[0].nvEmail == null || $scope.listToSend[0].nvEmail == undefined)
                    alerts.alert('לחבר זה אין כתובת מייל!', 'שגיאה');
                else
                    connect.post(true, connect.functions.SendEmailToOne, { member: $scope.listToSend[0], message: $scope.messageToSend, iUserId: $rootScope.user.iUserId }, function (result) {
                        if (result) 
                            alert("נשלח מייל ל" + $scope.listToSend[0].nvName + " !");
                        else
                            alerts.alert('ארעה שגיאה בשליחת המייל', 'הערה');
                    });
            else if ($scope.listToSend.length > 1)
                connect.post(true, connect.functions.SendEmailToGroup, { lMember: $scope.listToSend, message: $scope.messageToSend, iUserId: $rootScope.user.iUserId }, function (result) {
                    if (result) {
                        if ($scope.listToSend.length > 2) {
                            alert("נשלח מייל ל" + $scope.title + " !");
                        }
                        else 
                            alert("נשלח מייל ל" + $scope.listToSend[0].nvName + " ול" + $scope.listToSend[1].nvName + " !");
                    }
                    else
                        alerts.alert('ארעה שגיאה בשליחת המייל', 'הערה');
                });
        }
        else {
            if ($scope.aMember.nvEmail == null || $scope.aMember.nvEmail == undefined)
                alerts.alert('לחבר זה אין כתובת מייל!', 'שגיאה');
            else {
                $scope.messageToSend.nvTo = $scope.aMember.nvEmail;
                connect.post(true, connect.functions.SendEmailToOne, { member: $scope.aMember, message: $scope.messageToSend, iUserId: $rootScope.user.iUserId }, function (result) {
                    if (result) {
                        alert("נשלח מייל ל" + $scope.aMember.nvName + " !");
                    }
                    else
                        alerts.alert('ארעה שגיאה בשליחת המייל', 'הערה');
                });
            }
        }
    }

    $scope.sendMessage = function () {
        if ($scope.sms == true) {
            $scope.messageToSend.nvFrom = $rootScope.user.nvDepartmentMobileNumber;
            $scope.sendSMS();
        }
        else {
            $scope.messageToSend.nvFrom = $rootScope.user.nvDepartmentEmail;
            $scope.sendEmail();
        }

        if ($scope.newMessage) {
            $scope.newMessage.isOpen = false;
            angular.forEach($scope.volunteersAndStudents, function (item) {
                item.bChecked = false;
            });

            $rootScope.$broadcast('deleteList');
        }
    }
}]);
