var identity = 0;
companionApp.directive('myCalendar', ['$timeout', '$filter', '$rootScope', 'createDialog', 'connect', 'forceLogOut', 'alerts', '$timeout', '$window', function ($timeout, $filter, $rootScope, createDialog, connect, forceLogOut, alerts, $timeout, $window) {
    return {
        restrict: 'E',
        scope: {
            ngModel: '=?',
            timeAvailablity: '=',
            jobStatusType: '=',
            type: '@',
            fieldActive: '@?'
        },

        templateUrl: 'Partials/Templates/CalendarTemplate.html',

        link: function (scope, element, attrs) {
			var notChangeTimeAvailablity = false;
			scope.currentMonth = new Date();
            scope.ngModel = angular.isDefined(scope.ngModel) ? scope.ngModel : new Date();
            //!!
            scope.fieldActive = angular.isDefined(scope.fieldActive) ? scope.fieldActive : 'bWorkerOfferedJobTimeAvailablity';
            scope.dayInFocus = {
                date: new Date()
            };
            scope.dialog;
            scope.minDate = new Date().setHours(0, 0, 0, 0);
            scope.chooseAll = false;
            scope.calendar = { openCommentPage: false, selectedDay: null };

            scope.alert = { nvMessage: "", showAlert: false };

            scope.getText = function (nvInternalTextName, dafaultText) {
                //if ($rootScope.flagLanguage)
                //    return language.getText(nvInternalTextName) ? language.getText(nvInternalTextName) : dafaultText;
                //else
                return dafaultText;
            };
            scope.inPrintingProcess = false;
            scope.monthChange = function () {
                if (scope.ngModel instanceof Date)
                    scope.dayInFocus.date = new Date(scope.ngModel.setHours(0, 0, 0, 0));
                else
                    scope.dayInFocus.date = new Date().setHours(0, 0, 0, 0);
                scope.lMonthDays = [];
                var loopDate = new Date(scope.currentMonth.getFullYear(), scope.currentMonth.getMonth(), 1, 0, 0, 0, 0);
                loopDate = new Date(loopDate.setDate(loopDate.getDate() - loopDate.getDay()));

                var index = -1000;
                while (scope.currentMonth.getMonth() == loopDate.getMonth() || scope.lMonthDays.length == 0 || scope.lMonthDays.length % 7 != 0) {
                    var isActive = false, nvTitle = '', nvComment = '', isToday = false/*, isAvailable = false*/, commentList = [];
                    // nvComment = '',
                    var arr = $filter('filter')(scope.timeAvailablity, function (item) {
						if (item.dtTimeBegin)
							return item.dtTimeBegin.getTime() == loopDate.getTime();
						else if (item.dtTimeBegin)
							return $filter('dateFromServer')(item.dtTimeBegin).getTime() == loopDate.getTime();
					});
				
					if (arr != undefined)
						{
						if (arr.length > 0) {
							isActive = true;
							angular.forEach(arr, function (item, index) {
								nvTitle += item.nvName;
								if (arr.length > 0 && index < (arr.length - 1))
									nvTitle += ', '
							});
						}
                        //isAvailable = arr[0][scope.fieldActive];
                    }
                     if (loopDate.getTime() == new Date().setHours(0, 0, 0, 0)) {
                        //scope.dayInFocus.date = angular.copy(loopDate);
                        //scope.ngModel = scope.dayInFocus.date;
                        isToday = true;
                    }

                    scope.lMonthDays.push({
                        dDayDate: angular.copy(loopDate),
                        bActive: true,
                        day: loopDate.getDate(),
                        bIsActive: isActive,
                       // bWorkerOfferedJobTimeAvailablity: isAvailable,
                        bIsToday: isToday,
                        nvTitle: nvTitle
                    });
                    loopDate = new Date(loopDate.setDate(loopDate.getDate() + 1));
                };

                angular.forEach(scope.lMonthDays, function (day) {
                    //scope.getDayComments(day);
                });
            };

            scope.nextMonth = function () {
                scope.currentMonth.setMonth(scope.currentMonth.getMonth() + 1);
                scope.monthChange();
            };

            scope.prevMonth = function () {
                scope.currentMonth.setMonth(scope.currentMonth.getMonth() - 1);
                scope.monthChange();
            };

            scope.chooseDate = function (elem, date) {
                if (scope.minDate <= date) {
                    scope.dayInFocus.date = date;
                    scope.ngModel = date;
                }
            };

            scope.activeDate = function (day) {
                if (day.dDayDate.getMonth() == scope.currentMonth.getMonth()) {
                    day.bWorkerOfferedJobTimeAvailablity = !day.bWorkerOfferedJobTimeAvailablity;
                    for (var i = 0; i < scope.timeAvailablity.length; i++) {
                        //!!
						if ($filter('dateFromServer')(scope.timeAvailablity[i].dtTimeBegin).getTime() == day.dDayDate.getTime()) {
                            scope.timeAvailablity[i][scope.fieldActive] = day.bWorkerOfferedJobTimeAvailablity;
                            notChangeTimeAvailablity = true;
                            break;
                        }
                    }
                }
            };

            scope.initNewComment = function () {
                scope.newComment = {
                    iCommentId: -1,
                    nvComment: "",
                    dCommentDate: null
                }
            }

            scope.activeAllDate = function () {
                scope.chooseAll = !scope.chooseAll;
                for (var i = 0; i < scope.timeAvailablity.length; i++) {
                    scope.timeAvailablity[i][scope.fieldActive] = scope.chooseAll;
                    var arr = $filter('filter')(scope.lMonthDays, function (item) {
						return item.dDayDate.getTime() == scope.timeAvailablity[i].dtTimeBegin.getTime();
                    });
                    if (arr && arr.length) {
                        arr[0][scope.fieldActive] = scope.chooseAll;
                    }
                }
                notChangeTimeAvailablity = true;
            };

            //scope.openCommentPage = function (day) {
            //    scope.calendar.openCommentDialog = true;
            //    scope.calendar.selectedDay = day;
            //    scope.initNewComment();
            //    scope.openCommentDialog();
            //}

            //scope.openCommentDialog = function () {
            //    scope.newComment.dCommentDate = scope.calendar.selectedDay.dDayDate;
            //    createDialog({
            //        id: 'DayCommentsDialog',
            //        templateUrl: 'Partials/AdvancedStudy/Comments.html',
            //        title: "הערות",
            //        scope: scope,
            //        backdrop: true,
            //        modalClass: "modal modalAlert"
            //    });
            //}

            //scope.getDayComments = function (day) {
            //    day.commentList = [];
            //    var data = {
            //        day: day.dDayDate,
            //        nvGuide: $rootScope.user.nvGuide
            //    }
            //    connect.post(true, 'GetDayComments', data, function (result) {
            //        day.commentList = result;
            //        angular.forEach(day.commentList, function (comment) {
            //            comment.isEdit = false;
            //        });
            //    });
            //}

            //scope.deleteComment = function (comment) {
            //    var data = {
            //        iCommentId: comment.iCommentId,
            //        iUserId: $rootScope.user.iUserId,
            //        nvGuide: $rootScope.user.nvGuide
            //    }

            //    connect.post(true, 'DeleteDayComment', data, function (result) {
            //        if (result == true) {
            //            scope.displayAlert('הערה נמחקה');
            //            scope.getDayComments(scope.calendar.selectedDay);
            //        }
            //        else {
            //            scope.displayAlert('ארעה שגיאה, הפעולה לא בוצעה');
            //        }
            //    })
            //}

            //scope.saveComment = function (commentToEdit) {
            //    var comment = {
            //        iCommentId: commentToEdit.iCommentId,
            //        nvComment: commentToEdit.nvComment,
            //        dCommentDate: scope.calendar.selectedDay.dDayDate
            //    }
            //    connect.post(true, 'DayCommentInsertUpdate', {
            //        dayComment: comment,
            //        UserId: $rootScope.user.iUserId,
            //        nvGuide: $rootScope.user.nvGuide
            //    },
            //    function (result) {
            //        if (result > 0) {
            //            scope.displayAlert('הערה נשמרה');
            //            scope.getDayComments(scope.calendar.selectedDay);
            //        }
            //        else {
            //            scope.displayAlert('ארעה שגיאה, ההערה לא נשמרה');
            //        }
            //        if (commentToEdit == scope.newComment) {
            //            scope.initNewComment();
            //        }
            //        else
            //            commentToEdit.isEdit = false;
            //    })
            //}

            scope.initCalendar = function () {
                if (scope.type == 'large') {
                    scope.lWeekDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
                } else {
                    scope.lWeekDays = ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"];
                }
                //!!
                scope.$watch('jobStatusType', function (newValue, oldValue) {
                    if (newValue != undefined) {
                        scope.currentMonth = new Date();
                        //if (scope.timeAvailablity.length > 0) {

                        //    if (scope.timeAvailablity[0].dtFromDate)
                        //        scope.currentMonth.setMonth(scope.timeAvailablity[0].dtFromDate.getMonth());
                        //    else
                        //        scope.currentMonth.setMonth($filter('dateFromServer')(scope.timeAvailablity[0].dFromDate).getMonth());
                        //}

                        scope.monthChange();
                    }
                }, true);

                scope.$watch('timeAvailablity', function (newValue, oldValue) {
                    if (notChangeTimeAvailablity) {
                        notChangeTimeAvailablity = false;
                        return;
                    }
                    if (newValue != undefined) {
                        scope.monthChange();
                    }
                }, true);
            };
            scope.initCalendar();

            scope.displayAlert = function (message) {
                scope.alert.nvMessage = message;
                scope.alert.showAlert = true;
                $timeout(function () {
                    scope.alert.showAlert = false;
                }, 1000);
            }


            scope.printCalendar = function () {
                // scope.screenHeight = '100%';
                scope.inPrintingProcess = true;
                $timeout(function () {
                    var printContents = document.getElementById('calendar-directive').innerHTML;
                    var originalContents = document.body.innerHTML;
                    document.body.innerHTML = printContents;

                    window.print();
                    document.body.innerHTML = originalContents;
                    scope.inPrintingProcess = false;
                    // $route.reload();                  
                    $window.location.reload();
                    //  $scope.studyActiveTab = 1;

                    //==================
                });
                //var data = {
                //    nvHtmlContent: printContents,
                //    nvFileName: 'AdvancedStudyCalendar/CreatedByManager/'
                //}
                //connect.post(true, 'CreatePdfFromContent', data, function (result) {
                //    if (result != '') {
                //        alert(result);
                //    }
                //    // console.log('calendar-html' + printContents);
                //});

            }
        }
    };
}]);