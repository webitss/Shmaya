"use strict"
companionApp.controller('PermissionsCtrl', ['$scope', '$rootScope', 'connect', '$timeout', '$filter', 'alerts', 'createDialog', '$uibModal', 'codeTablesId',
    function ($scope, $rootScope, connect, $timeout, $filter, alerts, createDialog, $uibModal, codeTablesId) {

        $scope.prepareData = function () {

            $scope.selected = { idUser: undefined, newUser: false };
            $rootScope.delete = undefined;
            $scope.isDataLoaded = 0;


            $scope.getUsers($rootScope.user.iUserType);
            $scope.gridIdentity = "UsersData";
            $scope.usersColumns = [
                {
                    title: 'ערוך',
                    fieldName: 'iUserId',
                    weight: 0.5,
                    sort: false,
                    filter: false,
                    template: '<span ng-click=\'col.clickEvent(item)\' class="glyphicon glyphicon-edit user-class-user user-class"></span>',
                    clickEvent: function (item) {

                        $scope.selected.idUser = $scope.selected.idUser == undefined || ($scope.selected.idUser != item.iUserId && item.iUserId) ? item.iUserId : $scope.selected.idUser;
                        item.dialogIsOpen = true;
                        $scope.currentDialog = item;
                        $rootScope.$broadcast('displayDialog', { id: item.iPersonId });
                        $rootScope.$broadcast('showComment', { id: item.iPersonId });
                    },
                },
                { fieldName: 'nvIdentityNumber', title: "מספר זהות" },
                { fieldName: 'nvFirstName', title: "שם פרטי" },
                { fieldName: 'nvLastName', title: "שם משפחה" },
                { fieldName: 'nvUserName', title: "שם משתמש" },
                //{ fieldName: 'nvPassword', title: "ססמה" },
                { fieldName: 'nvUserType', title: "סוג משתמש" },
                { fieldName: 'nvDepartmentName', title: "מחלקה" }
            ];

            $scope.isTablesCodeDataLoaded = 0;
            $scope.tablesCodeData = [];
            $scope.nvTableName = '';
            $scope.iTableId = 0;
            $scope.nvEntry = '';
            $scope.iSysTableRowId = 0;

        };

        $scope.getUsers = function () {
            $scope.UsersData = [];
            connect.post(true, connect.functions.getUsers, { iUserType: $rootScope.user.iUserType }, function (result) {
                $scope.UsersData = result;
                $scope.isDataLoaded++;
            });
        };

        $scope.addUser = function () {
            $scope.name = "משתמשים";
            $scope.selected.idUser = -1;
            $scope.selected.newUser = true;
            $scope.changePassword = true;
            $scope.settingUser = [];
            $rootScope.$broadcast('displayDialog', { id: 'neUswer' });
        }

        $scope.exportToExcel = function () {
            $scope.$broadcast('exportToExcel', {
                id: $scope.gridIdentity,
                fileName: 'משתמשים'
            });
        };

        $scope.$on('insertNewUser', function (scopeDetails, data) {

            //   $scope.UsersData.push(data.newUser);
            //  $scope.isDataLoaded++;
            $scope.selected.newUser = false;
            $scope.getUsers();

        });

        $scope.$on('updateUserInGrid', function (scopeDetails, data) {
            $scope.currentDialog.dialogIsOpen = false;
            $scope.getUsers();
            
            //var item = $filter('filter')($scope.UsersData, { iPersonId: data.user.iPersonId }, true)[0];
            //var index = $scope.UsersData.indexOf(item);
            //angular.extend(item, data.user);
            //  $scope.isDataLoaded++;
            //  if (scope.id == data.id) {}
        });
        $scope.prepareData();
    }]);
