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
        '/modules/print-settings.js',
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
                typeof GovahiApp.localAssigner === 'undefined' ||
                typeof GovahiApp.printSettings === 'undefined') {
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

            // ---------- تابع پاک‌سازی کامل حافظه و کش ----------
            function clearAllPreviousData() {
                // 1. پاک کردن شیء استخراج‌شده
                window.extractedData = null;
                GovahiApp.isRegionAuthorized = undefined;

                // 2. پاک کردن تمام کش localStorage مربوط به گواهینامه‌ها
                var keysToRemove = [];
                for (var i = 0; i < localStorage.length; i++) {
                    var key = localStorage.key(i);
                    if (key && key.startsWith('gavahiname_')) {
                        keysToRemove.push(key);
                    }
                }
                keysToRemove.forEach(function(key) {
                    localStorage.removeItem(key);
                });
                console.log('🧹 حافظه و کش قبلی پاک شدند.');
            }

            // ---------- ابزار تشخیص صفحه ----------
            function isOnListPage() {
                return document.querySelectorAll('.modal-body tbody tr').length > 0;
            }

            function isOnCertificatePage() {
                return document.querySelectorAll('#print-content .col-md-6').length > 0;
            }

            function updateButtonStates() {
                if (isOnCertificatePage()) {
                    GovahiApp.ui.setExtractEnabled(false);
                    GovahiApp.ui.setAssignEnabled(false);
                    GovahiApp.ui.hideManualInput();
                    GovahiApp.ui.disableSendButton();
                } else {
                    GovahiApp.ui.setExtractEnabled(true);
                    if (GovahiApp.isRegionAuthorized !== undefined) {
                        if (GovahiApp.isRegionAuthorized) {
                            GovahiApp.ui.enableSendButton();
                            GovahiApp.ui.hideManualInput();
                        } else {
                            GovahiApp.ui.disableSendButton();
                            GovahiApp.ui.showManualInput();
                            GovahiApp.ui.setAssignEnabled(true);
                        }
                    } else {
                        GovahiApp.ui.disableSendButton();
                        GovahiApp.ui.hideManualInput();
                    }
                }
            }

            var observer = new MutationObserver(function() {
                updateButtonStates();
            });
            observer.observe(document.body, { childList: true, subtree: true });

            // ---------- رویداد استخراج (شناسایی) ----------
            GovahiApp.ui.onExtract(function() {
                if (!isOnListPage()) {
                    GovahiApp.ui.setStatus('⚠️ این عملیات فقط در صفحهٔ لیست فارغ‌التحصیلان قابل انجام است.');
                    return;
                }

                // پاک‌سازی کامل قبل از استخراج جدید
                clearAllPreviousData();

                // تزریق استایل چاپ
                if (!document.getElementById('govahi-print-style')) {
                    var printStyle = document.createElement('style');
                    printStyle.id = 'govahi-print-style';
                    printStyle.innerHTML = `
                        @media print {
                            @page {
                                size: auto !important;
                                margin: 0 !important;
                            }
                        }
                        print-preview-layout-settings,
                        print-preview-more-settings {
                            display: block !important;
                            visibility: visible !important;
                        }
                    `;
                    document.head.appendChild(printStyle);
                    console.log('✅ تنظیمات چاپ برای حذف حاشیه‌ها اعمال شد.');
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
                    GovahiApp.ui.setAssignEnabled(true);
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

                // قبل از اختصاص محلی، داده‌های قبلی را پاک می‌کنیم
                clearAllPreviousData();

                // دوباره استخراج می‌کنیم (تا داده‌های خام اولیه را داشته باشیم)
                var header = GovahiApp.extractor.extractHeader();
                var students = GovahiApp.extractor.extractStudents();
                window.extractedData = { header: header, students: students };

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

            // ---------- ارسال به API ----------
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

                // پاک‌سازی کامل قبل از ارسال (تا داده‌های قدیمی تداخل نکنند)
                clearAllPreviousData();

                // دوباره استخراج می‌کنیم (چون clear داده‌ها را null کرده بود)
                var header = GovahiApp.extractor.extractHeader();
                var students = GovahiApp.extractor.extractStudents();
                window.extractedData = { header: header, students: students };

                GovahiApp.apiHandler.send(window.extractedData);
            });

            updateButtonStates();

            console.log('GovahiApp ready. (با پاک‌سازی خودکار قبل از عملیات)');
            return;
        }

        loadScript(modules[index], function() {
            loadModulesSequentially(index + 1);
        });
    }

    loadModulesSequentially(0);
})();
