(function() {
    'use strict';

    // ========== تنظیمات API (باید ویرایش شوند) ==========
    var API_URL = 'https://testbetest.ir/sida/govahiM1/api/index.php'; // آدرس فایل index.php
    var API_TOKEN = 'YOUR_STRONG_SECRET_TOKEN_HERE';       // توکن تعریف‌شده در config.php

    // ====================================================

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

            // ========== بازنویسی بخش API با توکن و آدرس ثابت ==========
            GovahiApp.config = GovahiApp.config || {};
            GovahiApp.config.apiUrl = API_URL;
            GovahiApp.config.apiToken = API_TOKEN;

            // فریب UI برای استفاده از آدرس ثابت
            GovahiApp.ui.getApiUrl = function() {
                return GovahiApp.config.apiUrl;
            };

            // پنهان کردن فیلد ورودی آدرس (اختیاری)
            var apiInput = document.getElementById('api-url-input');
            if (apiInput) {
                apiInput.style.display = 'none';
            }

            // بازنویسی متد send برای اضافه کردن هدر Authorization
            GovahiApp.apiHandler.send = function(data) {
                var url = GovahiApp.ui.getApiUrl();
                if (!url) {
                    alert('آدرس API تنظیم نشده است.');
                    return Promise.reject();
                }
                if (!data || !data.students) {
                    alert('داده‌ای برای ارسال وجود ندارد.');
                    return Promise.reject();
                }

                GovahiApp.ui.setStatus('⏳ در حال ارسال...');

                return fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + GovahiApp.config.apiToken
                    },
                    body: JSON.stringify(data)
                })
                .then(function(response) {
                    if (!response.ok) throw new Error('HTTP ' + response.status);
                    return response.json();
                })
                .then(function(result) {
                    if (result.students) {
                        // استفاده از متد اصلی برای به‌روزرسانی جدول
                        GovahiApp.apiHandler.updateCertificates(result.students);
                        GovahiApp.ui.setStatus('✅ شماره گواهینامه‌ها دریافت و ثبت شد.');
                    } else {
                        GovahiApp.ui.setStatus('⚠️ ساختار پاسخ نامعتبر.');
                    }
                })
                .catch(function(err) {
                    GovahiApp.ui.setStatus('❌ خطا: ' + err.message);
                });
            };

            // ========== اتصال رویدادها ==========
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
