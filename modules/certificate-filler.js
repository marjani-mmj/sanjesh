(function() {
    'use strict';
    window.GovahiApp = window.GovahiApp || {};

    // فقط در صفحه‌ای که کارت‌های گواهینامه دارد فعال می‌شود
    function init() {
        var certCards = document.querySelectorAll('[ng-repeat="item in items"]');
        if (!certCards.length) return; // صفحه مورد نظر نیست

        // ایجاد دکمه شناور
        var btn = document.createElement('button');
        btn.id = 'auto-fill-cert-btn';
        btn.textContent = '📝 تکمیل خودکار';
        btn.style.cssText = 'position:fixed; bottom:100px; right:30px; z-index:99999; padding:10px 18px; background:#28a745; color:white; border:none; border-radius:8px; font-size:14px; cursor:pointer; box-shadow:0 4px 10px rgba(0,0,0,0.3);';
        document.body.appendChild(btn);

        btn.addEventListener('click', function() {
            fillAllCertificates();
        });

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
            // استخراج کد ملی از داخل کارت (قسمتی که «کد ملی:» دارد)
            var spans = card.querySelectorAll('span.ng-binding');
            var nationalCode = '';
            for (var j = 0; j < spans.length; j++) {
                if (spans[j].textContent.indexOf('کد ملی') > -1) {
                    // اسپن بعدی حاوی کد ملی است
                    var nextSpan = spans[j].nextElementSibling;
                    if (nextSpan && nextSpan.tagName === 'SPAN') {
                        nationalCode = nextSpan.textContent.trim();
                        break;
                    }
                }
            }
            if (!nationalCode) {
                console.warn('کد ملی در کارت ' + (i+1) + ' پیدا نشد.');
                continue;
            }

            // دریافت فیلدهای ورودی
            var dateInput = card.querySelector('input#StatrtDate');
            var numInput = card.querySelector('input#number');
            if (!dateInput || !numInput) {
                console.warn('فیلدهای تاریخ/شماره در کارت ' + (i+1) + ' وجود ندارد.');
                continue;
            }

            // ۱. ابتدا شیء حافظه را چک کن
            if (window.extractedData && window.extractedData.students) {
                var student = window.extractedData.students.find(function(s) {
                    return s.کد_ملی === nationalCode;
                });
                if (student && student.شماره_گواهینامه && student.تاریخ_صدور) {
                    setInputValue(dateInput, student.تاریخ_صدور);
                    setInputValue(numInput, student.شماره_گواهینامه);
                    continue; // رفتن به کارت بعدی
                }
            }

            // ۲. در غیر این صورت از API بخوان
            try {
                var response = await fetch(apiBase + '?national_code=' + encodeURIComponent(nationalCode), {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
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

    function setInputValue(input, value) {
        // باید AngularJS را از تغییر مطلع کنیم
        var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(input, value);
        var event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
    }

    // شروع
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();
