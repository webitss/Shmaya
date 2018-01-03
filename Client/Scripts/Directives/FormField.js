/**
 * Created by user on 21/09/2015.
 */

companionApp.directive('formField', function ($compile) {

    var inputIdentity = 0;

    var directive = {};
    directive.restrict = 'E';
    directive.template = function (element, attrs) {

        if (!element[0].children[0].attributes.name) {
            var model = element[0].children[0].attributes['ng-model'];
            model = model && model.value ? model.value : '';
            element[0].children[0].setAttribute('name', 'elem_' + (inputIdentity++) + '_' + model);
        }

        var html = element[0].innerHTML;

        var div = '<div class="form-item form-group row " show-errors>' +
            '<span class="text col-md-3">' + attrs.spanText + '</span> ' +
            '<div class="input col-md-7">' + html + '</div>' +
            '</div>';

        return div;
    };

    directive.link = function (scope, element, attrs) {
        var el = angular.element('<span/>');

    };

    return directive;
});