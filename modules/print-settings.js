// C:\Users\manager\Desktop\sida cod\govahiM1\modules\print-settings.js
(function() {
    'use strict';
    window.GovahiApp = window.GovahiApp || {};

    var settings = {
        offsetX: 0,
        offsetY: 0,
        scale: 1,
        widthOffset: 0,
        cardGap: 0,
        cardGapH: 0
    };

    function apply() {
        // هیچ استایلی تغییر نمی‌کند
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

    function reset() {
        settings.offsetX = 0;
        settings.offsetY = 0;
        settings.scale = 1;
        settings.widthOffset = 0;
        settings.cardGap = 0;
        settings.cardGapH = 0;
        updateDisplay();
    }

    function bindControls() {
        // اتصال دکمه‌ها بدون تغییر واقعی
        document.getElementById('govahi-offsetY-up-dec5')?.addEventListener('click', function() { settings.offsetY -= 5; updateDisplay(); });
        document.getElementById('govahi-offsetY-up-dec')?.addEventListener('click', function() { settings.offsetY -= 1; updateDisplay(); });
        document.getElementById('govahi-offsetY-up-inc')?.addEventListener('click', function() { settings.offsetY += 1; updateDisplay(); });
        document.getElementById('govahi-offsetY-up-inc5')?.addEventListener('click', function() { settings.offsetY += 5; updateDisplay(); });
        document.getElementById('govahi-offsetX-right-dec5')?.addEventListener('click', function() { settings.offsetX -= 5; updateDisplay(); });
        document.getElementById('govahi-offsetX-right-dec')?.addEventListener('click', function() { settings.offsetX -= 1; updateDisplay(); });
        document.getElementById('govahi-offsetX-right-inc')?.addEventListener('click', function() { settings.offsetX += 1; updateDisplay(); });
        document.getElementById('govahi-offsetX-right-inc5')?.addEventListener('click', function() { settings.offsetX += 5; updateDisplay(); });
        document.getElementById('govahi-width-dec5')?.addEventListener('click', function() { settings.widthOffset -= 5; updateDisplay(); });
        document.getElementById('govahi-width-dec')?.addEventListener('click', function() { settings.widthOffset -= 1; updateDisplay(); });
        document.getElementById('govahi-width-inc')?.addEventListener('click', function() { settings.widthOffset += 1; updateDisplay(); });
        document.getElementById('govahi-width-inc5')?.addEventListener('click', function() { settings.widthOffset += 5; updateDisplay(); });
        document.getElementById('govahi-cardGap-dec5')?.addEventListener('click', function() { settings.cardGap -= 5; updateDisplay(); });
        document.getElementById('govahi-cardGap-dec')?.addEventListener('click', function() { settings.cardGap -= 1; updateDisplay(); });
        document.getElementById('govahi-cardGap-inc')?.addEventListener('click', function() { settings.cardGap += 1; updateDisplay(); });
        document.getElementById('govahi-cardGap-inc5')?.addEventListener('click', function() { settings.cardGap += 5; updateDisplay(); });
        document.getElementById('govahi-cardGapH-dec5')?.addEventListener('click', function() { settings.cardGapH = Math.max(0, settings.cardGapH - 5); updateDisplay(); });
        document.getElementById('govahi-cardGapH-dec')?.addEventListener('click', function() { settings.cardGapH = Math.max(0, settings.cardGapH - 1); updateDisplay(); });
        document.getElementById('govahi-cardGapH-inc')?.addEventListener('click', function() { settings.cardGapH += 1; updateDisplay(); });
        document.getElementById('govahi-cardGapH-inc5')?.addEventListener('click', function() { settings.cardGapH += 5; updateDisplay(); });
        document.getElementById('govahi-scale-out5')?.addEventListener('click', function() { settings.scale = Math.max(0.5, settings.scale - 0.05); updateDisplay(); });
        document.getElementById('govahi-scale-out')?.addEventListener('click', function() { settings.scale = Math.max(0.5, settings.scale - 0.01); updateDisplay(); });
        document.getElementById('govahi-scale-in')?.addEventListener('click', function() { settings.scale = Math.min(2, settings.scale + 0.01); updateDisplay(); });
        document.getElementById('govahi-scale-in5')?.addEventListener('click', function() { settings.scale = Math.min(2, settings.scale + 0.05); updateDisplay(); });
        document.getElementById('govahi-reset-settings-btn')?.addEventListener('click', reset);
        updateDisplay();
    }

    GovahiApp.printSettings = {
        apply: apply,
        reset: reset,
        bindControls: bindControls,
        getSettings: function() { return Object.assign({}, settings); }
    };

    console.log('✅ print-settings module loaded (غیرعملیاتی).');
})();
