companionApp.directive('tooltipsTarget', function ($timeout) {
    return {
        restrict: 'EA',
        scope: {
            info: "@",
            html: '='
        },
        compile: function (element, attributes) {

            return {
                pre: function (scope, element, attributes, controller, transcludeFn) {

                },
                post: function (scope, element, attributes, controller, transcludeFn) {

                    if (!scope.info) return;

                    scope.mouseInElement = true;
                    scope.isFirst = true;
                    scope.clickAppend = true;
                    scope.toolTipOpen = false;

                    element.on('mouseleave', function () {
                        $(".popover").remove();
                        scope.isFirst = true;
                    });

                    element.on('click', function () {
                        $(element).popover({
                            animation: true,
                            //selector:'odeya',
                            html: scope.html,
                            content: scope.info,
                            container: 'body'
                        });
                        //fix some bug
                        if (scope.isFirst) {
                            scope.isFirst = false;
                            $(element).click();
                        }
                    });


                }
            }
        }
    }
});