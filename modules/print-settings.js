// C:\Users\manager\Desktop\sida cod\govahiM1\modules\print-settings.js
(function() {
    'use strict';
    window.GovahiApp = window.GovahiApp || {};

    // ========== State ==========
    var settings = {
        offsetX: 0,   // جابه‌جایی افقی (منفی = فضای صحافی راست)
        offsetY: 0,   // جابه‌جایی عمودی (مثبت = پایین)
        scale: 1      // بزرگنمایی (۱ = ۱۰۰٪)
    };

    // ========== اعمال تنظیمات روی #print-content ==========
    function apply() {
        var target = document.getElementById('print-content');
        if (!target || !document.body.contains(target)) {
            return; // اگر عنصر حذف شده باشد
        }

        // حذف محدودیت‌های ارتفاع و overflow
        target.style.setProperty('max-height', 'none', 'important');
        target.style.setProperty('overflow', 'visible', 'important');

        // صفر کردن margin و padding قبلی
        target.style.setProperty('margin', '0', 'important');
        target.style.setProperty('padding', '0', 'important');

        // ساخت transform ترکیبی
        var transformValue = 'translate(' + settings.offsetX + 'px, ' + settings.offsetY + 'px) scale(' + settings.scale + ')';
        target.style.setProperty('transform', transformValue, 'important');
        target.style.setProperty('transform-origin', 'top right', 'important');

        updateDisplay();
    }

    // ========== به‌روزرسانی نمایشگرهای پنل ==========
    function updateDisplay() {
        var ox = document.getElementById('govahi-offsetX-val');
        var oy = document.getElementById('govahi-offsetY-val');
        var sc = document.getElementById('govahi-scale-val');
        if (ox) ox.textContent = settings.offsetX;
        if (oy) oy.textContent = settings.offsetY;
        if (sc) sc.textContent = Math.round(settings.scale * 100) + '%';
    }

    // ========== درخواست اجرای apply در فریم بعدی (برای هماهنگی با Angular) ==========
    function refresh() {
        requestAnimationFrame(apply);
    }

    // ========== تنظیم مجدد (Reset) ==========
    function reset() {
        settings.offsetX = 0;
        settings.offsetY = 0;
        settings.scale = 1;
        refresh();
    }

    // ========== اتصال دکمه‌های پنل ==========
    function bindControls() {
        // ---- عمودی (بالا / پایین) ----
        document.getElementById('govahi-offsetY-up5')?.addEventListener('click', function() { settings.offsetY -= 5; refresh(); });
        document.getElementById('govahi-offsetY-up')?.addEventListener('click', function() { settings.offsetY -= 1; refresh(); });
        document.getElementById('govahi-offsetY-down')?.addEventListener('click', function() { settings.offsetY += 1; refresh(); });
        document.getElementById('govahi-offsetY-down5')?.addEventListener('click', function() { settings.offsetY += 5; refresh(); });

        // ---- افقی (راست / چپ) ----
        document.getElementById('govahi-offsetX-left5')?.addEventListener('click', function() { settings.offsetX -= 5; refresh(); });
        document.getElementById('govahi-offsetX-left')?.addEventListener('click', function() { settings.offsetX -= 1; refresh(); });
        document.getElementById('govahi-offsetX-right')?.addEventListener('click', function() { settings.offsetX += 1; refresh(); });
        document.getElementById('govahi-offsetX-right5')?.addEventListener('click', function() { settings.offsetX += 5; refresh(); });

        // ---- بزرگنمایی (Zoom) ----
        document.getElementById('govahi-scale-out5')?.addEventListener('click', function() { settings.scale = Math.max(0.5, settings.scale - 0.05); refresh(); });
        document.getElementById('govahi-scale-out')?.addEventListener('click', function() { settings.scale = Math.max(0.5, settings.scale - 0.01); refresh(); });
        document.getElementById('govahi-scale-in')?.addEventListener('click', function() { settings.scale = Math.min(2, settings.scale + 0.01); refresh(); });
        document.getElementById('govahi-scale-in5')?.addEventListener('click', function() { settings.scale = Math.min(2, settings.scale + 0.05); refresh(); });

        // ---- دکمه تنظیم مجدد ----
        document.getElementById('govahi-reset-settings-btn')?.addEventListener('click', reset);

        // مقداردهی اولیه
        updateDisplay();
    }

    // ========== پایش تغییرات DOM (وقتی Angular مودال را بازسازی می‌کند) ==========
    var observer = new MutationObserver(function() {
        // اگر print-content دوباره ظاهر شد، تنظیمات را اعمال کن
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
        getSettings: function() {
            return Object.assign({}, settings); // کپی محافظ
        }
    };

    console.log('✅ print-settings module loaded. (transform-based, arrow buttons)');
})();
