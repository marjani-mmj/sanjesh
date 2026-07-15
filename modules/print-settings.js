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
        var _bind = function(id, action) {
            var el = document.getElementById(id);
            if (el) el.addEventListener('click', action);
        };

        _bind('govahi-offsetY-up-dec5', function() { settings.offsetY -= 5; apply(); });
        _bind('govahi-offsetY-up-dec', function() { settings.offsetY -= 1; apply(); });
        _bind('govahi-offsetY-up-inc', function() { settings.offsetY += 1; apply(); });
        _bind('govahi-offsetY-up-inc5', function() { settings.offsetY += 5; apply(); });

        _bind('govahi-offsetX-right-dec5', function() { settings.offsetX -= 5; apply(); });
        _bind('govahi-offsetX-right-dec', function() { settings.offsetX -= 1; apply(); });
        _bind('govahi-offsetX-right-inc', function() { settings.offsetX += 1; apply(); });
        _bind('govahi-offsetX-right-inc5', function() { settings.offsetX += 5; apply(); });

        _bind('govahi-width-dec5', function() { settings.widthOffset -= 5; apply(); });
        _bind('govahi-width-dec', function() { settings.widthOffset -= 1; apply(); });
        _bind('govahi-width-inc', function() { settings.widthOffset += 1; apply(); });
        _bind('govahi-width-inc5', function() { settings.widthOffset += 5; apply(); });

        _bind('govahi-cardGap-dec5', function() { settings.cardGap -= 5; apply(); });
        _bind('govahi-cardGap-dec', function() { settings.cardGap -= 1; apply(); });
        _bind('govahi-cardGap-inc', function() { settings.cardGap += 1; apply(); });
        _bind('govahi-cardGap-inc5', function() { settings.cardGap += 5; apply(); });

        _bind('govahi-cardGapH-dec5', function() { settings.cardGapH = Math.max(0, settings.cardGapH - 5); apply(); });
        _bind('govahi-cardGapH-dec', function() { settings.cardGapH = Math.max(0, settings.cardGapH - 1); apply(); });
        _bind('govahi-cardGapH-inc', function() { settings.cardGapH += 1; apply(); });
        _bind('govahi-cardGapH-inc5', function() { settings.cardGapH += 5; apply(); });

        _bind('govahi-scale-out5', function() { settings.scale = Math.max(0.5, settings.scale - 0.05); apply(); });
        _bind('govahi-scale-out', function() { settings.scale = Math.max(0.5, settings.scale - 0.01); apply(); });
        _bind('govahi-scale-in', function() { settings.scale = Math.min(2, settings.scale + 0.01); apply(); });
        _bind('govahi-scale-in5', function() { settings.scale = Math.min(2, settings.scale + 0.05); apply(); });

        _bind('govahi-reset-settings-btn', reset);

        updateDisplay();
    }

    GovahiApp.printSettings = {
        apply: apply,
        reset: reset,
        bindControls: bindControls,
        getSettings: function() { return Object.assign({}, settings); }
    };

    console.log('تنظیمات چاپ بارگذاری شد.');
})();
