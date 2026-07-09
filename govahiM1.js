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

    var modules = [
        '/modules/config.js',
        '/modules/extractor.js',
        '/modules/ui-panel.js',
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
            if (typeof GovahiApp.extractor === 'undefined' ||
                typeof GovahiApp.ui === 'undefined' ||
                typeof GovahiApp.apiHandler === 'undefined' ||
                typeof GovahiApp.localAssigner === 'undefined') {
                console.error('برخی ماژول‌ها بارگذاری نشدند.');
                return;
            }

            GovahiApp.config = GovahiApp.config || {};
            GovahiApp.config.apiUrl = API_URL;
            GovahiApp.config.apiToken = API_TOKEN;

            GovahiApp.ui.getApiUrl = function() {
                return GovahiApp.config.apiUrl;
            };

            var apiInput = document.getElementById('api-url-input');
            if (apiInput) {
                apiInput.style.display = 'none';
            }

            // ---------- تابع تشخیص صفحه ----------
            function isOnListPage() {
                return document.querySelectorAll('.modal-body tbody tr').length > 0;
            }

            function isOnCertificatePage() {
                return document.querySelectorAll('#print-content .col-md-6').length > 0;
            }

            // به‌روزرسانی وضعیت دکمه‌ها بر اساس صفحهٔ جاری
            function updateButtonStates() {
                if (isOnCertificatePage()) {
                    // در صفحه گواهینامه: دکمه‌های استخراج و اختصاص غیرفعال
                    GovahiApp.ui.setExtractEnabled(false);
                    GovahiApp.ui.setAssignEnabled(false);
                } else {
                    // در صفحه لیست: فعال (ارسال به سنجش هم طبق روال عادی بعداً تنظیم می‌شود)
                    GovahiApp.ui.setExtractEnabled(true);
                    GovahiApp.ui.setAssignEnabled(true);
                }
            }

            // ---------- رویداد استخراج ----------
            GovahiApp.ui.onExtract(function() {
                if (!isOnListPage()) {
                    GovahiApp.ui.setStatus('⚠️ این عملیات فقط در صفحهٔ لیست فارغ‌التحصیلان قابل انجام است.');
                    return;
                }

                var header = GovahiApp.extractor.extractHeader();
                var students = GovahiApp.extractor.extractStudents();
                window.extractedData = { header: header, students: students };
                GovahiApp.extractor.highlightRows();

                var regionCode = header['کد_منطقه'] || header['region_code'] || '';
                var authorized = GovahiApp.config.authorizedRegions;

                if (authorized.indexOf(regionCode) !== -1) {
                    GovahiApp.isRegionAuthorized = true;
                    GovahiApp.ui.enableSendButton();
                    GovahiApp.ui.hideManualInput();
                    GovahiApp.ui.setStatus('✅ اطلاعات استخراج و ذخیره شد. منطقه مجاز می‌باشد.');
                } else {
                    GovahiApp.isRegionAuthorized = false;
                    GovahiApp.ui.disableSendButton();
                    GovahiApp.ui.showManualInput();
                    GovahiApp.ui.setStatus('⚠️ خدمات در منطقهٔ شما تقاضا نشده است. لطفاً شمارهٔ شروع و تاریخ را وارد کرده و سپس اختصاص دهید.');
                }

                console.log('Extracted Data:', window.extractedData);
            });

            // ---------- دکمهٔ اختصاص محلی ----------
            document.getElementById('govahi-assign-local-btn').addEventListener('click', function() {
                if (!isOnListPage()) {
                    GovahiApp.ui.setStatus('⚠️ این عملیات فقط در صفحهٔ لیست فارغ‌التحصیلان قابل انجام است.');
                    return;
                }

                var startNumber = parseInt(document.getElementById('govahi-start-number').value, 10);
                var issueDate = document.getElementById('govahi-issue-date').value.trim();

                if (!startNumber || !issueDate) {
                    alert('لطفاً شماره شروع و تاریخ را وارد کنید.');
                    return;
                }

                if (!window.extractedData || !window.extractedData.students) {
                    alert('ابتدا اطلاعات را استخراج کنید.');
                    return;
                }

                GovahiApp.localAssigner.assign(startNumber, issueDate);
                GovahiApp.ui.setStatus('✅ شماره گواهینامه‌ها با موفقیت اختصاص یافت.');
            });

            // ---------- ارسال به API (همانند قبل) ----------
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
                        var rows = document.querySelectorAll('.modal-body tbody tr');
                        var students = window.extractedData ? window.extractedData.students : [];

                        result.students.forEach(function(cert) {
                            var student = students.find(function(s) {
                                return s.کد_ملی === cert.کد_ملی || s.کد_دانش_آموزی === cert.کد_ملی;
                            });
                            if (student) {
                                student.شماره_گواهینامه = cert.شماره_گواهینامه;
                                var idx = students.indexOf(student);
                                if (rows[idx]) {
                                    var certCell = rows[idx].querySelectorAll('td')[11];
                                    if (certCell) certCell.textContent = cert.شماره_گواهینامه;

                                    var noteCell = rows[idx].querySelectorAll('td')[12];
                                    if (noteCell) noteCell.textContent = cert.تاریخ_صدور || '';
                                }
                            }
                        });

                        GovahiApp.ui.setStatus('✅ شماره گواهینامه‌ها و تاریخ صدور دریافت و ثبت شد.');
                    } else {
                        GovahiApp.ui.setStatus('⚠️ ساختار پاسخ نامعتبر.');
                    }
                })
                .catch(function(err) {
                    GovahiApp.ui.setStatus('❌ خطا: ' + err.message);
                });
            };

            GovahiApp.ui.onSend(function() {
                if (!window.extractedData) {
                    alert('ابتدا اطلاعات را استخراج کنید.');
                    return;
                }
                GovahiApp.apiHandler.send(window.extractedData);
            });

            // تنظیم اولیه وضعیت دکمه‌ها
            updateButtonStates();

            // در صورت تغییر صفحه (مثلاً با AJAX) می‌توان با MutationObserver بازبینی کرد،
            // ولی برای سادگی می‌توان هر بار که پنل باز می‌شود وضعیت را چک کرد.
            // با کلیک روی دکمه شناور وضعیت دوباره بررسی شود.
            var originalToggle = GovahiApp.ui.togglePanel;
            GovahiApp.ui.togglePanel = function() {
                originalToggle();
                if (panel.style.display === 'block') { // اگر پنل باز شد
                    updateButtonStates();
                }
            };

            console.log('GovahiApp ready. استفاده از دکمه شناور برای شروع.');
            return;
        }

        loadScript(modules[index], function() {
            loadModulesSequentially(index + 1);
        });
    }

    loadModulesSequentially(0);
})();
