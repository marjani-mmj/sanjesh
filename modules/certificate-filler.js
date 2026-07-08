(function() {
    'use strict';
    window.GovahiApp = window.GovahiApp || {};

    function init() {
        if (!document.querySelector('[ng-repeat="item in items"]')) return;

        var btn = document.createElement('button');
        btn.id = 'auto-fill-cert-btn';
        btn.textContent = '📝 تکمیل خودکار';
        btn.style.cssText = 'position:fixed; bottom:100px; right:30px; z-index:99999; padding:10px 18px; background:#28a745; color:white; border:none; border-radius:8px; font-size:14px; cursor:pointer; box-shadow:0 4px 10px rgba(0,0,0,0.3);';
        document.body.appendChild(btn);

        btn.addEventListener('click', fillAllCertificates);
        console.log('ماژول تکمیل گواهینامه آماده است.');
    }

    async function fillAllCertificates() {
        var cards = document.querySelectorAll('[ng-repeat="item in items"]');
        var apiBase = GovahiApp.config && GovahiApp.config.apiUrl ? GovahiApp.config.apiUrl : '';
        var token = GovahiApp.config && GovahiApp.config.apiToken ? GovahiApp.config.apiToken : '';

        if (!apiBase || !token) {
            alert('تنظیمات API در دسترس نیست.');
            return;
        }

        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];

            // استخراج کد ملی
            var nationalCode = extractNationalCode(card);
            if (!nationalCode) {
                console.warn('کد ملی در کارت ' + (i + 1) + ' پیدا نشد.');
                continue;
            }

            // یافتن فیلدها
            var dateInput = card.querySelector('[ng-model="model.statrtDate"]');
            var numInput = card.querySelector('[ng-model="item.number"]');
            if (!dateInput || !numInput) {
                console.warn('فیلدهای تاریخ/شماره در کارت ' + (i + 1) + ' وجود ندارد.');
                continue;
            }

            // ۱. جستجو در حافظه
            if (window.extractedData && window.extractedData.students) {
                var student = window.extractedData.students.find(function(s) {
                    return s.کد_ملی === nationalCode;
                });
                if (student && student.شماره_گواهینامه && student.تاریخ_صدور) {
                    setInputValue(dateInput, student.تاریخ_صدور);
                    setInputValue(numInput, student.شماره_گواهینامه);
                    continue;
                }
            }

            // ۲. درخواست به API
            try {
                var response = await fetch(apiBase + '?national_code=' + encodeURIComponent(nationalCode), {
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                if (response.ok) {
                    var data = await response.json();
                    if (data.found) {
                        setInputValue(dateInput, data.تاریخ_صدور);
                        setInputValue(numInput, data.شماره_گواهینامه);
                    } else {
                        console.log('گواهینامه‌ای با کد ملی ' + nationalCode + ' یافت نشد.');
                    }
                } else {
                    console.error('خطای API:', response.status);
                }
            } catch (err) {
                console.error('خطا در فراخوانی API:', err);
            }
        }
    }

    function extractNationalCode(card) {
        // روش ۱: جستجوی span با کلاس ng-binding که شامل "کد ملی" باشد و span بعدی با کلاس control-label
        var elements = card.querySelectorAll('.ng-binding');
        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            if (el.textContent.includes('کد ملی')) {
                var next = el.nextElementSibling;
                while (next) {
                    if (next.tagName === 'SPAN' && next.classList.contains('control-label')) {
                        var code = next.textContent.trim();
                        if (/^\d{10}$/.test(code)) return code;
                    }
                    next = next.nextElementSibling;
                }
            }
        }
        // روش ۲: regex روی کل متن کارت
        var text = card.textContent;
        var match = text.match(/کد ملی\s*:\s*(\d{10})/);
        if (match) return match[1];
        return null;
    }

    function setInputValue(input, value) {
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        // اطمینان از به‌روزرسانی AngularJS
        if (window.angular && typeof angular !== 'undefined') {
            var el = angular.element(input);
            el.triggerHandler('input');
            var scope = el.scope();
            if (scope) {
                scope.$apply();
            }
        }
    }

    if (document.readyState === 'complete') init();
    else window.addEventListener('load', init);
})();
