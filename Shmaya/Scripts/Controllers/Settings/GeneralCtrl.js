"use strict"
companionApp.controller('GeneralCtrl', ['$scope', '$rootScope', 'connect', '$timeout', '$filter', 'alerts', 'createDialog', '$uibModal', 'codeTablesId',
	function ($scope, $rootScope, connect, $timeout, $filter, alerts, createDialog, $uibModal, codeTablesId, ) {
		$scope.UpdateGlobalParameter = function (num, id) {
			num = parseInt(num);
			$rootScope.maxHours = num;
			connect.post(true, 'UpdateGlobalParameter', { value: num, id: id },
				function (result) {
					if (result)
						alerts.alert("העדכון בוצע בהצלחה")
				});
		}
	}]);