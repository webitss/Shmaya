'use strict'
companionApp.controller('ABCBookDetailesCtrl', ['$scope', '$rootScope', '$timeout', 'connect', '$filter', '$location', 'codeTablesName', 'tablesId', 'alerts', 'codeTablesId',
    function ($scope, $rootScope, $timeout, connect, $filter, $location, codeTablesName, tablesId, alerts, codeTablesId) {
        $scope.form = {};

        $scope.codeTablesId = codeTablesId;

        //avigail
        //$scope.temporaryVariables = {
        //    dtDateBirth: null
        //};

        $scope.mail = { noMail: null };

        $scope.isMemberExist = false;
        $scope.checkMemberExist = function (nvMobileNumber) {
            connect.post(false, connect.functions.CheckMemberExist, { nvMobileNumber: nvMobileNumber }, function (result) {
                $scope.memberExist = result;
                if ((result > 0 && $scope.selected.newMember == true) || (result > 1 && $scope.selected.newMember == false)) {
                    alerts.alert('מספר פלאפון זה קיים במערכת, לא ניתן ליצור חבר נוסף עם אותו מספר');
                    $scope.isMemberExist = true;
                }
                else
                    $scope.isMemberExist = false;
            }, function () {
                $scope.isMemberExist = false;
            });
        };



        $scope.initCoordinatorList = function (iDepartmentId) {
            connect.post(true, connect.functions.GetCoordinatorsCodeTable, { iDepartmentId: iDepartmentId }, function (result) {
                $scope.coordinatorList = $filter('filter')(result, { Key: codeTablesName.coordinators }, true)[0].Value;
            });
        }

        $scope.checkList = function () {
            if ($scope.coordinatorList == null | $scope.coordinatorList == undefined)
                alerts.alert('יש לבחור מחלקה לפני בחירת רכז מטפל', 'שגיאה!');
        }

        $scope.notReceivingMessages = function () {
            $scope.classGetMail = ($scope.classGetMail == 'circle-chose' ? 'circle-not-chose' : 'circle-chose');
            $scope.member.bNotReceivingMessages = !$scope.member.bNotReceivingMessages;
        }

        $scope.sampleCompanionship = function () {
            $scope.classSampleCompanionship = ($scope.classSampleCompanionship == 'circle-chose' ? 'circle-not-chose' : 'circle-chose');
            $scope.member.bSampleCompanionship = !$scope.member.bSampleCompanionship;
        }

        $scope.prepareData = function () {

            $scope.member = {
                iPersonId: -1,
                iStudentId: $scope.selected.idStudent ? $scope.selected.idStudent : null,
                iVolunteerId: $scope.selected.idVolunteer ? $scope.selected.idVolunteer : null,
                iStatusType: codeTablesId.statusType.newMember,
                iLanguageType: codeTablesId.languageType.hebraw,
                lLanguageId: [],
                lStyleId: [],
                lFieldInterstId: [],
                tAvailableConversationFrom: null,
                tAvailableConversationTo: null,
                nvDepartmentName: $rootScope.user.nvDepartmentName
            };

            $scope.user = $rootScope.user;

            if ($scope.user.iUserType == codeTablesId.permissionType.coordinator || $scope.user.iUserType == codeTablesId.permissionType.schedulingCoordinator) {
                $scope.initCoordinatorList($scope.user.iDepartmentId);

            }

            $scope.citiesOptions = {
                country: 'il',
                types: '(cities)'
            };
            $scope.addressOptions = {
                country: 'il'
            };

            $scope.title = ($scope.member.iStudentId ? 'מתלמד' : 'מתנדב')
            $scope.cardTitle = null;
            $scope.cardTitle = $scope.member.iStudentId == -1 || $scope.member.iVolunteerId == -1 ? 'הוספת ' + $scope.title + ' חדש' : 'עריכת ' + $scope.title;
            $scope.existingMember = false;
            $scope.classGetMail = $scope.member.bNotReceivingMessages == true ? 'circle-chose' : 'circle-not-chose';
            $scope.classSampleCompanionship = $scope.member.bSampleCompanionship == true ? 'circle-chose' : 'circle-not-chose';


        };

        $scope.prepareData();

        $scope.$watch(['member.iStudentId', 'member.iVolunteerId'], function () {
            if ($scope.member != undefined && (($scope.member.iStudentId != null && $scope.member.iStudentId > 0) ||
                ($scope.member.iVolunteerId != null && $scope.member.iVolunteerId > 0))) {
                connect.post(true, connect.functions.GetMember, { iStudentId: $scope.member.iStudentId, iVolunteerId: $scope.member.iVolunteerId, iUserType: $rootScope.user.iUserId }, function (result) {
                    $scope.member = result;
                    $scope.updateAvailabilityList();
                    $scope.member.lStyleId = [];
                    angular.forEach($scope.member.lStyle, function (value, index) {
                        $scope.member.lStyleId.push(value.iValue);
                    });

                    $scope.member.lFieldInterstId = [];
                    //  $scope.interestedList = [];
                    angular.forEach($scope.member.lFieldInterst, function (value, index) {
                        $scope.member.lFieldInterstId.push(value.iValueType);
                    });

                    $scope.member.lLanguageId = [];
                    angular.forEach($scope.member.lLanguage, function (value, index) {
                        $scope.member.lLanguageId.push(value.iValueType);
                    });
                    $scope.classGetMail = $scope.member.bNotReceivingMessages == true ? 'circle-chose' : 'circle-not-chose';
                    $scope.classSampleCompanionship = $scope.member.bSampleCompanionship == true ? 'circle-chose' : 'circle-not-chose';
                    //avigail
                    //$scope.temporaryVariables = {
                    //    dtDateBirth: $scope.member.dtDateBirth ? $scope.member.dtDateBirth : null,
                    //};

                });
            }
        });

        //$scope.saveDetails = function () {
        //    $scope.$broadcast('show-errors-check-validity');
        //    if (!$scope.form.personalDetails.$valid) {
        //        var savingStatus = "ישנם למלא ערכים תקינים בכל השדות";
        //        $rootScope.notification(savingStatus);
        //        return;
        //    }

            $scope.checkMemberExist($scope.member.nvMobileNumber);
            if ($scope.isMemberExist == false) {
                $scope.saveAvailabilityList();

                $scope.member.lLanguage = [];
                angular.forEach($scope.member.lLanguageId, function (value, key) {
                    $scope.member.lLanguage.push({ iSettingType: tablesId.Language, iValueType: value });
                });

                $scope.member.lStyle = [];
                angular.forEach($scope.member.lStyleId, function (value, index) {
                    $scope.member.lStyle.push({ iSettingType: tablesId.style, iValueType: value });
                });

                $scope.member.lFieldInterst = [];
                angular.forEach($scope.member.lFieldInterstId, function (value, key) {
                    $scope.member.lFieldInterst.push({ iSettingType: tablesId.memberFieldInterst, iValueType: value });
                });

                //$scope.member.dtDateBirth = $scope.temporaryVariables.dtDateBirth;

                connect.post(true, connect.functions.MemberInsertUpdate, { member: $scope.member, iUserId: 1 }, function (result) {
                    if (result && result > 0) {
                        if ($scope.selected.newMember == true) {
                            $scope.selected.newMember = false;
                            $rootScope.$broadcast('insertNewMember', { newMember: $scope.member });
                        }
                        else {
                            $rootScope.$broadcast('updateMemberInGrid', { member: $scope.member });
                        }
                        console.log('MemberInsertUpdate:' + result);
                        var savingStatus = "השינויים נשמרו בהצלחה";
                        $rootScope.notification(savingStatus);
                    }
                    else {
                        alert('ארעה שגיאה בלתי צפויה');
                    }
                });
            }
        };

        //==================

        $scope.changeAvailability = function (dayIndex, dayPartIndex) {
            $scope.availabilityList[dayIndex].dayPartList[dayPartIndex].isAvailable =
                !$scope.availabilityList[dayIndex].dayPartList[dayPartIndex].isAvailable;
        }

        $scope.changeAvailabilityTime = function (dayPartIndex) {
            for (var i = 0; i < 6; i++) {
                $scope.availabilityList[i].dayPartList[dayPartIndex].isAvailable =
                        !$scope.availabilityList[i].dayPartList[dayPartIndex].isAvailable;
            }
        }

        $scope.initAvailabilityList = function () {
            $scope.availabilityList = angular.copy($scope.dayList);
            angular.forEach($scope.availabilityList, function (item, index) {
                item.dayPartList = angular.copy($scope.dayPartList);
            });
        }

        $scope.updateAvailabilityList = function () {
            $scope.x = 0;
            $scope.y = [];
            angular.forEach($scope.availabilityList, function (day) {
                angular.forEach(day.dayPartList, function (dayPart) {
                    if ($filter('filter')($scope.member.lAvailability, { iDayType: day.iId, iDayPartType: dayPart.iId }, true).length > 0) {
                        dayPart.isAvailable = true;
                    }
                });
            });
        }

        $scope.saveAvailabilityList = function () {
            $scope.member.lAvailability = [];
            angular.forEach($scope.availabilityList, function (day) {
                angular.forEach(day.dayPartList, function (dayPart) {
                    if (dayPart.isAvailable) {
                        $scope.member.lAvailability.push({ iDayType: day.iId, iDayPartType: dayPart.iId });
                    }
                });
            });
        }

        $scope.initAvailabilityList();

        //avigail
        //חישוב גיל בהתאם לתאריך לידה
        //$scope.calculateAge = function () {
        //    if (!$scope.member) return;
        //    if ($scope.temporaryVariables.dtDateBirth == null) return;
        //    var ageDifMs = Date.now() - $scope.temporaryVariables.dtDateBirth.getTime();
        //    var ageDate = new Date(ageDifMs);
        //    $scope.member.iAge = Math.abs(ageDate.getUTCFullYear() - 1970);
        //};

        //חישוב תאריך לידה בהתאם לגיל
        //$scope.calculateDateBirth = function () {
        //    if (angular.isString($scope.member.iAge))
        //        $scope.member.iAge = Math.round($scope.member.iAge);
        //    if ($scope.member.iAge == undefined) return;
        //    var today = new Date();
        //    today.setFullYear(today.getFullYear() - Math.round($scope.member.iAge));
        //    $scope.temporaryVariables.dtDateBirth = today;
        //};
    }]);
