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

            // استخراج کد ملی با regex روی کل متن کارت
            var nationalCode = extractNationalCode(card);
            if (!nationalCode) {
                console.warn('کد ملی در کارت ' + (i + 1) + ' پیدا نشد.');
                continue;
            }

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
        // جستجوی "کد ملی:" و عدد ۱۰ رقمی بلافاصله بعد از آن
        var match = card.textContent.match(/کد ملی\s*:\s*(\d{10})/);
        return match ? match[1] : null;
    }

    function setInputValue(input, value) {
        // تنظیم مقدار به صورت مستقیم
        input.value = value;
        // اطلاع‌رسانی به AngularJS
        var event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
        // اگر AngularJS در دسترس است، scope را به‌روز کن
        if (window.angular && typeof angular !== 'undefined') {
            var ngElem = angular.element(input);
            ngElem.triggerHandler('input');
            // تلاش برای اجرای $apply
            try {
                var scope = ngElem.scope();
                if (scope && !scope.$$phase) {
                    scope.$apply();
                }
            } catch (e) {}
        }
    }

    if (document.readyState === 'complete') init();
    else window.addEventListener('load', init);
})();
