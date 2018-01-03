"use strict"

companionApp.factory("screenHeight", ['$window', '$timeout', function ($window, $timeout) {

    return {
        getScreenHeight: function (selector, moreOffset, callback) {
            var getTopOffset = function () {
                if ($(selector).offset() != undefined) {
                    callback($window.innerHeight - $(selector).offset().top - moreOffset + "px");
                }
                else {
                    $timeout(getTopOffset, 20);
                }
            }
            getTopOffset();
        }
    };
}])
;
