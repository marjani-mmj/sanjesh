// C:\Users\manager\Desktop\sida cod\govahiM1\modules\print-settings.js
(function() {
    'use strict';
    window.GovahiApp = window.GovahiApp || {};

    // ========== State ==========
    var settings = {
        offsetX: 0,   // جابه‌جایی افقی (منفی = فضای صحافی راست)
        offsetY: 0,   // جابه‌جایی عمودی (مثبت = پایین)
        scale: 1,     // بزرگنمایی
        widthOffset: 0 // درصد تغییر عرض (0 = 100% اولیه)
    };

    // ========== اعمال تنظیمات ==========
    function apply() {
        var target = document.getElementById('print-content');
        if (!target || !document.body.contains(target)) return;

        // حذف محدودیت‌های ارتفاع و overflow
        target.style.setProperty('max-height', 'none', 'important');
        target.style.setProperty('overflow', 'visible', 'important');

        // صفر کردن margin و padding
        target.style.setProperty('margin', '0', 'important');
        target.style.setProperty('padding', '0', 'important');

        // عرض (پهنا)
        if (settings.widthOffset === 0) {
            target.style.setProperty('width', '100%', 'important');
        } else {
            target.style.setProperty('width', (100 + settings.widthOffset) + '%', 'important');
        }

        // transform ترکیبی
        var transformValue = 'translate(' + settings.offsetX + 'px, ' + settings.offsetY + 'px) scale(' + settings.scale + ')';
        target.style.setProperty('transform', transformValue, 'important');
        target.style.setProperty('transform-origin', 'top right', 'important');

        updateDisplay();
    }

    function updateDisplay() {
        var ox = document.getElementById('govahi-offsetX-val');
        var oy = document.getElementById('govahi-offsetY-val');
        var sc = document.getElementById('govahi-scale-val');
        var wd = document.getElementById('govahi-width-val');
        if (ox) ox.textContent = settings.offsetX;
        if (oy) oy.textContent = settings.offsetY;
        if (sc) sc.textContent = Math.round(settings.scale * 100) + '%';
        if (wd) wd.textContent = settings.widthOffset;
    }

    function refresh() {
        requestAnimationFrame(apply);
    }

    function reset() {
        settings.offsetX = 0;
        settings.offsetY = 0;
        settings.scale = 1;
        settings.widthOffset = 0;
        refresh();
    }

    // ========== اتصال دکمه‌ها با منطق معکوس برای حس فارسی ==========
    function bindControls() {
        // ---- عمودی (بالا/پایین) ----
        document.getElementById('govahi-offsetY-up5')?.addEventListener('click', function() { settings.offsetY -= 5; refresh(); });
        document.getElementById('govahi-offsetY-up')?.addEventListener('click', function() { settings.offsetY -= 1; refresh(); });
        document.getElementById('govahi-offsetY-down')?.addEventListener('click', function() { settings.offsetY += 1; refresh(); });
        document.getElementById('govahi-offsetY-down5')?.addEventListener('click', function() { settings.offsetY += 5; refresh(); });

        // ---- افقی (راست/چپ) ----
        document.getElementById('govahi-offsetX-right5')?.addEventListener('click', function() { settings.offsetX -= 5; refresh(); }); // "راست +" → حرکت به چپ
        document.getElementById('govahi-offsetX-right')?.addEventListener('click', function() { settings.offsetX -= 1; refresh(); });
        document.getElementById('govahi-offsetX-left')?.addEventListener('click', function() { settings.offsetX += 1; refresh(); });   // "راست -" → حرکت به راست
        document.getElementById('govahi-offsetX-left5')?.addEventListener('click', function() { settings.offsetX += 5; refresh(); });

        // ---- پهنا (width) ----
        document.getElementById('govahi-width-inc5')?.addEventListener('click', function() { settings.widthOffset += 5; refresh(); });
        document.getElementById('govahi-width-inc')?.addEventListener('click', function() { settings.widthOffset += 1; refresh(); });
        document.getElementById('govahi-width-dec')?.addEventListener('click', function() { settings.widthOffset -= 1; refresh(); });
        document.getElementById('govahi-width-dec5')?.addEventListener('click', function() { settings.widthOffset -= 5; refresh(); });

        // ---- بزرگنمایی (Zoom) ----
        document.getElementById('govahi-scale-out5')?.addEventListener('click', function() { settings.scale = Math.max(0.5, settings.scale - 0.05); refresh(); });
        document.getElementById('govahi-scale-out')?.addEventListener('click', function() { settings.scale = Math.max(0.5, settings.scale - 0.01); refresh(); });
        document.getElementById('govahi-scale-in')?.addEventListener('click', function() { settings.scale = Math.min(2, settings.scale + 0.01); refresh(); });
        document.getElementById('govahi-scale-in5')?.addEventListener('click', function() { settings.scale = Math.min(2, settings.scale + 0.05); refresh(); });

        // ---- تنظیم مجدد ----
        document.getElementById('govahi-reset-settings-btn')?.addEventListener('click', reset);

        updateDisplay();
    }

    // ========== پایش DOM برای بازسازی Angular ==========
    var observer = new MutationObserver(function() {
        if (document.getElementById('print-content')) {
            refresh();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // ========== API عمومی ==========
    GovahiApp.printSettings = {
        apply: apply,
        reset: reset,
        bindControls: bindControls,
        getSettings: function() { return Object.assign({}, settings); }
    };

    console.log('✅ print-settings module loaded. (with widthOffset, arrow-style)');
})();
