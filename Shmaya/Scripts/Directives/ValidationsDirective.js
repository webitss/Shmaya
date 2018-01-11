companionApp.directive('integer', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            var INTEGER_REGEXP = /^\-?\d+$/;
            ctrl.$parsers.unshift(function (viewValue) {
                if (viewValue == '' || INTEGER_REGEXP.test(viewValue)) {
                    // it is valid
                    ctrl.$setValidity('integer', true);
                    return viewValue;
                } else {
                    // it is invalid, return undefined (no model update)
                    ctrl.$setValidity('integer', false);
                    return viewValue;
                }
            });
        }
    };
}).directive('english', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            var string_REGEXP = /[A-Za-z0-9 ]/g;
            ctrl.$parsers.unshift(function (viewValue) {
                if (viewValue == '' || string_REGEXP.test(viewValue)) {
                    // it is valid
                    ctrl.$setValidity('english', true);
                    return viewValue;
                } else {
                    // it is invalid, return undefined (no model update)
                    ctrl.$setValidity('english', false);
                    return viewValue;
                }
            });
        }
    };
}).directive('hebrew', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            var string_REGEXP = /[^a-zA-Z0-9]/;
            ctrl.$parsers.unshift(function (viewValue) {
                if (viewValue == '' || string_REGEXP.test(viewValue)) {
                    // it is valid
                    ctrl.$setValidity('hebrew', true);
                    return viewValue;
                } else {
                    // it is invalid, return undefined (no model update)
                    ctrl.$setValidity('hebrew', false);
                    return viewValue;
                }
            });
        }
    };
}).directive('phone', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            var INTEGER_REGEXP = /^((\+)?[1-9]{1,2})?([-\s\.])?((\(\d{1,4}\))|\d{1,4})(([-\s\.])?[0-9]{1,12}){1,2}$/;
            ctrl.$parsers.unshift(function (viewValue) {
                var numbers = viewValue.split("").length;
                if (viewValue == '' || (9 <= numbers && numbers <= 20 && INTEGER_REGEXP.test(viewValue)))
                    ctrl.$setValidity('phone', true);
                else
                    ctrl.$setValidity('phone', false);
                return viewValue;
            });
        }
    };
}).directive('equals', function () {
    return {
        restrict: 'A', // only activate on element attribute
        require: '?ngModel', // get a hold of NgModelController
        link: function (scope, elem, attrs, ngModel) {
            if (!ngModel) return; // do nothing if no ng-model

            // watch own value and re-validate on change
            scope.$watch(attrs.ngModel, function () {
                validate();
            });

            // observe the other value and re-validate on change
            attrs.$observe('equals', function (val) {
                validate();
            });

            var validate = function () {
                // values
                var val1 = ngModel.$viewValue;
                var val2 = attrs.equals;

                // set validity
                ngModel.$setValidity('equals', val1 === val2);
            };
        }
    }
}).directive('identitynum', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            var INTEGER_REGEXP = /^\-?\d+$/;
            ctrl.$parsers.unshift(function (viewValue) {
                if (viewValue == '' || INTEGER_REGEXP.test(viewValue)) {
                    ctrl.$setValidity('identitynum', true);
                    var sum = 0;
                    var intID = parseInt(viewValue);
                    for (var i = 0; intID > 0; i++) {
                        var value = (intID % 10) * (i % 2 + 1); // ספרה נוכחית מוכפלת ב 1 או ב 2 לסירוגין
                        sum += (value % 10) + Math.floor(value / 10);     // אם מתקבל ערך גדול מ 10, מחסרים ממנו 9
                        intID = Math.floor(intID / 10);                            // מחלקים ב 10 כדי להגיע לספרה הבאה
                    }
                    if (sum % 10 != 0)
                        ctrl.$setValidity('identitynum', false);
                }
                else
                    ctrl.$setValidity('identitynum', false);
                return viewValue;
            });
        }
    };
}).directive('number', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            var string_REGEXP = /[^0-9]/;
            ctrl.$parsers.unshift(function (viewValue) {
                if (viewValue == '' || string_REGEXP.test(viewValue)) {
                    // it is valid
                    ctrl.$setValidity('number', true);
                    return viewValue;
                } else {
                    // it is invalid, return undefined (no model update)
                    ctrl.$setValidity('number', false);
                    return viewValue;
                }
            });
        }
    };
})

