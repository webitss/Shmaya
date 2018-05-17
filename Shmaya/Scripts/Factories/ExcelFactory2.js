"use strict"
companionApp.factory("excelFactory", ['$filter', '$timeout', function ($filter, $timeout) {

	function fixCellValue(val) {
		if (val == null || val == undefined)
			val = ''
		if (val == -1)
			return ''
		if (val.toString() == 'true')
			return 'V';
		if (val.toString() == 'false')
			return '';
		if (angular.isDate(val) && val.toString().indexOf('GMT') > -1) {
			return val.getDate() + '/' + (val.getMonth() + 1) + '/' + val.getFullYear();
			//console.log(val.getDate() + '/' + (val.getMonth() + 1) + '/' + val.getFullYear())
		}
		return val;
	}

	function download(tab_text, fileName) {


		tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
		tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
		tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // removes input params

		var ua = window.navigator.userAgent;
		var msie = ua.indexOf("MSIE ");
		var sa;
		var txtArea1 = angular.element('<textarea></textarea >');
		if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
		{
			txtArea1.document.open("txt/html", "replace");
			txtArea1.document.write(tab_text);
			txtArea1.document.close();
			txtArea1.focus();
			sa = txtArea1.document.execCommand("SaveAs", true, fileName + ".xls");
		}
		else                 //other browser not tested on IE 11
		//sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text) + '', '');
		{
			var a = document.createElement('a');
			var data_type = 'data:application/vnd.ms-excel';
			a.href = data_type + ', ' + encodeURIComponent(tab_text);
			a.download = fileName + '.xls';
			a.click();
			//e.preventDefault();
		}
	}

	var htmlHearer = '<html><head><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"></head><body>'

	return {
		excelExport: function (fileName, columns, data) {

			columns = $filter('filter')(columns, { type: '!hidden' });
			columns = $filter('filter')(columns, { type: '!edit' });
			var tab_text = htmlHearer;
			tab_text += '<table border="1" style="direction:rtl">';
			tab_text += '<tr>';
			angular.forEach(columns, function (col) {
				tab_text += '<td><b>' + col.title + '</b></td>';
			});
			angular.forEach(data, function (row) {
				tab_text += '<tr>';
				angular.forEach(columns, function (col) {
					tab_text = tab_text + '<td>' + fixCellValue(row[col.fieldName]) + '</td>';
				});
				tab_text = tab_text + '</tr>';
			});
			tab_text = tab_text + '</table>';
			tab_text = tab_text + '</body><html>';
			download(tab_text, fileName);


		},

		exportStatic: function (fileName, staticColumns, columns, columnFieldsHeader, data, dynamicColumns) {

			var tab_text = htmlHearer;
			tab_text += '<table border="1" style="direction:rtl">';

			angular.forEach(staticColumns, function (col) {
				tab_text += '<td><b>' + col.title + '</b></td>';
			});

			var colHeader = '';
			angular.forEach(columns, function (val) {
				colHeader += '<td><b>';
				angular.forEach(columnFieldsHeader, function (col) {
					colHeader += val[col] + ' ';
				});
				colHeader += '</b></td>';
			});
			tab_text = tab_text + colHeader + '</tr>';

			angular.forEach(data, function (data) {
				tab_text = tab_text + '<tr>';
				angular.forEach(staticColumns, function (col) {
					tab_text = tab_text + '<td>' + fixCellValue(data[col.fieldName]) + '</td>';
				});

				angular.forEach(data[dynamicColumns], function (cell) {
					tab_text = tab_text + '<td>' + fixCellValue(cell) + '</td>';
				});

				tab_text = tab_text + '</tr>';
			});
			tab_text = tab_text + '</table>';


			tab_text = tab_text + '</body><html>';

			download(tab_text);
		}


	};
}

])
	;
