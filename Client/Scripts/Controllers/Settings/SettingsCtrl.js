"use strict"
companionApp.controller('SettingsCtrl', ['$scope', '$rootScope', '$compile', '$filter', '$timeout', '$location', 'createDialog', 'screenHeight', 'codeTablesId', 'connect', '$log', 'alerts', 'changesAlert',
    function ($scope, $rootScope, $compile, $filter, $timeout, $location, createDialog, screenHeight, codeTablesId, connect, $log, alerts, changesAlert) {
        $scope.setting = [];
        window.onresize = function () {
            $timeout(function () {
                screenHeight.getScreenHeight('.container', 140, function (result) {
                    $scope.screenHeight = result;
                });
            });
        };
        window.onresize();

        $scope.prepareData = function () {
            $scope.tablesCodeColumns = [
                {
                    fieldName: 'edit',
                    title: 'ערוך',
                    filter: false,
                    sort: false,
                    weight: 0.5,
                    template: '<span ng-click="col.editRow(item)" class="glyphicon glyphicon-edit"></span>',
                    editRow: function (item) {
                        $scope.iSysTableRowId = item.iSysTableRowId;
                        $scope.setting.nvEntry = $filter('filter')($scope.tablesCodeData, { iSysTableRowId: item.iSysTableRowId }, true)[0].nvValue;
                        $scope.pop = "<input type='text' class='form-control' required ng-model='setting.nvEntry' required/>";
                        alerts.custom($scope.pop, 'הוספת מוצר',$scope,
                            function () {
                                $scope.changeEntry($scope, $scope.setting.nvEntry, false);
                            }, function () { }
                            
                            );
                    }
                },
                 {
                     title: 'מחק',
                     fieldName: 'delete',
                     filter: false,
                     sort: false,
                     weight: 0.5,
                     template: '<div class="glyphicon glyphicon-remove" ng-click="col.delete(item)"></div>',
                     delete: function (item) {
                         alerts.confirm('האם למחוק ערך זה: ' + item.nvValue+' ?', alerts.titles.message, function () {
                             connect.post(true, connect.functions.DeleteSysTableRow, { sysTableContent: item, iUserId: $rootScope.user.iUserId }, function (result) {
                                 $scope.getTableCode(item.iSysTableId);
                             });
                         },function () { });
                     }
                 },
                { fieldName: 'nvValue', title: "ערך", filter: true }
                //,{ fieldName: 'iSysTableRowId', title: "קוד", filter: true }
            ];

            $scope.isTablesCodeDataLoaded = 0;
            $scope.tablesCodeData = [];
            $scope.nvTableName = '';
            $scope.iTableId = 0;
            $scope.setting.nvEntry = '';
            $scope.iSysTableRowId = 0;

            $scope.getTables();
        };

        $scope.getTables = function () {
            $scope.tables = [];
            connect.post(true, connect.functions.GetSysTables, {}, function (result) {
                $scope.tables = result;
                $scope.iTableId = $scope.tables[16] ? $scope.tables[16].iSysTableRowId :undefined; 
                $scope.getTableCode($scope.iTableId);
            });
        };

        $scope.prepareData();

        $scope.getTableCode = function (iTableId) {
            if (iTableId != undefined) {
                for (var i = 0; i < $scope.tables.length; i++) {
                    if ($scope.tables[i].iSysTableRowId == iTableId) {
                        $scope.nvTableName = $scope.tables[i].nvSysTableNameEng;
                        break;
                    }
                }
            }
            $scope.tablesCodeData = [];

            connect.post(true, connect.functions.GetSysTableRow, { nvSysTableNameEng: $scope.nvTableName }, function (result) {
                $scope.tablesCodeData = result;
                $scope.isTablesCodeDataLoaded++;
            });
        };

        $scope.changeEntry = function (scope, nvEntry, isDelete) {
            if (nvEntry == null || nvEntry == "" | nvEntry == undefined) return;
            var data = {
                sysTableContent: {
                    iSysTableRowId: $scope.iSysTableRowId,
                    nvSysTableNameEng: $scope.iTableId,
                    nvValue: nvEntry,
                    iUserId: $rootScope.user.iUserId
                }
            };
            var funcName;
            if (isDelete)
                funcName = connect.functions.DeleteSysTableRow;
            else if ($scope.iSysTableRowId == 0)
                funcName = connect.functions.InsertSysTableRow;
            else
                funcName = connect.functions.UpdateSysTableRow;
            connect.post(true, funcName, data, function (result) {
                $scope.getTableCode(scope.iTableId);
                //$scope.$modalClose();

            });
        };

        $scope.addEntry = function () {
            $scope.iSysTableRowId = 0;
            $scope.setting.nvEntry = '';
            $scope.pop = "<input type='text' required class='form-control' ng-model='setting.nvEntry' required/>";
            alerts.custom($scope.pop, 'הוספת ערך',$scope,
                function () {
                    $scope.changeEntry($scope, $scope.setting.nvEntry, false);
                }, function () { }
                );
        }
    }
]);
