NOApp.controller('pdfReportCtrl', ['$scope', 'orderConnect', '$filter', 'orderAlerts', '$rootScope', 'createDialog', '$location',
	function ($scope, orderConnect, $filter, orderAlerts, $rootScope, createDialog, $location) {
		function BuildReport() {
			console.log('BuildReport');
		};

		setTimeout(BuildReport, 30000);
		$scope.getData = function () {
			orderConnect.post(true, 'GetOrders', {},
				function (result) {
					$scope.OrdersList = result;
					$scope.isDataLoaded++;
					$scope.OrdersList.forEach(function (order) {
						order.iMonthYearId = order.iMonthYearId + ""
						$scope.tmpDate1 = order.iMonthYearId.substring(0, 4);
						$scope.tmpDate2 = order.iMonthYearId.substring(4, 6);
						$scope.tmpDate = $scope.tmpDate2 + '/' + $scope.tmpDate1;
						order.iMonthYearId = $scope.tmpDate;
						$scope.order = $scope.OrdersList[$scope.OrdersList.length - 1]
					})
				});
		}
		$scope.getData();
		//setTimeout(console.log("@"), 10000);
	
	}]);