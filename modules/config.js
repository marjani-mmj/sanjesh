(function() {
    'use strict';
    window.GovahiApp = window.GovahiApp || {};

    GovahiApp.config = {
        selectors: {
            headerLabels: {
                province: 'استان:',
                region: 'منطقه:',
                schoolCode: 'کد مدرسه:',
                schoolName: 'مدرسه:',
                major: 'رشته:',
                studentType: 'دانش آموز:',
                grade: 'پایه:'
            },
            tableBody: '.modal-body tbody tr',
            regionIdLabel: '.school-info .infomark.ng-binding[ng-bind="$root.userContext.regionId"]'
        },
        defaultApiUrl: '', // کاربر بعداً می‌تواند در پنل وارد کند
        style: {
            extractedRow: 'extracted-row',
            rowBgColor: '#d4edda'
        }
    };
})();