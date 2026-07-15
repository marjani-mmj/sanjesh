// C:\Users\manager\Desktop\sida cod\govahiM1\govahiM1.js
(function() {
    'use strict';

    // ========== تنظیمات API (ثابت) ==========
    var API_URL = 'https://testbetest.ir/sida/govahiM1/api/index.php';
    var API_TOKEN = '8c9f2e1b4d8a6f3c9a1e8b5d0f7a2c6e9d4b1f8a3c7e5drb6f9a0c1e4d8b7f5';

    // ====================================

    var scripts = document.getElementsByTagName('script');
    var currentScript = scripts[scripts.length - 1];
    var baseUrl = currentScript.src.replace(/\/[^\/]*$/, '');

    window.GovahiApp = window.GovahiApp || {};

    // فقط ماژول‌های UI و تنظیمات چاپ بارگذاری می‌شوند
    var modules = [
        '/modules/print-settings.js',
        '/modules/ui-panel.js'
    ];

    function loadScript(url, callback) {
        var script = document.createElement('script');
        script.src = baseUrl + url;
        script.onload = callback;
        script.onerror = function() {
            console.error('خطا در بارگذاری ماژول:', url);
        };
        document.head.appendChild(script);
    }

    function loadModulesSequentially(index) {
        if (index >= modules.length) {
            // تمام ماژول‌ها بارگذاری شدند – اتصال پنل بدون منطق
            GovahiApp.config = GovahiApp.config || {};
            GovahiApp.config.apiUrl = API_URL;
            GovahiApp.config.apiToken = API_TOKEN;

            GovahiApp.ui.getApiUrl = function() { return GovahiApp.config.apiUrl; };
            var apiInput = document.getElementById('api-url-input');
            if (apiInput) apiInput.style.display = 'none';

            // استخراج، ارسال، اختصاص و پر کردن همگی بی‌اثر
            GovahiApp.ui.setExtractEnabled = function() {};
            GovahiApp.ui.setAssignEnabled = function() {};
            GovahiApp.ui.enableSendButton = function() {};
            GovahiApp.ui.disableSendButton = function() {};
            GovahiApp.ui.showManualInput = function() {};
            GovahiApp.ui.hideManualInput = function() {};

            GovahiApp.ui.onExtract(function() {
                GovahiApp.ui.setStatus('⛔ عملیات غیرفعال است.');
            });
            GovahiApp.ui.onSend(function() {
                GovahiApp.ui.setStatus('⛔ عملیات غیرفعال است.');
            });

            document.getElementById('govahi-assign-local-btn')?.addEventListener('click', function() {
                GovahiApp.ui.setStatus('⛔ عملیات غیرفعال است.');
            });

            if (GovahiApp.printSettings && GovahiApp.printSettings.bindControls) {
                GovahiApp.printSettings.bindControls();
            } else {
                console.warn('printSettings بارگذاری نشده است');
            }

            console.log('GovahiApp demo ready. (بدون عملکرد)');
            return;
        }

        loadScript(modules[index], function() {
            loadModulesSequentially(index + 1);
        });
    }

    loadModulesSequentially(0);
})();
