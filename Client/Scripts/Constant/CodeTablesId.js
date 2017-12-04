
/**
 * Created by User on 28/01/2016.
 */
companionApp.constant('codeTablesId', {

    userTypeManager: 1,
    userTypeCoordinator: 2,
    userTypeCityCoordinator: 12,

    companionshipStatusType: {
        active: 622,
        passive: 626,
        matchClarification: 691,
        verification:692,
        swinging: 698,
        flowing:699,
        forClarification: 700
    },

    statusType: {
        active: 594,
        passive: 595,
        newMember: 693,
        waitToNew: 694,
        waitToAgain: 706
    },

    companionship: {
        noCompanionship:735
    },

    permissionType: {
        systemAdministrator: 591,
        departmentManager: 592,
        coordinator: 593,
        schedulingCoordinator:649
    },

    languageType: {
        hebraw:628,
        english:629,
        french:630,
        russian:631,
        german:632,
        yiddish:633,
        flemish:634,
        swiss:635,
        turkish:636,
        greek:637,
        italian: 638,
        Spanish:690
    },

    daysInWeek: [
        '�����',
        '���',
        '�����',
        '�����',
        '�����'
    ]

}).constant('codeTablesName', {
    coordinators: 'coordinators',
    maritalStatus: 'maritalStatus',
    gender: 'gender',
    city: 'city',
    education: 'education',
    experience: 'experience',
    employment: 'employment',
    kollell: 'kollell',
    nameSource: 'nameSource',
    fileSource: 'fileSource',
    year: 'year',
    donation: 'donation',
    status: 'status',
    conversationStatus: 'conversationStatus',
    day: 'day',
    dayPart: 'dayPart',
    style: 'style',
    department: 'department', 
    companionshipStatus: 'companionshipStatus',
    Language: 'Language',
    memberFieldInterst: 'memberFieldInterst',
    UserType: 'UserType',
    Seriousness: 'Seriousness'
})

.constant('tablesId', {
    maritalStatus:1,
    gender:2,
    city:3,
    education:4,
    experience:5,
    employment:6,
    kollell:7,
    nameSource:8,
    fileSource:9,
    year:11,
    donation:12,
    status:14,
    day:15,
    dayPart:16,
    style:17,
    memberFieldInterst:18,
    persInterests:19,
    conversationStatus:22,
    companionshipStatus:21,
    Language: 23,
    Seriousness:24
});
