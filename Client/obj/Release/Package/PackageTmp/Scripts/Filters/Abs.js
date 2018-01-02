companionApp.filter('abs', function () {
    return function (data) {
        if (typeof (data) == 'undefined' || isNaN(data)) {
            return 0;
        }
        return Math.abs(data);
    }
});