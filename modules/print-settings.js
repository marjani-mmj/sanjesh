(function() {
    'use strict';

    var spacing = {
        top: 0,
        bottom: 0,
        right: 0,
        width: 0,    // درصد تغییر نسبت به ۱۰۰٪ اولیه

        applyStored: function() {
            var target = document.getElementById('print-content') || document.querySelector('.modal-body');
            if (!target) {
                console.warn('print-settings: المان مقصد یافت نشد.');
                return;
            }
            // استفاده از !important برای اطمینان از اعمال
            target.style.setProperty('margin-top', this.top + 'px', 'important');
            target.style.setProperty('margin-bottom', this.bottom + 'px', 'important');
            target.style.setProperty('margin-right', this.right + 'px', 'important');
            if (this.width !== 0) {
                target.style.setProperty('width', (100 + this.width) + '%', 'important');
            } else {
                target.style.setProperty('width', '', 'important'); // بازنشانی
            }
            var scale = zoom.get() / 100;
            target.style.setProperty('transform', 'scale(' + scale + ')', 'important');
            target.style.setProperty('transform-origin', 'top center', 'important');
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

    // رجیستری برای استفاده پنل
    window.handlersRegistry = window.handlersRegistry || {};
    window.handlersRegistry['govahi'] = {
        spacing: spacing,
        zoom: zoom
    };
})();
