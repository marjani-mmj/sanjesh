/**
 * ==========================================================
 * modules/certificate-filler.js
 * دکمهٔ «پر کردن گواهینامه‌ها» در پنل – دریافت از API یا تخصیص محلی
 * ==========================================================
 */
(function () {
    'use strict';

    window.GovahiApp = window.GovahiApp || {};

    // ========== ابزارها ==========
    function extractNationalCode(card) {
        var labels = card.querySelectorAll(".textt label");
        for (var i = 0; i < labels.length; i++) {
            if (labels[i].textContent.includes("کد ملی")) {
                var span = labels[i].nextElementSibling;
                if (span) {
                    return span.textContent.trim();
                }
            }
        }
        return null;
    }

    function getCacheKey(code) {
        return 'gavahiname_' + code;
    }

    function getFromCache(code) {
        var raw = localStorage.getItem(getCacheKey(code));
        if (raw) {
            try { return JSON.parse(raw); } catch (e) { /* */ }
        }
        return null;
    }

    function saveToCache(code, number, date) {
        localStorage.setItem(getCacheKey(code), JSON.stringify({ number: number, date: date }));
    }

    // ========== درخواست به API ==========
    function fetchCertificateInfo(nationalCode) {
        var baseUrl = (GovahiApp.config && GovahiApp.config.apiUrl) || '';
        if (!baseUrl) return Promise.reject(new Error('آدرس API تنظیم نشده است.'));

        var url = baseUrl + '?national_code=' + encodeURIComponent(nationalCode);
        var token = (GovahiApp.config && GovahiApp.config.apiToken) || '';

        return fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        .then(function (response) {
            if (!response.ok) throw new Error('HTTP ' + response.status);
            return response.json();
        })
        .then(function (data) {
            if (data.found) {
                return {
                    number: data.شماره_گواهینامه,
                    date: data.تاریخ_صدور
                };
            } else {
                throw new Error('گواهینامه یافت نشد.');
            }
        });
    }

    // ========== عملیات اصلی ==========
    GovahiApp.fillCertificates = function () {
        var cards = document.querySelectorAll("#print-content .col-md-6");
        if (cards.length === 0) {
            GovahiApp.ui.setStatus('❌ به صفحهٔ گواهینامه مراجعه نمایید.');
            return;
        }

        // مسیر API
        if (GovahiApp.isRegionAuthorized) {
            GovahiApp.ui.setStatus('⏳ در حال دریافت اطلاعات از API...');
            var count = 0, cached = 0, fetched = 0, errors = 0;
            var promises = [];

            cards.forEach(function (card) {
                var nationalCode = extractNationalCode(card);
                if (!nationalCode) {
                    console.warn('کارت: کد ملی پیدا نشد.');
                    errors++;
                    return;
                }

                var promise = Promise.resolve().then(function () {
                    var cachedData = getFromCache(nationalCode);
                    if (cachedData) {
                        cached++;
                        return cachedData;
                    }
                    return fetchCertificateInfo(nationalCode).then(function (info) {
                        fetched++;
                        saveToCache(nationalCode, info.number, info.date);
                        return info;
                    });
                })
                .then(function (info) {
                    var numberInput = card.querySelector('#number');
                    var dateInput = card.querySelector('#StatrtDate');
                    if (numberInput) {
                        numberInput.value = info.number;
                        numberInput.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    if (dateInput) {
                        dateInput.value = info.date;
                        dateInput.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    count++;
                })
                .catch(function (err) {
                    console.error('❌ کد ملی ' + nationalCode + ': ' + err.message);
                    errors++;
                });

                promises.push(promise);
            });

            Promise.all(promises).then(function () {
                var msg = '✅ ' + count + ' کارت بروزرسانی شد.';
                if (cached) msg += '\n💾 ' + cached + ' از کش.';
                if (fetched) msg += '\n☁️ ' + fetched + ' از API.';
                if (errors) msg += '\n❌ ' + errors + ' خطا.';
                GovahiApp.ui.setStatus(msg);
                if (count > 0) alert(msg);
            });

        } else {
            // مسیر محلی (منطقه غیرمجاز)
            var countLocal = 0, errorsLocal = 0;
            cards.forEach(function (card) {
                var nationalCode = extractNationalCode(card);
                if (!nationalCode) {
                    console.warn('کارت: کد ملی پیدا نشد.');
                    errorsLocal++;
                    return;
                }
                var info = GovahiApp.localAssigner.getCertificate(nationalCode);
                if (!info) {
                    console.warn('گواهینامه برای کد ملی ' + nationalCode + ' اختصاص نیافته.');
                    errorsLocal++;
                    return;
                }
                var numberInput = card.querySelector('#number');
                var dateInput = card.querySelector('#StatrtDate');
                if (numberInput) {
                    numberInput.value = info.number;
                    numberInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
                if (dateInput) {
                    dateInput.value = info.date;
                    dateInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
                countLocal++;
            });

            var msg = '✅ ' + countLocal + ' کارت با اطلاعات محلی پر شد.';
            if (errorsLocal) msg += '\n⚠️ ' + errorsLocal + ' کد ملی فاقد گواهینامه. لطفاً ابتدا در لیست، شماره‌ها را اختصاص دهید.';
            GovahiApp.ui.setStatus(msg);
            if (countLocal > 0) alert(msg);
        }
    };

    // ========== افزودن دکمه به پنل ==========
    function addButtonToPanel() {
        var checkInterval = setInterval(function () {
            var panel = document.getElementById('govahi-panel');
            if (panel) {
                clearInterval(checkInterval);
                if (document.getElementById('govahi-fill-btn')) return;

                var actionSection = panel.querySelector('.panel-body');
                if (!actionSection) return;

                var btn = document.createElement('button');
                btn.id = 'govahi-fill-btn';
                btn.className = 'action-btn';
                btn.textContent = '🔢 پر کردن گواهینامه‌ها';
                btn.title = 'دریافت/تخصیص شماره گواهینامه و تاریخ';
                btn.style.backgroundColor = '#10b981';

                btn.addEventListener('click', function () {
                    GovahiApp.fillCertificates();
                });

                var actionRow = document.getElementById('govahi-action-row');
                if (actionRow) {
                    actionRow.parentNode.insertBefore(btn, actionRow.nextSibling);
                } else {
                    actionSection.appendChild(btn);
                }

                console.log('✅ دکمهٔ پر کردن گواهینامه‌ها به پنل اضافه شد.');
            }
        }, 300);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addButtonToPanel);
    } else {
        addButtonToPanel();
    }
})();/**
 * ==========================================================
 * modules/certificate-filler.js
 * دکمهٔ «پر کردن گواهینامه‌ها» در پنل – دریافت از API یا تخصیص محلی
 * ==========================================================
 */
(function () {
    'use strict';

    window.GovahiApp = window.GovahiApp || {};

    // ========== ابزارها ==========
    function extractNationalCode(card) {
        var labels = card.querySelectorAll(".textt label");
        for (var i = 0; i < labels.length; i++) {
            if (labels[i].textContent.includes("کد ملی")) {
                var span = labels[i].nextElementSibling;
                if (span) {
                    return span.textContent.trim();
                }
            }
        }
        return null;
    }

    function getCacheKey(code) {
        return 'gavahiname_' + code;
    }

    function getFromCache(code) {
        var raw = localStorage.getItem(getCacheKey(code));
        if (raw) {
            try { return JSON.parse(raw); } catch (e) { /* */ }
        }
        return null;
    }

    function saveToCache(code, number, date) {
        localStorage.setItem(getCacheKey(code), JSON.stringify({ number: number, date: date }));
    }

    // ========== درخواست به API ==========
    function fetchCertificateInfo(nationalCode) {
        var baseUrl = (GovahiApp.config && GovahiApp.config.apiUrl) || '';
        if (!baseUrl) return Promise.reject(new Error('آدرس API تنظیم نشده است.'));

        var url = baseUrl + '?national_code=' + encodeURIComponent(nationalCode);
        var token = (GovahiApp.config && GovahiApp.config.apiToken) || '';

        return fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        .then(function (response) {
            if (!response.ok) throw new Error('HTTP ' + response.status);
            return response.json();
        })
        .then(function (data) {
            if (data.found) {
                return {
                    number: data.شماره_گواهینامه,
                    date: data.تاریخ_صدور
                };
            } else {
                throw new Error('گواهینامه یافت نشد.');
            }
        });
    }

    // ========== عملیات اصلی ==========
    GovahiApp.fillCertificates = function () {
        var cards = document.querySelectorAll("#print-content .col-md-6");
        if (cards.length === 0) {
            GovahiApp.ui.setStatus('❌ به صفحهٔ گواهینامه مراجعه نمایید.');
            return;
        }

        // مسیر API
        if (GovahiApp.isRegionAuthorized) {
            GovahiApp.ui.setStatus('⏳ در حال دریافت اطلاعات از API...');
            var count = 0, cached = 0, fetched = 0, errors = 0;
            var promises = [];

            cards.forEach(function (card) {
                var nationalCode = extractNationalCode(card);
                if (!nationalCode) {
                    console.warn('کارت: کد ملی پیدا نشد.');
                    errors++;
                    return;
                }

                var promise = Promise.resolve().then(function () {
                    var cachedData = getFromCache(nationalCode);
                    if (cachedData) {
                        cached++;
                        return cachedData;
                    }
                    return fetchCertificateInfo(nationalCode).then(function (info) {
                        fetched++;
                        saveToCache(nationalCode, info.number, info.date);
                        return info;
                    });
                })
                .then(function (info) {
                    var numberInput = card.querySelector('#number');
                    var dateInput = card.querySelector('#StatrtDate');
                    if (numberInput) {
                        numberInput.value = info.number;
                        numberInput.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    if (dateInput) {
                        dateInput.value = info.date;
                        dateInput.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    count++;
                })
                .catch(function (err) {
                    console.error('❌ کد ملی ' + nationalCode + ': ' + err.message);
                    errors++;
                });

                promises.push(promise);
            });

            Promise.all(promises).then(function () {
                var msg = '✅ ' + count + ' کارت بروزرسانی شد.';
                if (cached) msg += '\n💾 ' + cached + ' از کش.';
                if (fetched) msg += '\n☁️ ' + fetched + ' از API.';
                if (errors) msg += '\n❌ ' + errors + ' خطا.';
                GovahiApp.ui.setStatus(msg);
                if (count > 0) alert(msg);
            });

        } else {
            // مسیر محلی (منطقه غیرمجاز)
            var countLocal = 0, errorsLocal = 0;
            cards.forEach(function (card) {
                var nationalCode = extractNationalCode(card);
                if (!nationalCode) {
                    console.warn('کارت: کد ملی پیدا نشد.');
                    errorsLocal++;
                    return;
                }
                var info = GovahiApp.localAssigner.getCertificate(nationalCode);
                if (!info) {
                    console.warn('گواهینامه برای کد ملی ' + nationalCode + ' اختصاص نیافته.');
                    errorsLocal++;
                    return;
                }
                var numberInput = card.querySelector('#number');
                var dateInput = card.querySelector('#StatrtDate');
                if (numberInput) {
                    numberInput.value = info.number;
                    numberInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
                if (dateInput) {
                    dateInput.value = info.date;
                    dateInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
                countLocal++;
            });

            var msg = '✅ ' + countLocal + ' کارت با اطلاعات محلی پر شد.';
            if (errorsLocal) msg += '\n⚠️ ' + errorsLocal + ' کد ملی فاقد گواهینامه. لطفاً ابتدا در لیست، شماره‌ها را اختصاص دهید.';
            GovahiApp.ui.setStatus(msg);
            if (countLocal > 0) alert(msg);
        }
    };

    // ========== افزودن دکمه به پنل ==========
    function addButtonToPanel() {
        var checkInterval = setInterval(function () {
            var panel = document.getElementById('govahi-panel');
            if (panel) {
                clearInterval(checkInterval);
                if (document.getElementById('govahi-fill-btn')) return;

                var actionSection = panel.querySelector('.panel-body');
                if (!actionSection) return;

                var btn = document.createElement('button');
                btn.id = 'govahi-fill-btn';
                btn.className = 'action-btn';
                btn.textContent = '🔢 پر کردن گواهینامه‌ها';
                btn.title = 'دریافت/تخصیص شماره گواهینامه و تاریخ';
                btn.style.backgroundColor = '#10b981';

                btn.addEventListener('click', function () {
                    GovahiApp.fillCertificates();
                });

                var actionRow = document.getElementById('govahi-action-row');
                if (actionRow) {
                    actionRow.parentNode.insertBefore(btn, actionRow.nextSibling);
                } else {
                    actionSection.appendChild(btn);
                }

                console.log('✅ دکمهٔ پر کردن گواهینامه‌ها به پنل اضافه شد.');
            }
        }, 300);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addButtonToPanel);
    } else {
        addButtonToPanel();
    }
})();
