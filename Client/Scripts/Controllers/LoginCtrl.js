/// <reference path="../Libraries/angular.min.js" />
companionApp.controller('LoginCtrl', ['$scope', '$location', '$rootScope', 'alerts', 'connect', function ($scope, $location, $rootScope, alerts, connect) {
    $rootScope.isLogin = true;
    $rootScope.isWait = false;
    $scope.isDisableBtn = false;
    //if guide expired
    if ($rootScope.user == null || $rootScope.user == undefined) {
        $rootScope.user = JSON.parse(localStorage.getItem('AyeletHashacharCompanionship'));
    }

    $scope.login = function () {
        if ($scope.checkRequiredFields()) {
			$scope.isDisableBtn = true;
		
            connect.post(false, connect.functions.Login, {userName: $scope.userName, password: $scope.userPassword }, function (result) {
            //connect.login({
            //    userName: $scope.userName,
            //    password: $scope.userPassword
            //}, function (result) {
                if (result == "" || result == null || result == undefined || result.iUserId && result.iUserId == -1) {
                    alerts.alert('שם משתמש או סיסמה אינם תקינים', 'אופס...');
                } else {
                    $rootScope.user = result;
                    $rootScope.userName = $scope.userName;
                    localStorage.setItem('AyeletHashacharCompanionship', JSON.stringify($rootScope.user));
                    $rootScope.isLogin = false;
					$location.path('/Orders/Orders.html');
                }
            });
        }
    };

    $scope.checkRequiredFields = function () {
        if ((!$scope.userName) || (!$scope.userPassword)) {
            alert("לא הכנסת שם ו/או סיסמה!");
            return false;
        }
        return true;
	};
	$scope.var = { forgetPassword: false };

	$scope.user = {
		'nvUserName': '',
		'nvPassword': '',
		'nvMail': ''
	};
	$scope.resetPassword = function () {
		connect.post(true, 'ResetUserPassword', { nvMail: $scope.user.nvMail }, function (result) {
			if (result == 1) {
				$scope.openDialog("הסיסמא נשלחה לכתובת מייל שהזנת");
				$scope.var.forgetPassword = false;
			}
			if (result == -1)
				$scope.openDialog("ארעה שגיאה בלתי צפויה, נסה שנית");
			if (result == -2)
				$scope.openDialog("כתובת המייל לא נמצאה במערכת");
			$scope.resetUser();
		});
	};

	$scope.resetUser = function () {
		$scope.var.forgetPassword = true;
		$scope.user.nvMail = '';
		$scope.user.nvUserName = '';
		$scope.user.nvPassword = '';
	}

}]);