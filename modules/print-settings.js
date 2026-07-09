// C:\Users\manager\Desktop\sida cod\govahiM1\modules\print-settings.js
(function() {
    'use strict';
    window.GovahiApp = window.GovahiApp || {};

    // ========== State ==========
    var settings = {
        offsetX: 0,        // حاشیهٔ صحافی راست (پیکسل)
        offsetY: 0,        // جابه‌جایی عمودی (پیکسل)
        scale: 1,          // بزرگنمایی (۱ = ۱۰۰٪)
        widthOffset: 0     // افزایش/کاهش عرض بر حسب پیکسل
    };

    var baseWidth = null;   // عرض اولیه المان چاپ (ذخیره می‌شود)

    // ========== اعمال تنظیمات ==========
    function apply() {
        var target = document.getElementById('print-content');
        if (!target || !document.body.contains(target)) return;

        // ۱. ذخیره عرض اولیه اگر هنوز ذخیره نشده باشد (فقط یک‌بار)
        if (baseWidth === null) {
            baseWidth = target.getBoundingClientRect().width;
        }

        // ۲. رفع محدودیت‌های ارتفاع و overflow
        target.style.setProperty('max-height', 'none', 'important');
        target.style.setProperty('overflow', 'visible', 'important');
        target.style.setProperty('margin', '0', 'important');
        target.style.setProperty('padding', '0', 'important');

        // ۳. اعمال عرض جدید بر حسب پیکسل
        var newWidth = baseWidth + settings.widthOffset;
        target.style.setProperty('width', newWidth + 'px', 'important');

        // ۴. اعمال transform (جابه‌جایی + بزرگنمایی)
        var transformValue = 'translate(' + (-settings.offsetX) + 'px, ' + settings.offsetY + 'px) scale(' + settings.scale + ')';
        target.style.setProperty('transform', transformValue, 'important');
        target.style.setProperty('transform-origin', 'top right', 'important');

        // ۵. اطمینان از نمایش صحیح دکمهٔ چاپ
        var modalContent = target.closest('.modal-content');
        if (modalContent) {
            var footer = modalContent.querySelector('.modal-footer');
            if (footer) {
                footer.style.position = 'relative';
                footer.style.zIndex = '10';
                footer.style.backgroundColor = '#fff';
                footer.style.boxShadow = '0 -2px 5px rgba(0,0,0,0.05)';
            }
        }

        updateDisplay();
    }

    function updateDisplay() {
        var ox = document.getElementById('govahi-offsetX-val');
        var oy = document.getElementById('govahi-offsetY-val-top');
        var sc = document.getElementById('govahi-scale-val');
        var wd = document.getElementById('govahi-width-val');

        if (ox) ox.textContent = settings.offsetX;
        if (oy) oy.textContent = settings.offsetY;
        if (sc) sc.textContent = Math.round(settings.scale * 100) + '%';
        if (wd) wd.textContent = settings.widthOffset;   // عدد به پیکسل
    }

    function refresh() {
        requestAnimationFrame(apply);
    }

    function reset() {
        settings.offsetX = 0;
        settings.offsetY = 0;
        settings.scale = 1;
        settings.widthOffset = 0;
        baseWidth = null;          // با ریست، عرض اولیه دوباره محاسبه می‌شود
        refresh();
    }

    // ========== اتصال دکمه‌ها ==========
    function bindControls() {
        // ---- بالا ----
        document.getElementById('govahi-offsetY-up-dec5')?.addEventListener('click', function() { settings.offsetY -= 5; refresh(); });
        document.getElementById('govahi-offsetY-up-dec')?.addEventListener('click', function() { settings.offsetY -= 1; refresh(); });
        document.getElementById('govahi-offsetY-up-inc')?.addEventListener('click', function() { settings.offsetY += 1; refresh(); });
        document.getElementById('govahi-offsetY-up-inc5')?.addEventListener('click', function() { settings.offsetY += 5; refresh(); });

        // ---- راست ----
        document.getElementById('govahi-offsetX-right-dec5')?.addEventListener('click', function() { settings.offsetX -= 5; refresh(); });
        document.getElementById('govahi-offsetX-right-dec')?.addEventListener('click', function() { settings.offsetX -= 1; refresh(); });
        document.getElementById('govahi-offsetX-right-inc')?.addEventListener('click', function() { settings.offsetX += 1; refresh(); });
        document.getElementById('govahi-offsetX-right-inc5')?.addEventListener('click', function() { settings.offsetX += 5; refresh(); });

        // ---- پهنا (حالا بر حسب پیکسل) ----
        document.getElementById('govahi-width-dec5')?.addEventListener('click', function() { settings.widthOffset -= 5; refresh(); });
        document.getElementById('govahi-width-dec')?.addEventListener('click', function() { settings.widthOffset -= 1; refresh(); });
        document.getElementById('govahi-width-inc')?.addEventListener('click', function() { settings.widthOffset += 1; refresh(); });
        document.getElementById('govahi-width-inc5')?.addEventListener('click', function() { settings.widthOffset += 5; refresh(); });

        // ---- بزرگنمایی ----
        document.getElementById('govahi-scale-out5')?.addEventListener('click', function() { settings.scale = Math.max(0.5, settings.scale - 0.05); refresh(); });
        document.getElementById('govahi-scale-out')?.addEventListener('click', function() { settings.scale = Math.max(0.5, settings.scale - 0.01); refresh(); });
        document.getElementById('govahi-scale-in')?.addEventListener('click', function() { settings.scale = Math.min(2, settings.scale + 0.01); refresh(); });
        document.getElementById('govahi-scale-in5')?.addEventListener('click', function() { settings.scale = Math.min(2, settings.scale + 0.05); refresh(); });

        // ---- تنظیم مجدد ----
        document.getElementById('govahi-reset-settings-btn')?.addEventListener('click', reset);

        updateDisplay();
    }

    // ========== API عمومی ==========
    GovahiApp.printSettings = {
        apply: apply,
        reset: reset,
        bindControls: bindControls,
        getSettings: function() { return Object.assign({}, settings); }
    };

    console.log('✅ print-settings module loaded. (width in pixels, footer z-index)');
})();
