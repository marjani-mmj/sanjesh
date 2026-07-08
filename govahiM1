(function() {
    'use strict';

    var scripts = document.getElementsByTagName('script');
    var currentScript = scripts[scripts.length - 1];
    var baseUrl = currentScript.src.replace(/\/[^\/]*$/, '');

    window.GovahiApp = window.GovahiApp || {};

    var modules = [
        '/modules/config.js',
        '/modules/extractor.js',
        '/modules/ui-panel.js',
        '/modules/api-handler.js'
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
            if (typeof GovahiApp.extractor === 'undefined' ||
                typeof GovahiApp.ui === 'undefined' ||
                typeof GovahiApp.apiHandler === 'undefined') {
                console.error('برخی ماژول‌ها بارگذاری نشدند.');
                return;
            }

            GovahiApp.ui.onExtract(function() {
                var header = GovahiApp.extractor.extractHeader();
                var students = GovahiApp.extractor.extractStudents();
                window.extractedData = { header: header, students: students };
                GovahiApp.extractor.highlightRows();
                GovahiApp.ui.setStatus('✅ اطلاعات استخراج و ذخیره شد.');
                GovahiApp.ui.enableSendButton();
                console.log('Extracted Data:', window.extractedData);
            });

            GovahiApp.ui.onSend(function() {
                if (!window.extractedData) {
                    alert('ابتدا اطلاعات را استخراج کنید.');
                    return;
                }
                GovahiApp.apiHandler.send(window.extractedData);
            });

            console.log('GovahiApp ready. استفاده از دکمه شناور برای شروع.');
            return;
        }

        loadScript(modules[index], function() {
            loadModulesSequentially(index + 1);
        });
    }

    loadModulesSequentially(0);
})();
