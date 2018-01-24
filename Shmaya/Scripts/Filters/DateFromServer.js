companionApp.filter('dateFromServer', function ($filter) {
    return function (jsonDate) {
        if (jsonDate == undefined || jsonDate == null || jsonDate == '') {
            return null;
        }
        if (jsonDate instanceof Date) {
            return jsonDate;
        }
        if (jsonDate instanceof Date)
            return jsonDate;
        var date = jsonDate.substring(jsonDate.indexOf("(") + 1, jsonDate.indexOf("+") == -1 ? jsonDate.indexOf(")") : jsonDate.indexOf("+"));

        if (date == "")
            return jsonDate;
        date = new Date(parseInt(date));
        //date.setDate(date.getDate() + 1);

        return date;// $filter('date')(date, format ? format : 'dd/MM/yyyy');
    }
})
companionApp.filter('newDateWithFormat', function () {
    return function (data) {
        if (typeof (data) === 'undefined' || data == null) {
            return null;
        }
        var day = data.substring(0, data.indexOf('/'))
        data = data.substring(data.indexOf('/') + 1, data.length);
        var month = data.substring(0, data.indexOf('/'))
        //month = (parseInt(month) - 1).toString();
        data = data.substring(data.indexOf('/') + 1, data.length);
        var year = data.substring(0, data.length);
        return new Date(month + '/' + day + '/' + year);

    }
})
//.filter('dateToSend', function () {
//    return function (data) {
//        if (typeof (data) === 'undefined') {
//            return '';
//        }
//        if (angular.isDate(data))
//            return '/Date(' + Date.UTC(data.getFullYear(), data.getMonth(), data.getDate()) + ')/';
//    }
//}).filter('dateToSendFromText', function () {
//    return function (data) {
//        if (typeof (data) === 'undefined') {
//            return '';
//        }
//        //if (angular.isDate(data))
//        //"01/01/2015"
//        var day = data.substring(0, data.indexOf('/'))
//        data = data.substring(data.indexOf('/') + 1, data.length);
//        var month = data.substring(0, data.indexOf('/'))
//        month = (parseInt(month) - 1).toString();
//        data = data.substring(data.indexOf('/') + 1, data.length);
//        var year = data.substring(0, data.length);
//        return '/Date(' + Date.UTC(year, month, day) + ')/';
//    }
//}).filter('textDateFromObjWithFormat', function () {
//    return function (data) {
//        if (angular.isDate(data)) {
//            var day = data.getDate();
//            if (day <= 9)
//                day = '0' + day;
//            var month = parseInt(data.getMonth() + 1);
//            if (month <= 9)
//                month = '0' + month;
//            return day + '/' + month + '/' + data.getFullYear();
//        }
//        return ''
//    }
//}).filter('dateTimeFromDatePicker', function ($filter) {
//    return function (date) {
//        if (!date || date == '') return null;
//        if (angular.isDate(date.toDate())) {
//            return $filter('dateToSend')(date.toDate());
//        }
//        else {
//            return $filter('dateToSend')($filter('newDateWithFormat')(date));
//        }
//    }
//}).filter('dateObjFromDatePicker', function ($filter) {
//    return function (date) {
//        if (!date || date == '') return null;
//        if (angular.isDate(date.toDate())) {
//            return date.toDate();
//        }
//        else {
//            return $filter('newDateWithFormat')(date);
//        }
//    }
//}).filter('dateTextFromDatePicker', function ($filter) {
//    return function (date) {
//        if (angular.isDate(date.toDate())) {
//            return $filter('textDateFromObjWithFormat')(date.toDate());
//        }
//        else {
//            return date;
//        }
//    }
//});


