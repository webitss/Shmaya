"use strict"
companionApp.controller('UserDetailesCtrl', ['$scope', '$rootScope', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'alerts', 'codeTablesId', function ($scope, $rootScope, connect, $location, $filter, $timeout, codeTablesName, alerts, codeTablesId) {
    $scope.wrongPasswords = false;
    $scope.newUser = $scope.selected.newUser;
    $scope.user = {
        iUserId: -1,
        iPersonId: -1,
        iCoordinatorId: -1,
        iDepartmentId: -1,
        nvAddress: null,
        nvAddressComment: null,
        iCityType: null,
        nvPhoneNumber: null,
        nvEmail: null,
        nvDepartmentName: null,
        nvDepartmentEmail: null,
        nvDepartmentMobileNumber: null
    }
    //!!
    $scope.existsDepartment = false;
    // $scope.editUser = false;

    $scope.department =
        {
            nvDepartmentName: null,
            nvDepartmentMobileNumber: null,
            nvDepartmentEmail: null,
            iPersonManagerId: null,
            details: null
        }

    $scope.var = [];
    $scope.form = { departmentDetails: {} }

    if ($scope.selected.newUser == true)
        $scope.changePassword = true;
    else
        $scope.changePassword = false;

    $scope.getCodeTables = function () {
        connect.post(true, connect.functions.GetMemberCodeTables, { iUserId: 1 }, function (result) {
            $scope.codeTables = result;
            $scope.maritalStatusList = $filter('filter')(result, { Key: codeTablesName.maritalStatus }, true)[0].Value;
            $scope.genderList = $filter('filter')(result, { Key: codeTablesName.gender }, true)[0].Value;
            $scope.cityList = $filter('filter')(result, { Key: codeTablesName.city }, true)[0].Value;
            $scope.departmentList = $filter('filter')(result, { Key: codeTablesName.department }, true)[0].Value;
            $scope.userTypeList = $filter('filter')(result, { Key: codeTablesName.UserType }, true)[0].Value;
            $scope.loadCodeTablesList = true;
            $scope.index = 0;
        });
    }

    $scope.getCodeTables();

    //!!
    $scope.checkUserNameExists = function (nvUserName) {
        connect.post(false, connect.functions.CheckUserNameExist, { nvUserName: nvUserName }, function (result) {
            $scope.memberExist = result;
            if ((result > 0 && $scope.selected.newUser == true) || (result > 1 && $scope.selected.newUser == false)) {
                alerts.alert('שם משתמש קיים במערכת, לא ניתן ליצור אותו שנית');
                $scope.isUserNameExist = true;
            }
            else
                $scope.isUserNameExist = false;
        }, function () {
            $scope.isUserNameExist = false;
        });
    }

    $scope.$watch('selected.idUser', function () {
        if ($scope.selected.idUser != null && $scope.selected.idUser > 0) {
            $scope.selected.newUser = false;
            //    ($scope.member.iVolunteerId != null && $scope.member.iVolunteerId > 0))) {
            connect.post(true, connect.functions.GetUser, { iUserId: $scope.selected.idUser }, function (result) {
                $scope.user = result;
                //$scope.department.nvDepartmentEmail = $scope.user.nvDepartmentEmail;
                //$scope.department.nvDepartmentMobileNumber = $scope.user.nvDepartmentMobileNumber;
                $scope.department.nvDepartmentName = $scope.user.nvDepartmentName;
            });
        }
    });

    //!!
    $scope.checkDepartmentExists = function (nvDepartmentName) {
        $scope.existsDepartment = false;
        if ($scope.user.iUserType == codeTablesId.permissionType.departmentManager) {
            if ($scope.selected.newUser == true || $scope.isDepartmentNameChanged()) {
                angular.forEach($scope.departmentList, function (value, index) {
                    if (value.nvName == $scope.user.nvDepartmentName) {
                        $scope.existsDepartment = true;
                        alerts.alert('שם מחלקה קיים במערכת, לא ניתן ליצור אותו שנית');
                        return;
                    }
                });
            }
        } return $scope.existsDepartment;
    }

    $scope.isDepartmentNameChanged = function () {
        if ($scope.selected.newUser == false && $scope.department.nvDepartmentName != $scope.user.nvDepartmentName)
            return true;
        return false;
    }

    $scope.checkPassword = function (password1, password2) {
        if (password1 != password2)
            alerts.alert('הסיסמאות אינן זהות!', 'שגיאה');
    }

    $scope.saveDetails = function () {
        if ($scope.user.nvPassword != $scope.var.nvPassword && $scope.changePassword == true) {
            var savingStatus = "!הסיסמאות אינן זהות";
            $rootScope.notification(savingStatus);
            alerts.alert('הסיסמאות אינן זהות!', 'שגיאה');
            return;
        }
        $scope.$broadcast('show-errors-check-validity');
        if (!$scope.form.personalDetails.$valid) {
            var savingStatus = "ישנם ערכים לא חוקיים";
            $rootScope.notification(savingStatus);
            return;
        }
        $scope.checkUserNameExists($scope.user.nvUserName);
        if ($scope.isUserNameExist == true) return;
        if ($scope.user.nvPassword != $scope.var.nvPassword && $scope.changePassword == true) {
            $scope.wrongPasswords = true;
            return;
        }
        //!!
        if ($scope.user.iUserType == codeTablesId.permissionType.departmentManager) {
            if ($scope.checkDepartmentExists($scope.user.nvDepartmentName))
                return;
        }
        $scope.continueSave();
    };

    $scope.continueSave = function () {
        $scope.department.nvDepartmentEmail = $scope.user.nvDepartmentEmail;
        $scope.department.nvDepartmentMobileNumber = $scope.user.nvDepartmentMobileNumber;
        connect.post(true, connect.functions.UserInsertUpdate, { newUser: $scope.user, iManageUserId: $rootScope.user.iUserId }, function (result) {
            if (result) {
                $scope.user.nvUserType = $filter('filter')($scope.userTypeList, { iId: $scope.user.iUserType }, true)[0].nvName;
                if ($scope.newUser == true) {
                    //  $scope.selected.newUser = false;
                    $rootScope.$broadcast('insertNewUser', {
                        newUser: $scope.user
                    });
                }
                else {
                    $rootScope.$broadcast('updateUserInGrid', {
                        user: $scope.user
                    });
                }
                console.log('result:' + result);
                var savingStatus = "השינויים נשמרו בהצלחה";
                $rootScope.notification(savingStatus);
            }
        });
    };
}]);
