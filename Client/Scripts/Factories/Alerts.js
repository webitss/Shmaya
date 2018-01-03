"use strict"
companionApp.factory('alerts', ['$rootScope', '$uibModal', function ($rootScope, $uibModal) {
    var $ctrl = this;
    return {
        alert: function (message, title, OKcallback) {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: false,
                ariaLabelledBy: 'modal-title-top',
                ariaDescribedBy: 'modal-body-top',
                templateUrl: 'Partials/Templates/AlertTemplate.html' + $rootScope.appVersionParameter,
                //template: temp,
                controller: function ($scope) {
                    $scope.title = title;
                    $scope.message = message;
                    $scope.ok = function () {
                        if (OKcallback)
                            OKcallback();
                        modalInstance.close();
                        //$uibModalInstance.close($scope.selected.item);
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                //$scope.selected = selectedItem;
            }, function () {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        },


        confirm: function (message, title, OKcallback, cancelCallback, okText, cancelText) {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: false,
                templateUrl: 'Partials/Templates/ConfirmTemplate.html' + $rootScope.appVersionParameter,  
                //template: temp,
                controller: function ($scope) {
                    $scope.title = title;
                    $scope.message = message;
                    $scope.okText = okText;
                    $scope.cancelText = cancelText;
                    $scope.ok = function () {
                        //$rootScope.$modalClose();
                        if (OKcallback)
                            OKcallback();
                        modalInstance.close();
                    };
                    $scope.cancel = function () {
                        if (cancelCallback)
                            cancelCallback();
                        modalInstance.close();
                    };
                }
            });

            modalInstance.result.then(function (selectedItem) {
                //$scope.selected = selectedItem;
            }, function () {
                // $log.info('Modal dismissed at: ' + new Date());
            });
        },

        custom: function (includeTemplate, title, $ctrl, OKcallback, cancelCallback, okText, cancelText) {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                scope: $ctrl,
                //bindToController: true,
                controllerAs: '$ctrl',
                templateUrl: 'Partials/Templates/CustomTemplate.html' + $rootScope.appVersionParameter,
                //template: temp,
                controller: function ($scope) {
                    var $ctrl = this;
                    $scope.title = title;
                  //  $scope.message = message;
                    $scope.okText = okText;
                    $scope.cancelText = cancelText;
                    $scope.includeTemplate = includeTemplate;
                    $scope.ok = function () {
                        //$rootScope.$modalClose();
                        if (OKcallback)
                            OKcallback();
                        modalInstance.close();
                    };
                    $scope.cancel = function () {
                        if (cancelCallback)
                            cancelCallback();
                        modalInstance.close();
                    };
                }
            });
            
            modalInstance.result.then(function (selectedItem) {
                $ctrl.selected = selectedItem;
            }, function () {
                // $log.info('Modal dismissed at: ' + new Date());
            });
            
        },

        customWithTemplate: function (templateUrl, title, $ctrl, OKcallback, cancelCallback, okText, cancelText) {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                scope: $ctrl,
                //bindToController: true,
                controllerAs: '$ctrl',
                templateUrl: templateUrl + $rootScope.appVersionParameter,
                //template: temp,
                controller: function ($scope) {
                    var $ctrl = this;
                    $scope.title = title;
                    //  $scope.message = message;
                    $scope.okText = okText;
                    $scope.cancelText = cancelText;
                    //$scope.includeTemplate = includeTemplate;
                    $scope.ok = function () {
                        //$rootScope.$modalClose();
                        if (OKcallback)
                            OKcallback();
                        modalInstance.close();
                    };
                    $scope.cancel = function () {
                        if (cancelCallback)
                            cancelCallback();
                        modalInstance.close();
                    };
                }
            });
            
            modalInstance.result.then(function (selectedItem) {
                $ctrl.selected = selectedItem;
            }, function () {
                // $log.info('Modal dismissed at: ' + new Date());
            });
            
        },

        messages: {
            someError: 'אירעה שגיאה בלתי צפויה',
            loadDataError: 'אירעה שגיאה בטעינת הנתונים',
            sendDataError: 'אירעה שגיאה בשליחת הנתונים',
            insertDataError: 'אירעה שגיאה בהכנסת הנתונים'
        },

        titles: {
            message: 'הודעה',
            note: 'שים לב!',
            error: 'שגיאה',
            warning: 'אזהרה',
            empty: ''
        }
    };


}])
.directive('compileData', function ($compile) {
    return {
        scope: true,
        link: function (scope, element, attrs) {
            var elmnt;
            attrs.$observe('template', function (myTemplate) {
                if (angular.isDefined(myTemplate) && myTemplate != '') {
                    elmnt = $compile(myTemplate)(scope);
                    element.html(""); // dummy "clear"
                    element.append(elmnt);
                }
            });
        }
    };
});

