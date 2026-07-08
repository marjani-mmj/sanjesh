(function() {
    'use strict';
    window.GovahiApp = window.GovahiApp || {};

    // ---------- state تنظیمات چاپ ----------
    var spacing = {
        top: 0,
        bottom: 0,
        right: 0,
        width: 0,
        scale: 100
    };

    function applySettings() {
        var target = document.getElementById('print-content');
        if (!target) return;

        // حذف max-height و overflow برای نمایش کامل تغییرات (اختیاری)
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

        target.style.setProperty('transform', 'scale(' + (spacing.scale / 100) + ')', 'important');
        target.style.setProperty('transform-origin', 'top center', 'important');
    }

    // ========== استایل‌ها ==========
    var style = document.createElement('style');
    style.textContent = `
        #govahi-panel {
            position: fixed; top: 100px; left: 20px; width: 300px;
            background: #fff; border: 1px solid #ddd; border-radius: 8px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.2); z-index: 100000;
            font-family: Tahoma, sans-serif; font-size: 13px;
            display: none; user-select: none;
        }
        #govahi-panel .panel-header {
            cursor: move; background: #f8f9fa;
            padding: 6px 30px 6px 10px;
            margin: -1px -1px 10px -1px;
            border-radius: 8px 8px 0 0;
            font-weight: bold; color: #333;
            border-bottom: 1px solid #dee2e6;
            position: relative;
        }
        #govahi-panel .panel-header .close-btn {
            position: absolute; top: 4px; right: 8px;
            font-size: 18px; font-weight: bold; color: #888;
            cursor: pointer; line-height: 1;
        }
        #govahi-panel .panel-body { padding: 10px 12px 12px; }
        #govahi-panel .section-title { font-weight: bold; color: #495057; margin-bottom: 5px; }
        #govahi-panel .row-control { display: flex; align-items: center; margin-bottom: 6px; }
        #govahi-panel .row-control .label { width: 45px; text-align: right; margin-left: 5px; font-weight: bold; color: #495057; }
        #govahi-panel button.ctrl-btn {
            width: 28px; height: 28px; font-size: 16px; font-weight: bold;
            line-height: 1; margin: 0 2px; background: #e9ecef;
            border: 1px solid #ced4da; border-radius: 4px; cursor: pointer; color: #495057;
        }
        #govahi-panel button.ctrl-btn.coarse-dec { background: #ffc9c9; border-color: #ff8787; color: #c92a2a; }
        #govahi-panel button.ctrl-btn.coarse-inc { background: #b2f2bb; border-color: #51cf66; color: #2b8a3e; }
        #govahi-panel .value-display { width: 36px; text-align: center; font-weight: bold; font-size: 14px; color: #0050ef; }
        #govahi-panel .zoom-display { width: 45px; }
        #govahi-panel button.apply-btn {
            margin-top: 8px; width: 100%; padding: 6px;
            background: #0050ef; color: white; border: none;
            border-radius: 6px; font-weight: bold; cursor: pointer;
        }
        #govahi-panel .separator { border-top: 1px solid #dee2e6; margin: 10px 0; }
        #govahi-panel .status { font-size: 12px; color: #28a745; margin-top: 5px; text-align: center; }
        #govahi-floating-toggle {
            position: fixed; bottom: 20px; left: 20px;
            z-index: 999999; width: 48px; height: 48px;
            background: linear-gradient(135deg, #007bff, #0056b3);
            border-radius: 50%; display: flex;
            align-items: center; justify-content: center;
            font-size: 26px; color: white; cursor: pointer;
            box-shadow: 0 6px 12px rgba(0,0,0,0.4);
            user-select: none; transition: transform 0.2s;
        }
        #govahi-floating-toggle:hover { transform: scale(1.1); }
        #govahi-panel button.action-btn {
            width: 100%; padding: 6px; margin-bottom: 6px;
            background: #007bff; color: white; border: none;
            border-radius: 4px; cursor: pointer; font-weight: bold;
        }
        #govahi-panel button.action-btn:disabled { background: #6c757d; cursor: not-allowed; }
    `;
    document.head.appendChild(style);

    // ========== دکمه شناور ==========
    var toggleIcon = document.createElement('div');
    toggleIcon.id = 'govahi-floating-toggle';
    toggleIcon.innerHTML = '⚙️';
    toggleIcon.title = 'تنظیمات چاپ و گواهینامه';
    document.body.appendChild(toggleIcon);

    // ========== پنل ==========
    var panel = document.createElement('div');
    panel.id = 'govahi-panel';
    panel.innerHTML = `
        <div class="panel-header" id="govahi-panel-header">
            <span>تنظیمات گواهینامه</span>
            <span class="close-btn" id="govahi-close-btn">&times;</span>
        </div>
        <div class="panel-body">
            <!-- بخش تنظیمات چاپ -->
            <div class="section-title">📏 حاشیه‌ها و بزرگنمایی</div>

            <div class="row-control">
                <span class="label">بالا</span>
                <button class="ctrl-btn coarse-dec" id="govahi-marginTopDec5">−۵</button>
                <button class="ctrl-btn" id="govahi-marginTopDec">−</button>
                <span class="value-display" id="govahi-marginTopVal">0</span>
                <button class="ctrl-btn" id="govahi-marginTopInc">+</button>
                <button class="ctrl-btn coarse-inc" id="govahi-marginTopInc5">+۵</button>
            </div>
            <div class="row-control">
                <span class="label">پایین</span>
                <button class="ctrl-btn coarse-dec" id="govahi-marginBottomDec5">−۵</button>
                <button class="ctrl-btn" id="govahi-marginBottomDec">−</button>
                <span class="value-display" id="govahi-marginBottomVal">0</span>
                <button class="ctrl-btn" id="govahi-marginBottomInc">+</button>
                <button class="ctrl-btn coarse-inc" id="govahi-marginBottomInc5">+۵</button>
            </div>
            <div class="row-control">
                <span class="label">راست</span>
                <button class="ctrl-btn coarse-dec" id="govahi-marginRightDec5">−۵</button>
                <button class="ctrl-btn" id="govahi-marginRightDec">−</button>
                <span class="value-display" id="govahi-marginRightVal">0</span>
                <button class="ctrl-btn" id="govahi-marginRightInc">+</button>
                <button class="ctrl-btn coarse-inc" id="govahi-marginRightInc5">+۵</button>
            </div>
            <div class="row-control">
                <span class="label">پهنا</span>
                <button class="ctrl-btn coarse-dec" id="govahi-widthDec5">−۵</button>
                <button class="ctrl-btn" id="govahi-widthDec">−</button>
                <span class="value-display" id="govahi-widthVal">0</span>
                <button class="ctrl-btn" id="govahi-widthInc">+</button>
                <button class="ctrl-btn coarse-inc" id="govahi-widthInc5">+۵</button>
            </div>
            <div class="row-control">
                <span class="label">Zoom</span>
                <button class="ctrl-btn coarse-dec" id="govahi-zoomDec5">−۵</button>
                <button class="ctrl-btn" id="govahi-zoomDec">−</button>
                <span class="value-display zoom-display" id="govahi-zoomVal">100%</span>
                <button class="ctrl-btn" id="govahi-zoomInc">+</button>
                <button class="ctrl-btn coarse-inc" id="govahi-zoomInc5">+۵</button>
            </div>

            <button class="apply-btn" id="govahi-applySettingsBtn">اعمال تنظیمات</button>

            <div class="separator"></div>

            <!-- بخش عملیات گواهینامه -->
            <div class="section-title">📋 عملیات گواهینامه</div>
            <button class="action-btn" id="govahi-extract-btn">📋 استخراج و هایلایت</button>
            <button class="action-btn" id="govahi-send-to-api-btn" disabled>📤 ارسال به API</button>
            <div class="status" id="govahi-status-msg"></div>

            <div style="margin-top:10px; text-align:center; font-size:11px; color:#adb5bd;">
                آموزش و پرورش خلیل آباد<br>کارشناسی سنجش
            </div>
        </div>
    `;
    document.body.appendChild(panel);

    // ========== نمایش / مخفی ==========
    var isPanelVisible = false;
    toggleIcon.addEventListener('click', function() {
        if (isPanelVisible) {
            panel.style.display = 'none';
            toggleIcon.innerHTML = '⚙️';
        } else {
            panel.style.display = 'block';
            toggleIcon.innerHTML = '🔧';
        }
        isPanelVisible = !isPanelVisible;
    });

    document.getElementById('govahi-close-btn').addEventListener('click', function(e) {
        e.stopPropagation();
        panel.style.display = 'none';
        toggleIcon.innerHTML = '⚙️';
        isPanelVisible = false;
    });

    // ========== قابلیت درگ ==========
    (function() {
        var header = document.getElementById('govahi-panel-header');
        var dragging = false, startX, startY, initialLeft, initialTop;

        header.addEventListener('mousedown', function(e) {
            if (e.target.id === 'govahi-close-btn') return;
            e.preventDefault();
            dragging = true;
            startX = e.clientX;
            startY = e.clientY;
            var rect = panel.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
            panel.style.transition = 'none';
        });

        document.addEventListener('mousemove', function(e) {
            if (!dragging) return;
            e.preventDefault();
            panel.style.left = (initialLeft + e.clientX - startX) + 'px';
            panel.style.top = (initialTop + e.clientY - startY) + 'px';
        });

        document.addEventListener('mouseup', function() {
            if (dragging) {
                dragging = false;
                panel.style.transition = '';
            }
        });
    })();

    // ========== اتصال کنترل‌های چاپ ==========
    function updateDisplay() {
        document.getElementById('govahi-marginTopVal').textContent = spacing.top;
        document.getElementById('govahi-marginBottomVal').textContent = spacing.bottom;
        document.getElementById('govahi-marginRightVal').textContent = spacing.right;
        document.getElementById('govahi-widthVal').textContent = spacing.width;
        document.getElementById('govahi-zoomVal').textContent = spacing.scale + '%';
    }

    document.getElementById('govahi-marginTopInc').addEventListener('click', function() { spacing.top++; updateDisplay(); });
    document.getElementById('govahi-marginTopDec').addEventListener('click', function() { spacing.top--; updateDisplay(); });
    document.getElementById('govahi-marginTopInc5').addEventListener('click', function() { spacing.top += 5; updateDisplay(); });
    document.getElementById('govahi-marginTopDec5').addEventListener('click', function() { spacing.top -= 5; updateDisplay(); });

    document.getElementById('govahi-marginBottomInc').addEventListener('click', function() { spacing.bottom++; updateDisplay(); });
    document.getElementById('govahi-marginBottomDec').addEventListener('click', function() { spacing.bottom--; updateDisplay(); });
    document.getElementById('govahi-marginBottomInc5').addEventListener('click', function() { spacing.bottom += 5; updateDisplay(); });
    document.getElementById('govahi-marginBottomDec5').addEventListener('click', function() { spacing.bottom -= 5; updateDisplay(); });

    document.getElementById('govahi-marginRightInc').addEventListener('click', function() { spacing.right++; updateDisplay(); });
    document.getElementById('govahi-marginRightDec').addEventListener('click', function() { spacing.right--; updateDisplay(); });
    document.getElementById('govahi-marginRightInc5').addEventListener('click', function() { spacing.right += 5; updateDisplay(); });
    document.getElementById('govahi-marginRightDec5').addEventListener('click', function() { spacing.right -= 5; updateDisplay(); });

    document.getElementById('govahi-widthInc').addEventListener('click', function() { spacing.width++; updateDisplay(); });
    document.getElementById('govahi-widthDec').addEventListener('click', function() { spacing.width--; updateDisplay(); });
    document.getElementById('govahi-widthInc5').addEventListener('click', function() { spacing.width += 5; updateDisplay(); });
    document.getElementById('govahi-widthDec5').addEventListener('click', function() { spacing.width -= 5; updateDisplay(); });

    document.getElementById('govahi-zoomInc').addEventListener('click', function() { spacing.scale = Math.min(200, spacing.scale + 1); updateDisplay(); });
    document.getElementById('govahi-zoomDec').addEventListener('click', function() { spacing.scale = Math.max(10, spacing.scale - 1); updateDisplay(); });
    document.getElementById('govahi-zoomInc5').addEventListener('click', function() { spacing.scale = Math.min(200, spacing.scale + 5); updateDisplay(); });
    document.getElementById('govahi-zoomDec5').addEventListener('click', function() { spacing.scale = Math.max(10, spacing.scale - 5); updateDisplay(); });

    document.getElementById('govahi-applySettingsBtn').addEventListener('click', applySettings);

    // ========== API عمومی (برای govahiM1.js) ==========
    GovahiApp.ui = {
        togglePanel: function() {
            if (panel.style.display === 'none') {
                panel.style.display = 'block';
                toggleIcon.innerHTML = '🔧';
                isPanelVisible = true;
            } else {
                panel.style.display = 'none';
                toggleIcon.innerHTML = '⚙️';
                isPanelVisible = false;
            }
        },
        setStatus: function(msg) {
            document.getElementById('govahi-status-msg').textContent = msg;
        },
        getApiUrl: function() {
            return GovahiApp.config && GovahiApp.config.apiUrl ? GovahiApp.config.apiUrl : '';
        },
        enableSendButton: function() {
            document.getElementById('govahi-send-to-api-btn').disabled = false;
        },
        disableSendButton: function() {
            document.getElementById('govahi-send-to-api-btn').disabled = true;
        },
        onExtract: function(cb) {
            document.getElementById('govahi-extract-btn').onclick = cb;
        },
        onSend: function(cb) {
            document.getElementById('govahi-send-to-api-btn').onclick = cb;
        }
    };

    // مقداردهی اولیه نمایشگرها
    updateDisplay();
})();
