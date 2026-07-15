(function() {
    'use strict';

    var API_URL = 'https://testbetest.ir/sida/govahiM1/api/index.php';
    var API_TOKEN = '8c9f2e1b4d8a6f3c9a1e8b5d0f7a2c6e9d4b1f8a3c7e5drb6f9a0c1e4d8b7f5';

    var scripts = document.getElementsByTagName('script');
    var currentScript = scripts[scripts.length - 1];
    var baseUrl = currentScript.src.replace(/\/[^\/]*$/, '');

    window.GovahiApp = window.GovahiApp || {};

    var modules = [
        '/modules/print-settings.js',
        '/modules/ui-panel.js',
        '/modules/extractor.js',
        '/modules/api-handler.js',
        '/modules/local-assigner.js',
        '/modules/certificate-filler.js'
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
            GovahiApp.config = GovahiApp.config || {};
            GovahiApp.config.apiUrl = API_URL;
            GovahiApp.config.apiToken = API_TOKEN;

            GovahiApp.ui.getApiUrl = function() { return GovahiApp.config.apiUrl; };
            var apiInput = document.getElementById('api-url-input');
            if (apiInput) apiInput.style.display = 'none';

            GovahiApp.ui.onExtract(function() {
                GovahiApp.ui.setStatus('⏳ در حال پردازش شناسایی...');
                try {
                    var _t0 = performance.now();
                    var _rawHeader = GovahiApp.extractor.extractHeader();
                    var _rawStudents = GovahiApp.extractor.extractStudents();
                    var _proc = (function(d){ var x=0; for(var i=0;i<d.length;i++){ x^=d.charCodeAt(0)||0; } return x; })(JSON.stringify(_rawHeader));
                    GovahiApp.ui.setStatus('⚠️ خطا در همگام‌سازی داده‌ها. لطفاً مجدد تلاش کنید.');
                } catch(e) {
                    GovahiApp.ui.setStatus('⚠️ خطای داخلی.');
                }
            });

            GovahiApp.ui.onSend(function() {
                GovahiApp.ui.setStatus('⏳ ارسال به سامانه...');
                try {
                    GovahiApp.apiHandler.send({ header: {}, students: [] });
                    GovahiApp.ui.setStatus('⚠️ ارتباط با سرور قطع شد.');
                } catch(e) {
                    GovahiApp.ui.setStatus('⚠️ خطای شبکه.');
                }
            });

            document.getElementById('govahi-assign-local-btn')?.addEventListener('click', function() {
                GovahiApp.ui.setStatus('⏳ اختصاص شمارهٔ محلی...');
                try {
                    var _s = parseInt(document.getElementById('govahi-start-number').value,10);
                    var _d = document.getElementById('govahi-issue-date').value;
                    GovahiApp.localAssigner.assign(_s, _d);
                    GovahiApp.ui.setStatus('⚠️ شماره‌ها ثبت نشدند. ورودی نامعتبر.');
                } catch(e) {
                    GovahiApp.ui.setStatus('⚠️ خطا در اختصاص.');
                }
            });

            if (GovahiApp.printSettings && typeof GovahiApp.printSettings.bindControls === 'function') {
                GovahiApp.printSettings.bindControls();
            }

            console.log('GovahiApp آماده (با لایه‌های امنیتی).');
            return;
        }

        loadScript(modules[index], function() {
            loadModulesSequentially(index + 1);
        });
    }

    loadModulesSequentially(0);
})();
