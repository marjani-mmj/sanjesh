// C:\Users\manager\Desktop\sida cod\govahiM1\modules\api-handler.js
(function() {
    'use strict';
    window.GovahiApp = window.GovahiApp || {};

    GovahiApp.apiHandler = {
        send: function(data) {
            // هیچ ارسالی انجام نمی‌شود
            console.warn('apiHandler.send غیرفعال است');
            return Promise.resolve({ students: [] });
        },
        updateCertificates: function(certList) {
            // هیچ تغییری در جدول اعمال نمی‌شود
        }
    };
})();
