/**
 * ==========================================================
 * modules/certificate-filler.js
 * دکمهٔ «پر کردن گواهینامه‌ها» در پنل – اولویت با حافظهٔ استخراج‌شده
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

    // ========== عملیات اصلی (اولویت با حافظهٔ extractedData) ==========
    GovahiApp.fillCertificates = function () {
        var cards = document.querySelectorAll("#print-content .col-md-6");
        if (cards.length === 0) {
            GovahiApp.ui.setStatus('❌ به صفحهٔ گواهینامه مراجعه نمایید.');
            return;
        }

        GovahiApp.ui.setStatus('⏳ در حال بارگذاری اطلاعات گواهینامه‌ها...');
        var count = 0, fromMemory = 0, fromApi = 0, errors = 0;

        // 1. اولویت مطلق: جستجو در extractedData (حافظهٔ جلسه)
        cards.forEach(function (card) {
            var nationalCode = extractNationalCode(card);
            if (!nationalCode) {
                errors++;
                return;
            }

            // آیا این کد ملی در extractedData وجود دارد و شماره گواهینامه دارد؟
            var student = null;
            if (window.extractedData && window.extractedData.students) {
                student = window.extractedData.students.find(function (s) {
                    return s.کد_ملی === nationalCode;
                });
            }

            if (student && student.شماره_گواهینامه) {
                // پر کردن از حافظه
                var numberInput = card.querySelector('#number');
                var dateInput = card.querySelector('#StatrtDate');
                if (numberInput) {
                    numberInput.value = student.شماره_گواهینامه;
                    numberInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
                if (dateInput) {
                    dateInput.value = student.تاریخ_صدور || '';
                    dateInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
                fromMemory++;
                count++;
            } else {
                // موجود در حافظه نیست – خطا محسوب می‌شود
                console.warn('کد ملی ' + nationalCode + ' در حافظهٔ جلسه یافت نشد یا شماره ندارد.');
                errors++;
            }
        });

        // گزارش نهایی
        var msg = '✅ ' + count + ' کارت با اطلاعات حافظه پر شد.';
        if (errors) msg += '\n❌ ' + errors + ' کد ملی فاقد اطلاعات (ابتدا شناسایی/ارسال/اختصاص را انجام دهید).';
        GovahiApp.ui.setStatus(msg);
        if (count > 0) alert(msg);
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
                btn.title = 'پر کردن کارت‌ها با اطلاعات ذخیره‌شده در حافظه';
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
