// C:\Users\manager\Desktop\sida cod\govahiM1\modules\print-settings.js
(function() {
    'use strict';
    window.GovahiApp = window.GovahiApp || {};

    // ========== State ==========
    var settings = {
        offsetX: 0,
        offsetY: 0,
        scale: 1,
        widthOffset: 0,
        cardGap: 0,
        cardGapH: 0
    };

    var baseWidth = null;

    // ========== اعمال تنظیمات ==========
    function apply() {
        var target = document.getElementById('print-content');
        if (!target || !document.body.contains(target)) return;

        if (baseWidth === null) {
            baseWidth = target.getBoundingClientRect().width;
        }

        // رفع محدودیت‌ها
        target.style.setProperty('max-height', 'none', 'important');
        target.style.setProperty('max-width', 'none', 'important');
        target.style.setProperty('overflow', 'visible', 'important');
        target.style.setProperty('margin', '0', 'important');
        target.style.setProperty('padding', '0', 'important');

        // عرض
        var newWidth = baseWidth + settings.widthOffset;
        target.style.setProperty('width', newWidth + 'px', 'important');

        // transform
        var transformValue = 'translate(' + (-settings.offsetX) + 'px, ' + settings.offsetY + 'px) scale(' + settings.scale + ')';
        target.style.setProperty('transform', transformValue, 'important');
        target.style.setProperty('transform-origin', 'top right', 'important');

        // فاصلهٔ عمودی
        var allCards = target.querySelectorAll('.col-md-6');
        allCards.forEach(function(card) {
            card.style.marginBottom = settings.cardGap + 'px';
        });

        // فاصلهٔ افقی
        var row = target.querySelector('.row.printt');
        if (row) {
            if (settings.cardGapH > 0) {
                // فعال‌سازی grid با column-gap
                row.style.display = 'grid';
                row.style.gridTemplateColumns = '1fr 1fr';
                row.style.gap = '';                   // پاک‌سازی gap احتمالی
                row.style.columnGap = settings.cardGapH + 'px';
                row.style.rowGap = '0';
                row.style.alignItems = 'start';
                allCards.forEach(function(card) {
                    card.style.width = '';
                    card.style.marginLeft = '';
                    card.style.flex = '';
                });
                console.log('📏 فاصله افقی تنظیم شد:', settings.cardGapH + 'px');
            } else {
                // بازگشت به حالت اولیه (float)
                row.style.display = '';
                row.style.gridTemplateColumns = '';
                row.style.gap = '';
                row.style.columnGap = '';
                row.style.rowGap = '';
                row.style.alignItems = '';
                allCards.forEach(function(card) {
                    card.style.width = '';
                    card.style.marginLeft = '';
                    card.style.flex = '';
                });
                console.log('📏 فاصله افقی غیرفعال شد.');
            }
        }

        // دکمهٔ چاپ
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
        var cg = document.getElementById('govahi-cardGap-val');
        var ch = document.getElementById('govahi-cardGapH-val');

        if (ox) ox.textContent = settings.offsetX;
        if (oy) oy.textContent = settings.offsetY;
        if (sc) sc.textContent = Math.round(settings.scale * 100) + '%';
        if (wd) wd.textContent = settings.widthOffset;
        if (cg) cg.textContent = settings.cardGap;
        if (ch) ch.textContent = settings.cardGapH;
    }

    function refresh() {
        requestAnimationFrame(apply);
    }

    function reset() {
        settings.offsetX = 0;
        settings.offsetY = 0;
        settings.scale = 1;
        settings.widthOffset = 0;
        settings.cardGap = 0;
        settings.cardGapH = 0;
        baseWidth = null;
        refresh();
    }

    // ========== اتصال دکمه‌ها ==========
    function bindControls() {
        // بالا
        document.getElementById('govahi-offsetY-up-dec5')?.addEventListener('click', function() { settings.offsetY -= 5; refresh(); });
        document.getElementById('govahi-offsetY-up-dec')?.addEventListener('click', function() { settings.offsetY -= 1; refresh(); });
        document.getElementById('govahi-offsetY-up-inc')?.addEventListener('click', function() { settings.offsetY += 1; refresh(); });
        document.getElementById('govahi-offsetY-up-inc5')?.addEventListener('click', function() { settings.offsetY += 5; refresh(); });

        // راست
        document.getElementById('govahi-offsetX-right-dec5')?.addEventListener('click', function() { settings.offsetX -= 5; refresh(); });
        document.getElementById('govahi-offsetX-right-dec')?.addEventListener('click', function() { settings.offsetX -= 1; refresh(); });
        document.getElementById('govahi-offsetX-right-inc')?.addEventListener('click', function() { settings.offsetX += 1; refresh(); });
        document.getElementById('govahi-offsetX-right-inc5')?.addEventListener('click', function() { settings.offsetX += 5; refresh(); });

        // پهنا
        document.getElementById('govahi-width-dec5')?.addEventListener('click', function() { settings.widthOffset -= 5; refresh(); });
        document.getElementById('govahi-width-dec')?.addEventListener('click', function() { settings.widthOffset -= 1; refresh(); });
        document.getElementById('govahi-width-inc')?.addEventListener('click', function() { settings.widthOffset += 1; refresh(); });
        document.getElementById('govahi-width-inc5')?.addEventListener('click', function() { settings.widthOffset += 5; refresh(); });

        // فاصلهٔ عمودی
        document.getElementById('govahi-cardGap-dec5')?.addEventListener('click', function() { settings.cardGap -= 5; refresh(); });
        document.getElementById('govahi-cardGap-dec')?.addEventListener('click', function() { settings.cardGap -= 1; refresh(); });
        document.getElementById('govahi-cardGap-inc')?.addEventListener('click', function() { settings.cardGap += 1; refresh(); });
        document.getElementById('govahi-cardGap-inc5')?.addEventListener('click', function() { settings.cardGap += 5; refresh(); });

        // فاصلهٔ افقی (با اطمینان از غیرمنفی بودن)
        document.getElementById('govahi-cardGapH-dec5')?.addEventListener('click', function() { settings.cardGapH = Math.max(0, settings.cardGapH - 5); refresh(); });
        document.getElementById('govahi-cardGapH-dec')?.addEventListener('click', function() { settings.cardGapH = Math.max(0, settings.cardGapH - 1); refresh(); });
        document.getElementById('govahi-cardGapH-inc')?.addEventListener('click', function() { settings.cardGapH += 1; refresh(); });
        document.getElementById('govahi-cardGapH-inc5')?.addEventListener('click', function() { settings.cardGapH += 5; refresh(); });

        // بزرگنمایی
        document.getElementById('govahi-scale-out5')?.addEventListener('click', function() { settings.scale = Math.max(0.5, settings.scale - 0.05); refresh(); });
        document.getElementById('govahi-scale-out')?.addEventListener('click', function() { settings.scale = Math.max(0.5, settings.scale - 0.01); refresh(); });
        document.getElementById('govahi-scale-in')?.addEventListener('click', function() { settings.scale = Math.min(2, settings.scale + 0.01); refresh(); });
        document.getElementById('govahi-scale-in5')?.addEventListener('click', function() { settings.scale = Math.min(2, settings.scale + 0.05); refresh(); });

        // تنظیم مجدد
        document.getElementById('govahi-reset-settings-btn')?.addEventListener('click', reset);

        updateDisplay();
    }

    GovahiApp.printSettings = {
        apply: apply,
        reset: reset,
        bindControls: bindControls,
        getSettings: function() { return Object.assign({}, settings); }
    };

    console.log('✅ print-settings module loaded. (clean grid gap)');
})();
