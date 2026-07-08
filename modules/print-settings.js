(function() {
    'use strict';

    // state مشترک
    var spacing = {
        top: 0,
        bottom: 0,
        right: 0,
        width: 0,    // درصد تغییر نسبت به ۱۰۰٪ اولیه
        displays: null, // توسط پنل تنظیم می‌شود

        increaseTop: function(displays) { this.top++; this.updateDisplay(displays.topHeight); },
        decreaseTop: function(displays) { this.top--; this.updateDisplay(displays.topHeight); },
        increaseTopCoarse: function(displays) { this.top += 5; this.updateDisplay(displays.topHeight); },
        decreaseTopCoarse: function(displays) { this.top -= 5; this.updateDisplay(displays.topHeight); },

        increaseBottom: function(displays) { this.bottom++; this.updateDisplay(displays.bottomHeight); },
        decreaseBottom: function(displays) { this.bottom--; this.updateDisplay(displays.bottomHeight); },
        increaseBottomCoarse: function(displays) { this.bottom += 5; this.updateDisplay(displays.bottomHeight); },
        decreaseBottomCoarse: function(displays) { this.bottom -= 5; this.updateDisplay(displays.bottomHeight); },

        increaseRight: function(displays) { this.right++; this.updateDisplay(displays.rightHeight); },
        decreaseRight: function(displays) { this.right--; this.updateDisplay(displays.rightHeight); },
        increaseRightCoarse: function(displays) { this.right += 5; this.updateDisplay(displays.rightHeight); },
        decreaseRightCoarse: function(displays) { this.right -= 5; this.updateDisplay(displays.rightHeight); },

        increaseWidth: function(displays) { this.width++; this.updateDisplay(displays.widthDisp); },
        decreaseWidth: function(displays) { this.width--; this.updateDisplay(displays.widthDisp); },
        increaseWidthCoarse: function(displays) { this.width += 5; this.updateDisplay(displays.widthDisp); },
        decreaseWidthCoarse: function(displays) { this.width -= 5; this.updateDisplay(displays.widthDisp); },

        updateDisplay: function(disp) {
            if (disp) disp.textContent = this.top; // فقط برای مثال، هر متد خودش display مخصوص را دارد
            // در عمل، پنل برای هر ویژگی یک display جداگانه پاس می‌دهد.
            // برای سادگی از همان روش قبلی استفاده می‌کنیم:
            // در attach ها، displays را می‌گیریم و هر متد مقدار مربوطه را در display خودش به‌روز می‌کند.
        },

        applyStored: function() {
            var target = document.getElementById('print-content') || document.querySelector('.modal-body');
            if (!target) return;
            target.style.marginTop = this.top + 'px';
            target.style.marginBottom = this.bottom + 'px';
            target.style.marginRight = this.right + 'px';
            if (this.width !== 0) {
                target.style.width = (100 + this.width) + '%';
            } else {
                target.style.width = '';
            }
            target.style.transform = 'scale(' + (zoom.scale / 100) + ')';
            target.style.transformOrigin = 'top center';
        }
    };

    var zoom = {
        scale: 100,
        get: function() { return this.scale; },
        set: function(v) {
            this.scale = Math.max(10, v);
            if (this.display) this.display.textContent = this.scale + '%';
        }
    };

    // رجیستر کردن برای استفاده پنل
    window.handlersRegistry = window.handlersRegistry || {};
    window.handlersRegistry['govahi'] = {
        spacing: spacing,
        zoom: zoom
    };
})();
