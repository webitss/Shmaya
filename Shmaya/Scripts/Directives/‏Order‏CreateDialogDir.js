
var dirCounter = 0;
var a;
NOApp.directive('orderCreateDialog', ['$document', '$compile', "$rootScope", "$controller", "$timeout", '$filter', function ($document, $compile, $rootScope, $controller, $timeout, $filter) {
    return {
        transclude: true,
        templateUrl: 'CreateDialogTemplate.html',
        scope: {
            id: '@?',
            template: '@?',
            templateUrl: '@?',
            title: '@?',
            comment: '@?',
            image: '@?',
            backdrop: '=?',
            success: '=?',
            cancel: '=?',
            backdropClass: "@?",
            backdropCancel: '=?',
            footerTemplate: '=?',
            modalClass: '=?',
            closeFunc: '&?',
            css: '=?',
            draggable: '=?',
            width: '@?',
            ngIf: '=?',
            page: '@',
            design: '@',
            item: '='
            //!!
            //max: '=?'
        },

        link: function (scope, element) {
            dirCounter++;
            scope.id = "dialog" + dirCounter
            //scope.$watch('$parent.$parent', function () {
            //    angular.forEach(scope.$parent.$parent, function (item, key) {
            //        if (key.indexOf('$') == -1)
            //            scope[key] = item;
            //    });
            //});
            var body = $document.find('body');
            scope.ifelem = angular.isDefined(scope.ifelem) ? scope.ifelem : null;
            scope.id = angular.isDefined(scope.id) ? scope.id : null;
            scope.title = angular.isDefined(scope.title) ? scope.title : '';
            scope.design = angular.isDefined(scope.design) ? scope.design : '';
            scope.comment = angular.isDefined(scope.comment) ? scope.comment : '';
            scope.image = angular.isDefined(scope.image) ? scope.image : '';
            scope.backdrop = angular.isDefined(scope.backdrop) ? scope.backdrop : true;
            scope.closeFunc = angular.isDefined(scope.closeFunc) ? scope.closeFunc : null;
            scope.success = angular.isDefined(scope.success) ? scope.success : { label: 'OK', fn: null };
            scope.cancel = angular.isDefined(scope.cancel) ? scope.cancel : { label: 'Close', fn: null };
            scope.backdropClass = angular.isDefined(scope.backdropClass) ? scope.backdropClass : "modal-backdrop";
            scope.backdropCancel = angular.isDefined(scope.backdropCancel) ? scope.backdropCancel : null;
            scope.footerTemplate = angular.isDefined(scope.footerTemplate) ? scope.footerTemplate : null;
            scope.modalClass = angular.isDefined(scope.modalClass) ? scope.modalClass : "modal";
            scope.max = angular.isDefined(scope.max) ? scope.max : true;

            scope.css = angular.isDefined(scope.css) ? scope.css : {
                top: '100px',
                left: '0%',
                margin: '0 auto'
            };
            scope.draggable = angular.isDefined(scope.draggable) ? scope.draggable : false;
            scope.width = angular.isDefined(scope.width) ? scope.width : '600px';
            var key;
            var idAttr = scope.id ? ' id="' + scope.id + '" ' : '';
            var defaultFooter = '';
            var footerTemplate = '<div class="modal-footer">' +
                (scope.footerTemplate || defaultFooter) +
                '</div>';

            var handleEscPressed = function (event) {
                if (event.keyCode == 27) {
                    scope.$modalCancel();
                }
            };

            var closeFn = function () {
                scope.ngIf = false;
                //if (scope.ngIf.indexOf('Confirm.bConfirm') != -1)
                //    $rootScope.Confirm.bConfirm = false;
                //else
                //    angular.element($('#' + scope.page)).scope()[scope.ngIf] = false;

                body.unbind('keydown', handleEscPressed);
                //   modalEl.remove();
                //if (scope.backdrop) {
                //    backdropEl.remove();
                //}
            };


            body.bind('keydown', handleEscPressed);

            var ctrl, locals;

            scope.$minModal = function () {
                scope.max = false;

            };
            scope.$maxModal = function () {
                scope.max = true;
            };

            //scope.$title = scope.title;
            scope.$modalClose = closeFn;

            //x button
            scope.$modalCancel = function () {
                var callFn = scope.cancel.fn || closeFn;
                if (scope.closeFunc)
                    scope.closeFunc();
                callFn.call(this);
                scope.$modalClose();
                scope.listToSend = [];
            };

            scope.$modalSuccess = function () {
                var callFn = scope.success.fn || closeFn;
                callFn.call(this);
                scope.$modalClose();
            };

            scope.$modalSuccessLabel = scope.success.label;
            scope.$modalCancelLabel = scope.cancel.label;

            scope.$watch('ngIf', function () {
                if (scope.ngIf) {
                    scope.max = true;
                    //  alert('x');
                }
            });

            scope.$on('displayDialog', function (scopeDetails, data) {
                if (scope.id == data.id) {
                    scope.ngIf = true;
                    scope.max = true;
                }
            });

            scope.seeComment = false;
            scope.$on('showComment', function (scopeDetails, data) {
                if (scope.id == data.id) {
                    scope.seeComment = true;
                }
            });


            $timeout(function () {
                //modalEl.addClass('in');
                //if (scope.draggable) {
                //    $("#" + scope.id).draggable({});
                //    modalEl.addClass('draggable');
                //}
            }, 200);
        }
    }
}]);

