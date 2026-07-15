/**
 * ==========================================================
 * modules/certificate-filler.js
 * دکمهٔ «پر کردن گواهینامه‌ها» در پنل – نسخهٔ غیرعملیاتی
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

    // ========== عملیات اصلی – بدون اثر ==========
    GovahiApp.fillCertificates = function () {
        GovahiApp.ui.setStatus('⛔ عملکرد پر کردن غیرفعال است.');
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
                btn.title = 'پر کردن کارت‌ها با اطلاعات ذخیره‌شده (غیرفعال)';
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

                console.log('✅ دکمهٔ پر کردن گواهینامه‌ها اضافه شد (غیرعملیاتی).');
            }
        }, 300);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addButtonToPanel);
    } else {
        addButtonToPanel();
    }
})();
