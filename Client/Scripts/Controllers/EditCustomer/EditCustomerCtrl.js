"use strict"
companionApp.controller('EditCustomerCtrl', ['$scope', '$rootScope', 'connect', '$location', '$filter', '$timeout', 'codeTablesName', 'codeTablesId',
	function ($scope, $rootScope, connect, $location, $filter, $timeout, codeTablesName, codeTablesId) {
	$scope.selectedMember = $scope.item != undefined ? $scope.item : $scope.searchMember;


	$scope.index = -1;


	$scope.loadCodeTablesList = false;
	$scope.tabs = [
		{ title: 'פרטים אישיים', content: 'Partials/Pages/EditCustomer/PrivateDetails.html'},
		{ title: 'החזרים  ללקוח', content: 'Partials/Pages/EditCustomer/Refunds.html'},//|| $scope.selectedMember.iCompanionshipStatusType != codeTablesId.companionship.noCompanionship 
		{ title: 'שליחת הודעות', content: 'Partials/Pages/Messages/Messages.html'},
		{ title: 'קשרים', content: 'Partials/Pages/EditCustomer/Connections.html'},//|| $scope.selectedMember.iCompanionshipStatusType == codeTablesId.companionship.noCompanionship 
		{ title: 'תיעוד שיחות', content: 'Partials/Pages/Conversations.html'},// || $scope.selectedMember.iStatusType == codeTablesId.statusType.newMember || $scope.selectedMember.iStatusType == codeTablesId.statusType.waitToNew 
		{ title: 'הערות', content: 'Partials/Pages/EditCustomer/Remarks.html' }
	];
}]);