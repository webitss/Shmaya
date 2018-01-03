companionApp.filter('floor', function () {
    return function (data) {
        if (typeof (data) == 'undefined' || isNaN(data)) {
            return 0;
        }
        return Math.floor(data);
    }
});