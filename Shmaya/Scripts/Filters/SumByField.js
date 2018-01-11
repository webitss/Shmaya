companionApp.filter('sumByField', function () {
    return function (data, key) {
        if (typeof(data) === 'undefined' || typeof(key) === 'undefined') {
            return 0;
        }
        var sum = 0;
        for (var i = data.length - 1; i >= 0; i--) {
            var value = parseInt(data[i][key]);
            if (value > 0)
                sum += value;
        }
        return sum;
    };
});

