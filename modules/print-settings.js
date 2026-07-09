// C:\Users\manager\Desktop\sida cod\govahiM1\modules\print-settings.js
(function() {
    'use strict';
    window.GovahiApp = window.GovahiApp || {};

    // ----- state -----
    var spacing = {
        top: 0,
        bottom: 0,
        right: 0,
        width: 0,
        scale: 100
    };

    // ----- اعمال تنظیمات روی المان چاپ -----
    function applySettings() {
        var target = document.getElementById('print-content');
        if (!target) {
            console.warn('print-settings: #print-content یافت نشد.');
            return;
        }

        target.style.setProperty('max-height', 'none', 'important');
        target.style.setProperty('overflow', 'visible', 'important');
        target.style.setProperty('margin-top', spacing.top + 'px', 'important');
        target.style.setProperty('margin-bottom', spacing.bottom + 'px', 'important');
        target.style.setProperty('margin-right', spacing.right + 'px', 'important');

        if (spacing.width !== 0) {
            target.style.setProperty('width', (100 + spacing.width) + '%', 'important');
        } else {
            target.style.setProperty('width', '100%', 'important');
        }

        var scaleValue = spacing.scale / 100;
        target.style.setProperty('transform', 'scale(' + scaleValue + ')', 'important');
        target.style.setProperty('transform-origin', 'top center', 'important');
    }

    // ----- به‌روزرسانی نمایشگرهای عددی در پنل -----
    function updateDisplay() {
        var mt = document.getElementById('govahi-marginTopVal');
        var mb = document.getElementById('govahi-marginBottomVal');
        var mr = document.getElementById('govahi-marginRightVal');
        var mw = document.getElementById('govahi-widthVal');
        var zm = document.getElementById('govahi-zoomVal');
        if (mt) mt.textContent = spacing.top;
        if (mb) mb.textContent = spacing.bottom;
        if (mr) mr.textContent = spacing.right;
        if (mw) mw.textContent = spacing.width;
        if (zm) zm.textContent = spacing.scale + '%';
    }

    // ----- توابع کمکی برای اتصال دکمه‌ها -----
    function bindControls() {
        // بالا
        document.getElementById('govahi-marginTopInc')?.addEventListener('click', function() { spacing.top++; updateDisplay(); });
        document.getElementById('govahi-marginTopDec')?.addEventListener('click', function() { spacing.top--; updateDisplay(); });
        document.getElementById('govahi-marginTopInc5')?.addEventListener('click', function() { spacing.top += 5; updateDisplay(); });
        document.getElementById('govahi-marginTopDec5')?.addEventListener('click', function() { spacing.top -= 5; updateDisplay(); });

        // پایین
        document.getElementById('govahi-marginBottomInc')?.addEventListener('click', function() { spacing.bottom++; updateDisplay(); });
        document.getElementById('govahi-marginBottomDec')?.addEventListener('click', function() { spacing.bottom--; updateDisplay(); });
        document.getElementById('govahi-marginBottomInc5')?.addEventListener('click', function() { spacing.bottom += 5; updateDisplay(); });
        document.getElementById('govahi-marginBottomDec5')?.addEventListener('click', function() { spacing.bottom -= 5; updateDisplay(); });

        // راست
        document.getElementById('govahi-marginRightInc')?.addEventListener('click', function() { spacing.right++; updateDisplay(); });
        document.getElementById('govahi-marginRightDec')?.addEventListener('click', function() { spacing.right--; updateDisplay(); });
        document.getElementById('govahi-marginRightInc5')?.addEventListener('click', function() { spacing.right += 5; updateDisplay(); });
        document.getElementById('govahi-marginRightDec5')?.addEventListener('click', function() { spacing.right -= 5; updateDisplay(); });

        // پهنا
        document.getElementById('govahi-widthInc')?.addEventListener('click', function() { spacing.width++; updateDisplay(); });
        document.getElementById('govahi-widthDec')?.addEventListener('click', function() { spacing.width--; updateDisplay(); });
        document.getElementById('govahi-widthInc5')?.addEventListener('click', function() { spacing.width += 5; updateDisplay(); });
        document.getElementById('govahi-widthDec5')?.addEventListener('click', function() { spacing.width -= 5; updateDisplay(); });

        // بزرگنمایی
        document.getElementById('govahi-zoomInc')?.addEventListener('click', function() { spacing.scale = Math.min(200, spacing.scale + 1); updateDisplay(); });
        document.getElementById('govahi-zoomDec')?.addEventListener('click', function() { spacing.scale = Math.max(10, spacing.scale - 1); updateDisplay(); });
        document.getElementById('govahi-zoomInc5')?.addEventListener('click', function() { spacing.scale = Math.min(200, spacing.scale + 5); updateDisplay(); });
        document.getElementById('govahi-zoomDec5')?.addEventListener('click', function() { spacing.scale = Math.max(10, spacing.scale - 5); updateDisplay(); });

        // دکمه اعمال تنظیمات
        document.getElementById('govahi-applySettingsBtn')?.addEventListener('click', applySettings);

        // مقداردهی اولیه نمایشگرها
        updateDisplay();
    }

    // ----- API عمومی -----
    GovahiApp.printSettings = {
        spacing: spacing,
        applySettings: applySettings,
        updateDisplay: updateDisplay,
        bindControls: bindControls   // در ui-panel.js صدا زده می‌شود
    };

    console.log('print-settings module loaded.');
})();
