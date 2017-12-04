"use strict"
companionApp.factory('changesAlert', ['$rootScope', 'createDialog', function ($rootScope, createDialog) {

    return {
        updateChangesStatus: function (status) {
            $rootScope.thereAreChanges = status;
        },

        alert: function (OKcallback, cancelCallback) {
            if ($rootScope.thereAreChanges)
                createDialog({
                    id: 'Login',
                    template: "<div class='divAlert'>האם ברצונך לצאת ללא שמירת נתונים?<br/> <button  ng-click='OK()' class='btn command-button btn-lg btn-mnl btn-Alert' >אישור</button><button style='float: left'  ng-click='cancel()' class='btn command-button btn-lg btn-mnl btn-Alert' >ביטול</button>" + "</div>",
                    title: "אזהרה",
                    scope: $rootScope,
                    backdrop: true,
                    modalClass: "modal modalAlert"
                });

            else OKcallback();

            $rootScope.OK = function () {
                $rootScope.$modalClose();
                OKcallback();
                $rootScope.thereAreChanges = false;
            };

            $rootScope.cancel = function () {
                $rootScope.$modalClose();
                if (cancelCallback)
                    cancelCallback();
            };
        }

    };
}
]);
